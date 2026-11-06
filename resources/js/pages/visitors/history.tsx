import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarDays,
    Download,
    FileText,
    Search,
    Users,
    Building2,
    UserRound,
    RotateCcw,
} from 'lucide-react';

interface Visitor {
    id: number;
    name: string;
    address: string;
    visitor_type: 'perusahaan' | 'perorangan';
    company: string | null;
    purpose: string;
    visited_at: string;
    receptionist: {
        name: string;
    } | null;
}

type Period = 'all' | 'day' | 'week' | 'month' | 'custom';

interface Props {
    period: Period;
    startDate: string | null;
    endDate: string | null;
    visitors: Visitor[];
    totalVisitors: number;
}

const periods: { label: string; value: Period }[] = [
    { label: 'Semua Data', value: 'all' },
    { label: '1 Hari', value: 'day' },
    { label: '1 Minggu', value: 'week' },
    { label: '1 Bulan', value: 'month' },
    { label: 'Custom', value: 'custom' },
];

export default function VisitorHistory({
    period,
    startDate,
    endDate,
    visitors,
    totalVisitors,
}: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(period);
    const [customStart, setCustomStart] = useState(startDate ?? '');
    const [customEnd, setCustomEnd] = useState(endDate ?? '');
    const [search, setSearch] = useState('');

    const applyPeriod = (value: Period) => {
        setSelectedPeriod(value);

        if (value === 'custom') {
            return;
        }

        router.get(
            '/history',
            { period: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const applyCustomDate = () => {
        if (!customStart || !customEnd) {
            return;
        }

        if (customEnd < customStart) {
            alert('Tanggal akhir tidak boleh lebih awal dari tanggal awal.');
            return;
        }

        router.get(
            '/history',
            {
                period: 'custom',
                start_date: customStart,
                end_date: customEnd,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilter = () => {
        setSelectedPeriod('all');
        setCustomStart('');
        setCustomEnd('');
        setSearch('');

        router.get(
            '/history',
            { period: 'all' },
            {
                preserveState: false,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (value: string) => {
        return new Date(value).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta',
        });
    };

    const filteredVisitors = visitors.filter((visitor) => {
        const keyword = search.toLowerCase();

        return (
            visitor.name.toLowerCase().includes(keyword) ||
            (visitor.company ?? '').toLowerCase().includes(keyword) ||
            visitor.address.toLowerCase().includes(keyword) ||
            visitor.purpose.toLowerCase().includes(keyword) ||
            (visitor.receptionist?.name ?? '').toLowerCase().includes(keyword)
        );
    });

    const companyTotal = visitors.filter(
        (visitor) => visitor.visitor_type === 'perusahaan',
    ).length;

    const individualTotal = visitors.filter(
        (visitor) => visitor.visitor_type === 'perorangan',
    ).length;

    const periodLabel =
        periods.find((item) => item.value === period)?.label ?? 'Semua Data';

    const exportUrl = () => {
        const params = new URLSearchParams();
        params.set('period', selectedPeriod);

        if (selectedPeriod === 'custom') {
            params.set('start_date', customStart);
            params.set('end_date', customEnd);
        }

        return `/history/pdf?${params.toString()}`;
    };

    return (
        <>
            <Head title="History Pengunjung - ITN" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays className="size-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                History Pengunjung
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Riwayat seluruh kunjungan PT Indonesia Trans Network
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/visitors"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            <Users className="size-4" />
                            Input Tamu
                        </Link>

                        <a
                            href={exportUrl()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
                        >
                            <Download className="size-4" />
                            Export PDF
                        </a>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Pengunjung
                            </p>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Users className="size-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-3xl font-bold text-foreground">
                            {totalVisitors.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Periode: {periodLabel}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Pengunjung Perusahaan
                            </p>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                <Building2 className="size-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-3xl font-bold text-foreground">
                            {companyTotal.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Kunjungan dari perusahaan
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Pengunjung Perorangan
                            </p>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <UserRound className="size-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-3xl font-bold text-foreground">
                            {individualTotal.toLocaleString('id-ID')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Kunjungan perorangan
                        </p>
                    </div>
                </div>

                {/* FILTER */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-foreground">
                                Filter Riwayat
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pilih periode data yang ingin ditampilkan.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetFilter}
                            className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        >
                            <RotateCcw className="size-4" />
                            Reset Filter
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {periods.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => applyPeriod(item.value)}
                                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                    selectedPeriod === item.value
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background text-foreground hover:bg-accent'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {selectedPeriod === 'custom' && (
                        <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Tanggal Awal
                                </label>
                                <input
                                    type="date"
                                    value={customStart}
                                    onChange={(event) =>
                                        setCustomStart(event.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Tanggal Akhir
                                </label>
                                <input
                                    type="date"
                                    value={customEnd}
                                    min={customStart || undefined}
                                    onChange={(event) =>
                                        setCustomEnd(event.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={applyCustomDate}
                                disabled={!customStart || !customEnd}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Search className="size-4" />
                                Terapkan
                            </button>
                        </div>
                    )}

                    {period === 'custom' && startDate && endDate && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            Menampilkan data dari{' '}
                            <span className="font-semibold text-foreground">
                                {formatDate(startDate)}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-foreground">
                                {formatDate(endDate)}
                            </span>
                        </p>
                    )}
                </section>

                {/* TABLE */}
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-foreground">
                                Daftar Pengunjung
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {filteredVisitors.length.toLocaleString('id-ID')} data ditampilkan
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama, perusahaan, tujuan..."
                                className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-muted/60 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-5 py-4">No.</th>
                                    <th className="px-5 py-4">Nama Pengunjung</th>
                                    <th className="px-5 py-4">Jenis</th>
                                    <th className="px-5 py-4">Perusahaan</th>
                                    <th className="px-5 py-4">Alamat</th>
                                    <th className="px-5 py-4">Tujuan</th>
                                    <th className="px-5 py-4">Waktu Kunjungan</th>
                                    <th className="px-5 py-4">Receptionist</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {filteredVisitors.map((visitor, index) => (
                                    <tr
                                        key={visitor.id}
                                        className="transition hover:bg-muted/40"
                                    >
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-foreground">
                                            {visitor.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    visitor.visitor_type === 'perusahaan'
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                }`}
                                            >
                                                {visitor.visitor_type === 'perusahaan'
                                                    ? 'Perusahaan'
                                                    : 'Perorangan'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-foreground">
                                            {visitor.company || '-'}
                                        </td>

                                        <td className="max-w-xs whitespace-normal px-5 py-4 text-muted-foreground">
                                            {visitor.address}
                                        </td>

                                        <td className="max-w-xs whitespace-normal px-5 py-4 text-muted-foreground">
                                            {visitor.purpose}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                                            {formatDateTime(visitor.visited_at)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                                                {visitor.receptionist?.name ?? '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {filteredVisitors.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                                                    <FileText className="size-7" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        Tidak ada data pengunjung
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Tidak ditemukan data yang sesuai dengan filter atau pencarian.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
                        Menampilkan {filteredVisitors.length} dari {totalVisitors} data pengunjung.
                    </div>
                </section>
            </div>
        </>
    );
}