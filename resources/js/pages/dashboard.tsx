
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Building2,
    UserRound,
    CalendarDays,
    UserPlus,
    History,
    ArrowUpRight,
    Clock,
    ClipboardList,
} from 'lucide-react';

import { dashboard } from '@/routes';

interface Visitor {
    id: number;
    name: string;
    company?: string | null;
    visitor_type: 'perusahaan' | 'perorangan';
    purpose: string;
    visited_at: string;
    receptionist?: {
        name: string;
    } | null;
}

interface DashboardProps {
    auth: {
        user: {
            name: string;
        };
    };
    stats: {
        today: number;
        thisMonth: number;
        company: number;
        individual: number;
    };
    recentVisitors: Visitor[];
}

export default function Dashboard({
    auth,
    stats,
    recentVisitors,
}: DashboardProps) {
    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statisticCards = [
        {
            title: 'Pengunjung Hari Ini',
            value: stats.today,
            description: 'Total kunjungan hari ini',
            icon: Users,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        },
        {
            title: 'Pengunjung Bulan Ini',
            value: stats.thisMonth,
            description: 'Total kunjungan bulan berjalan',
            icon: CalendarDays,
            color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
        },
        {
            title: 'Pengunjung Perusahaan',
            value: stats.company,
            description: 'Total pengunjung perusahaan',
            icon: Building2,
            color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
        },
        {
            title: 'Pengunjung Perorangan',
            value: stats.individual,
            description: 'Total pengunjung perorangan',
            icon: UserRound,
            color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* Welcome */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            DIGITAL GUEST BOOK ITN
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight">
                            Selamat datang, {auth.user.name}!
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Kelola pencatatan dan laporan kunjungan tamu
                            PT Indonesia Trans Network.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/visitors"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            <UserPlus className="size-4" />
                            Input Buku Tamu
                        </Link>

                        <Link
                            href="/history"
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                            <History className="size-4" />
                            History
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">
                            Ringkasan Pengunjung
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Statistik kunjungan berdasarkan data buku tamu.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statisticCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="rounded-xl border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {card.title}
                                        </p>

                                        <div className={`rounded-lg p-2 ${card.color}`}>
                                            <Icon className="size-5" />
                                        </div>
                                    </div>

                                    <p className="mt-4 text-3xl font-bold tracking-tight">
                                        {card.value.toLocaleString('id-ID')}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Visitors */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold">
                                Pengunjung Terbaru
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Data kunjungan yang baru saja dicatat.
                            </p>
                        </div>

                        <Link
                            href="/history"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            Lihat semua
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </div>

                    {recentVisitors.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Pengunjung</th>
                                        <th className="px-5 py-3 font-medium">Jenis</th>
                                        <th className="px-5 py-3 font-medium">Tujuan</th>
                                        <th className="px-5 py-3 font-medium">Petugas</th>
                                        <th className="px-5 py-3 font-medium">Waktu</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {recentVisitors.map((visitor) => (
                                        <tr key={visitor.id} className="hover:bg-muted/30">
                                            <td className="px-5 py-4">
                                                <p className="font-medium">
                                                    {visitor.name}
                                                </p>
                                                {visitor.company && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {visitor.company}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    visitor.visitor_type === 'perusahaan'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                                                }`}>
                                                    {visitor.visitor_type === 'perusahaan'
                                                        ? 'Perusahaan'
                                                        : 'Perorangan'}
                                                </span>
                                            </td>

                                            <td className="max-w-xs px-5 py-4 text-muted-foreground">
                                                <span className="line-clamp-2">
                                                    {visitor.purpose}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-muted-foreground">
                                                {visitor.receptionist?.name ?? '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                                                {formatDateTime(visitor.visited_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="mb-3 rounded-full bg-muted p-4">
                                <ClipboardList className="size-7 text-muted-foreground" />
                            </div>

                            <p className="font-medium">
                                Belum ada data pengunjung
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Data pengunjung akan muncul setelah buku tamu diisi.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    Digital Guest Book ITN
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
