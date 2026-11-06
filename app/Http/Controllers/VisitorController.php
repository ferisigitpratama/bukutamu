<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DateTimeInterface;

class VisitorController extends Controller
{
    /**
     * Dashboard.
     */
    public function dashboard()
    {
        $today = now()->toDateString();

        $stats = [
            'today' => Visitor::whereDate('visited_at', $today)->count(),

            'thisMonth' => Visitor::whereMonth('visited_at', now()->month)
                ->whereYear('visited_at', now()->year)
                ->count(),

            'company' => Visitor::where('visitor_type', 'perusahaan')->count(),

            'individual' => Visitor::where('visitor_type', 'perorangan')->count(),
        ];

        $recentVisitors = Visitor::with('receptionist')
            ->orderByDesc('visited_at')
            ->limit(8)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentVisitors' => $recentVisitors,
        ]);
    }

    /**
     * Menampilkan daftar pengunjung pada halaman input.
     */
    public function index()
    {
        $visitors = Visitor::with('receptionist')
            ->orderByDesc('visited_at')
            ->paginate(10);

        return Inertia::render('visitors/index', [
            'visitors' => $visitors,
        ]);
    }

    /**
     * Menyimpan data pengunjung baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'visitor_type' => ['required', 'in:perusahaan,perorangan'],
            'company' => [
                'nullable',
                'required_if:visitor_type,perusahaan',
                'string',
                'max:255',
            ],
            'purpose' => ['required', 'string'],
        ], [
            'name.required' => 'Nama pengunjung wajib diisi.',
            'address.required' => 'Alamat wajib diisi.',
            'visitor_type.required' => 'Jenis pengunjung wajib dipilih.',
            'company.required_if' => 'Nama perusahaan wajib diisi.',
            'purpose.required' => 'Tujuan kunjungan wajib diisi.',
        ]);

        Visitor::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'visitor_type' => $validated['visitor_type'],
            'company' => $validated['company'] ?? null,
            'purpose' => $validated['purpose'],
            'receptionist_id' => Auth::id(),
            'visited_at' => now(),
        ]);

        return redirect()
            ->route('visitors.index')
            ->with('success', 'Data pengunjung berhasil disimpan.');
    }

    /**
     * Menentukan rentang tanggal berdasarkan filter.
     *
     * Periode:
     * all    = Semua data
     * day    = Hari ini
     * week   = 7 hari terakhir
     * month  = Bulan berjalan
     * custom = Rentang tanggal pilihan
     */
    private function getDateRange(Request $request): array
    {
        $validated = $request->validate([
            'period' => ['nullable', 'in:all,day,week,month,custom'],
            'start_date' => [
                'nullable',
                'required_if:period,custom',
                'date_format:Y-m-d',
            ],
            'end_date' => [
                'nullable',
                'required_if:period,custom',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
        ], [
            'period.in' => 'Pilihan periode tidak valid.',
            'start_date.required_if' => 'Tanggal awal wajib dipilih.',
            'end_date.required_if' => 'Tanggal akhir wajib dipilih.',
            'end_date.after_or_equal' => 'Tanggal akhir tidak boleh lebih awal dari tanggal awal.',
        ]);

        $period = $validated['period'] ?? 'month';

        // Semua data tidak menggunakan batas tanggal.
        if ($period === 'all') {
            return [
                'period' => 'all',
                'startDate' => null,
                'endDate' => null,
            ];
        }

        $today = now()->startOfDay();

        switch ($period) {
            case 'day':
                $startDate = $today->copy();
                $endDate = $today->copy()->endOfDay();
                break;

            case 'week':
                $startDate = $today->copy()->subDays(6);
                $endDate = $today->copy()->endOfDay();
                break;

            case 'custom':
                $startDate = Carbon::createFromFormat(
                    'Y-m-d',
                    $validated['start_date']
                )->startOfDay();

                $endDate = Carbon::createFromFormat(
                    'Y-m-d',
                    $validated['end_date']
                )->endOfDay();
                break;

            case 'month':
            default:
                $startDate = $today->copy()->startOfMonth();
                $endDate = $today->copy()->endOfDay();
                break;
        }

        return [
            'period' => $period,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];
    }

    /**
     * Mengambil data pengunjung sesuai periode.
     */
    private function getVisitors(
        ?DateTimeInterface $startDate,
        ?DateTimeInterface $endDate
    ) {
        $query = Visitor::with('receptionist');

        // Jika tanggal null, ambil seluruh data.
        if ($startDate && $endDate) {
            $query->whereBetween('visited_at', [
                $startDate,
                $endDate,
            ]);
        }

        return $query
            ->orderByDesc('visited_at')
            ->get();
    }

    /**
     * Membuat ringkasan laporan.
     */
    private function getReportSummary($visitors): array
    {
        $totalVisitors = $visitors->count();

        $companyVisitors = $visitors
            ->where('visitor_type', 'perusahaan')
            ->count();

        $individualVisitors = $visitors
            ->where('visitor_type', 'perorangan')
            ->count();

        $receptionistSummary = $visitors
            ->groupBy(function ($visitor) {
                return $visitor->receptionist->name ?? 'Tidak diketahui';
            })
            ->map(function ($items, $name) {
                return [
                    'name' => $name,
                    'total' => $items->count(),
                ];
            })
            ->sortBy('name')
            ->values();

        return [
            'totalVisitors' => $totalVisitors,
            'companyVisitors' => $companyVisitors,
            'individualVisitors' => $individualVisitors,
            'receptionistSummary' => $receptionistSummary,
        ];
    }

    /**
     * Menampilkan halaman History.
     */
    public function history(Request $request)
    {
        $range = $this->getDateRange($request);

        $visitors = $this->getVisitors(
            $range['startDate'],
            $range['endDate']
        );

        return Inertia::render('visitors/history', [
            'period' => $range['period'],
            'startDate' => $range['startDate']?->format('Y-m-d'),
            'endDate' => $range['endDate']?->format('Y-m-d'),
            'visitors' => $visitors,
            'totalVisitors' => $visitors->count(),
        ]);
    }

    /**
     * Export laporan pengunjung ke PDF.
     */
    public function exportPdf(Request $request)
    {
        $range = $this->getDateRange($request);

        $visitors = $this->getVisitors(
            $range['startDate'],
            $range['endDate']
        );

        $summary = $this->getReportSummary($visitors);

        $periodLabels = [
            'all' => 'Semua Data',
            'day' => '1 Hari',
            'week' => '1 Minggu',
            'month' => '1 Bulan',
            'custom' => 'Rentang Tanggal',
        ];

        /*
         * PDF membutuhkan tanggal awal dan akhir.
         * Untuk Semua Data, gunakan tanggal kunjungan
         * paling lama dan paling baru.
         */
        if ($range['period'] === 'all') {
            $firstVisitor = $visitors->last();
            $lastVisitor = $visitors->first();

            $startDate = $firstVisitor
                ? Carbon::parse($firstVisitor->visited_at)->startOfDay()
                : now()->startOfDay();

            $endDate = $lastVisitor
                ? Carbon::parse($lastVisitor->visited_at)->endOfDay()
                : now()->endOfDay();
        } else {
            $startDate = $range['startDate'];
            $endDate = $range['endDate'];
        }

        $logoPath = public_path('images/logo-itn.png');
        $logoData = null;

        if (File::exists($logoPath)) {
            $logoData = 'data:image/png;base64,' .
                base64_encode(File::get($logoPath));
        }

        $printedBy = Auth::user()->name ?? '-';
        $isDailyReport = $range['period'] === 'day';

        $pdf = Pdf::loadView('pdf.visitors', [
            'visitors' => $visitors,
            'totalVisitors' => $summary['totalVisitors'],
            'companyVisitors' => $summary['companyVisitors'],
            'individualVisitors' => $summary['individualVisitors'],
            'receptionistSummary' => $summary['receptionistSummary'],
            'periodLabel' => $periodLabels[$range['period']],
            'startDate' => $startDate,
            'endDate' => $endDate,
            'logoData' => $logoData,
            'printedBy' => $printedBy,
            'isDailyReport' => $isDailyReport,
        ])->setPaper('a4', 'landscape');

        $fileName = 'Laporan-Pengunjung-ITN-'
            . $startDate->format('Ymd')
            . '-'
            . $endDate->format('Ymd')
            . '.pdf';

        return $pdf->download($fileName);
    }
}