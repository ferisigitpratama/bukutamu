<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use App\Models\Office;
use App\Models\SecurityPersonnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;
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

        $recentVisitors = Visitor::with([
            'receptionist',
            'office',
            'security',
        ])
            ->orderByDesc('visited_at')
            ->limit(8)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentVisitors' => $recentVisitors,
        ]);
    }

    /**
     * Halaman input pengunjung.
     */
    public function index()
    {
        $visitors = Visitor::with([
            'receptionist',
            'office',
            'security',
        ])
            ->orderByDesc('visited_at')
            ->paginate(10);

        $offices = Office::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        $securityPersonnel = SecurityPersonnel::where('is_active', true)
            ->whereHas('office', function ($query) {
                $query->where('code', 'MOROTAI');
            })
            ->orderBy('name')
            ->get(['id', 'office_id', 'name']);

        return Inertia::render('visitors/index', [
            'visitors' => $visitors,
            'offices' => $offices,
            'securityPersonnel' => $securityPersonnel,
        ]);
    }

    /**
     * Menyimpan data pengunjung.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:25'],
            'address' => ['required', 'string'],
            'visitor_type' => ['required', 'in:perusahaan,perorangan'],

            'company' => [
                'nullable',
                'required_if:visitor_type,perusahaan',
                'string',
                'max:255',
            ],

            'purpose' => ['required', 'string'],

            'office_id' => [
                'required',
                'integer',
                Rule::exists('offices', 'id')
                    ->where('is_active', true),
            ],
        ], [
            'name.required' => 'Nama pengunjung wajib diisi.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'address.required' => 'Alamat wajib diisi.',
            'visitor_type.required' => 'Jenis pengunjung wajib dipilih.',
            'company.required_if' => 'Nama perusahaan wajib diisi.',
            'purpose.required' => 'Tujuan kunjungan wajib diisi.',
            'office_id.required' => 'Kantor tujuan wajib dipilih.',
            'office_id.exists' => 'Kantor tidak ditemukan atau tidak aktif.',
        ]);

        $office = Office::findOrFail($validated['office_id']);

        $securityId = null;

        /*
         * MOROTAI:
         * Tanggal dan waktu diisi manual.
         * Security wajib dipilih.
         */
        if ($office->code === 'MOROTAI') {
            $morotaiData = $request->validate([
                'visit_date' => [
                    'required',
                    'date_format:Y-m-d',
                ],

                'visit_time' => [
                    'required',
                    'date_format:H:i',
                ],

                'security_id' => [
                    'required',
                    'integer',
                    Rule::exists('security_personnel', 'id')
                        ->where('office_id', $office->id)
                        ->where('is_active', true),
                ],
            ], [
                'visit_date.required' => 'Tanggal kunjungan wajib diisi.',
                'visit_time.required' => 'Waktu kunjungan wajib diisi.',
                'security_id.required' => 'Nama security wajib dipilih.',
                'security_id.exists' => 'Security tidak valid atau tidak aktif.',
            ]);

            $visitedAt = Carbon::createFromFormat(
                'Y-m-d H:i',
                $morotaiData['visit_date'] . ' ' . $morotaiData['visit_time'],
                config('app.timezone')
            );

            $securityId = $morotaiData['security_id'];
        } else {
            /*
             * KIMAJA:
             * Waktu kunjungan otomatis menggunakan waktu server.
             */
            $visitedAt = now();
        }

        Visitor::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'visitor_type' => $validated['visitor_type'],
            'company' => $validated['company'] ?? null,
            'purpose' => $validated['purpose'],
            'receptionist_id' => Auth::id(),
            'office_id' => $office->id,
            'security_id' => $securityId,
            'visited_at' => $visitedAt,
        ]);

        return redirect()
            ->route('visitors.index')
            ->with('success', 'Data pengunjung berhasil disimpan.');
    }

    /**
     * Menentukan rentang tanggal berdasarkan filter.
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
     * Memvalidasi filter kantor.
     */
    private function getOfficeFilter(Request $request): ?int
    {
        $validated = $request->validate([
            'office_id' => [
                'nullable',
                'integer',
                Rule::exists('offices', 'id')
                    ->where('is_active', true),
            ],
        ], [
            'office_id.exists' => 'Kantor tidak ditemukan atau tidak aktif.',
        ]);

        return !empty($validated['office_id'])
            ? (int) $validated['office_id']
            : null;
    }

    /**
     * Mengambil data pengunjung sesuai periode dan kantor.
     */
    private function getVisitors(
        ?DateTimeInterface $startDate,
        ?DateTimeInterface $endDate,
        ?int $officeId = null
    ) {
        $query = Visitor::with([
            'receptionist',
            'office',
            'security',
        ]);

        if ($startDate && $endDate) {
            $query->whereBetween('visited_at', [
                $startDate,
                $endDate,
            ]);
        }

        if ($officeId !== null) {
            $query->where('office_id', $officeId);
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
        $officeId = $this->getOfficeFilter($request);

        $visitors = $this->getVisitors(
            $range['startDate'],
            $range['endDate'],
            $officeId
        );

        $kimajaVisitors = $visitors
            ->filter(fn ($visitor) => $visitor->office?->code === 'KIMAJA')
            ->values();

        $morotaiVisitors = $visitors
            ->filter(fn ($visitor) => $visitor->office?->code === 'MOROTAI')
            ->values();

        return Inertia::render('visitors/history', [
            'period' => $range['period'],
            'startDate' => $range['startDate']?->format('Y-m-d'),
            'endDate' => $range['endDate']?->format('Y-m-d'),

            'visitors' => $visitors,
            'kimajaVisitors' => $kimajaVisitors,
            'morotaiVisitors' => $morotaiVisitors,

            'offices' => Office::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'code']),

            'selectedOfficeId' => $officeId,

            'totalVisitors' => $visitors->count(),

            'companyVisitors' => $visitors
                ->where('visitor_type', 'perusahaan')
                ->count(),

            'individualVisitors' => $visitors
                ->where('visitor_type', 'perorangan')
                ->count(),
        ]);
    }

    /**
     * Export laporan pengunjung ke PDF.
     */
    public function exportPdf(Request $request)
    {
        $range = $this->getDateRange($request);
        $officeId = $this->getOfficeFilter($request);

        $visitors = $this->getVisitors(
            $range['startDate'],
            $range['endDate'],
            $officeId
        );

        $kimajaVisitors = $visitors
            ->filter(fn ($visitor) => $visitor->office?->code === 'KIMAJA')
            ->values();

        $morotaiVisitors = $visitors
            ->filter(fn ($visitor) => $visitor->office?->code === 'MOROTAI')
            ->values();

        $summary = $this->getReportSummary($visitors);

        $periodLabels = [
            'all' => 'Semua Data',
            'day' => '1 Hari',
            'week' => '1 Minggu',
            'month' => '1 Bulan',
            'custom' => 'Rentang Tanggal',
        ];

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

        $selectedOffice = $officeId
            ? Office::find($officeId)
            : null;

        $pdf = Pdf::loadView('pdf.visitors', [
            'visitors' => $visitors,
            'kimajaVisitors' => $kimajaVisitors,
            'morotaiVisitors' => $morotaiVisitors,

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

            'selectedOfficeId' => $officeId,
            'selectedOfficeCode' => $selectedOffice?->code,
            'selectedOfficeName' => $selectedOffice?->name ?? 'Semua Kantor',
        ])->setPaper('a4', 'landscape');

        $officeFileName = $selectedOffice
            ? '-' . str_replace(' ', '-', $selectedOffice->name)
            : '-Semua-Kantor';

        $fileName = 'Laporan-Pengunjung-ITN'
            . $officeFileName
            . '-'
            . $startDate->format('Ymd')
            . '-'
            . $endDate->format('Ymd')
            . '.pdf';

        return $pdf->download($fileName);
    }
}
