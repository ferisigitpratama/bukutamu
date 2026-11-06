
import { Head, useForm, Link } from '@inertiajs/react';
import { type FormEvent } from 'react';
import {
    UserPlus,
    Users,
    Building2,
    UserRound,
    ClipboardList,
    CheckCircle2,
    CalendarDays,
} from 'lucide-react';

interface Visitor {
    id: number;
    name: string;
    address: string;
    visitor_type: string;
    company: string | null;
    purpose: string;
    visited_at: string;
    receptionist: {
        name: string;
    } | null;
}

interface Props {
    visitors: {
        data: Visitor[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    flash?: {
        success?: string;
    };
}

export default function VisitorIndex({ visitors, flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        visitor_type: 'perorangan',
        company: '',
        purpose: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post('/visitors', {
            onSuccess: () => reset(),
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Input Buku Tamu" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                {/* PAGE HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <UserPlus className="size-4" />
                            Digital Guest Book ITN
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            Input Buku Tamu
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Catat informasi pengunjung yang datang ke PT Indonesia Trans Network.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                </div>

                {/* SUCCESS MESSAGE */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="size-5 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* FORM */}
                <section className="rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center gap-3 border-b px-5 py-5 md:px-6">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserPlus className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Tambah Data Pengunjung
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Lengkapi informasi pengunjung pada formulir berikut.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6 p-5 md:p-6">

                        {/* NAMA DAN ALAMAT */}
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama pengunjung"
                                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />

                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Alamat <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Masukkan alamat pengunjung"
                                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />

                                {errors.address && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* JENIS PENGUNJUNG */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Jenis Pengunjung <span className="text-red-500">*</span>
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('visitor_type', 'perorangan');
                                        setData('company', '');
                                    }}
                                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                                        data.visitor_type === 'perorangan'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-input hover:bg-muted/50'
                                    }`}
                                >
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                        <UserRound className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Perorangan
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Pengunjung individu
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('visitor_type', 'perusahaan')}
                                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                                        data.visitor_type === 'perusahaan'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-input hover:bg-muted/50'
                                    }`}
                                >
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Building2 className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Perusahaan
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Perwakilan perusahaan
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {errors.visitor_type && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.visitor_type}
                                </p>
                            )}
                        </div>

                        {/* NAMA PERUSAHAAN */}
                        {data.visitor_type === 'perusahaan' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nama Perusahaan <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="Masukkan nama perusahaan"
                                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />

                                {errors.company && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.company}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* TUJUAN KUNJUNGAN */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Tujuan Kunjungan <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                value={data.purpose}
                                onChange={(e) => setData('purpose', e.target.value)}
                                placeholder="Tuliskan tujuan kunjungan"
                                rows={4}
                                className="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            {errors.purpose && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.purpose}
                                </p>
                            )}
                        </div>

                        {/* FORM FOOTER */}
                        <div className="flex flex-col-reverse justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
                            <p className="text-xs text-muted-foreground">
                                * Waktu kunjungan dan nama petugas tercatat otomatis.
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <UserPlus className="size-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Data Tamu'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* VISITOR HISTORY */}
                <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center md:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <ClipboardList className="size-5" />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Riwayat Pengunjung
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Daftar kunjungan terbaru yang tercatat.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                                {visitors.data.length} data di halaman ini
                            </span>

                            <Link
                                href="/history"
                                className="rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                            >
                                Lihat semua
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4 font-medium">No.</th>
                                    <th className="px-5 py-4 font-medium">Nama Pengunjung</th>
                                    <th className="px-5 py-4 font-medium">Jenis</th>
                                    <th className="px-5 py-4 font-medium">Perusahaan</th>
                                    <th className="px-5 py-4 font-medium">Tujuan</th>
                                    <th className="px-5 py-4 font-medium">Waktu</th>
                                    <th className="px-5 py-4 font-medium">Petugas</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {visitors.data.map((visitor, index) => (
                                    <tr
                                        key={visitor.id}
                                        className="transition hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {(visitors.current_page - 1) * 10 + index + 1}
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {visitor.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {visitor.address}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                visitor.visitor_type === 'perusahaan'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                            }`}>
                                                {visitor.visitor_type === 'perusahaan'
                                                    ? 'Perusahaan'
                                                    : 'Perorangan'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {visitor.company || '-'}
                                        </td>

                                        <td className="max-w-xs whitespace-normal px-5 py-4 text-muted-foreground">
                                            {visitor.purpose}
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatDate(visitor.visited_at)}
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {visitor.receptionist?.name || '-'}
                                        </td>
                                    </tr>
                                ))}

                                {visitors.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <Users className="size-7" />
                                                </div>

                                                <p className="font-semibold">
                                                    Belum ada data pengunjung
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Data tamu yang dimasukkan akan muncul di sini.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
                        <p className="text-xs text-muted-foreground">
                            Halaman {visitors.current_page} dari {visitors.last_page}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {visitors.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-input bg-background hover:bg-muted'
                                    } ${
                                        !link.url
                                            ? 'pointer-events-none opacity-40'
                                            : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-2 text-center text-xs text-muted-foreground">
                    Digital Guest Book ITN © {new Date().getFullYear()}
                </footer>
            </div>
        </>
    );
}
