
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import {
    ShieldCheck,
    UserPlus,
    Search,
    Pencil,
    Power,
    Users,
    CheckCircle2,
    X,
    Building2,
    UserRound,
} from 'lucide-react';

interface Office {
    id: number;
    name: string;
    code: string;
}

interface SecurityPersonnel {
    id: number;
    name: string;
    office_id: number;
    is_active: boolean;
    visitors_count: number;
    office: Office | null;
}

interface Props {
    securityPersonnel: SecurityPersonnel[];
    offices: Office[];
    filters: {
        office_id: string | null;
        search: string | null;
    };
    summary: {
        total: number;
        active: number;
        inactive: number;
    };
    flash?: {
        success?: string;
    };
}

export default function SecurityIndex({
    securityPersonnel,
    offices,
    filters,
    summary,
    flash,
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingSecurity, setEditingSecurity] =
        useState<SecurityPersonnel | null>(null);

    const [search, setSearch] = useState(filters.search ?? '');
    const [officeFilter, setOfficeFilter] = useState(
        filters.office_id ?? '',
    );

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        office_id: '',
    });

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20';

    const applyFilters = (nextSearch: string, nextOffice: string) => {
        router.get(
            '/security',
            {
                search: nextSearch || undefined,
                office_id: nextOffice || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const openAddForm = () => {
        setEditingSecurity(null);
        reset();
        clearErrors();
        setShowForm(true);
    };

    const openEditForm = (security: SecurityPersonnel) => {
        setEditingSecurity(security);

        setData({
            name: security.name,
            office_id: String(security.office_id),
        });

        clearErrors();
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingSecurity(null);
        reset();
        clearErrors();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (editingSecurity) {
            put(`/security/${editingSecurity.id}`, {
                preserveScroll: true,
                onSuccess: () => closeForm(),
            });
        } else {
            post('/security', {
                preserveScroll: true,
                onSuccess: () => closeForm(),
            });
        }
    };

    const toggleStatus = (security: SecurityPersonnel) => {
        const action = security.is_active
            ? 'menonaktifkan'
            : 'mengaktifkan';

        if (
            !window.confirm(
                `Apakah Anda yakin ingin ${action} security ${security.name}?`,
            )
        ) {
            return;
        }

        router.patch(
            `/security/${security.id}/status`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Manajemen Security - ITN" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="size-4" />
                            Digital Guest Book ITN
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            Manajemen Security
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola data petugas security setiap kantor.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                        <UserPlus className="size-4" />
                        Tambah Security
                    </button>
                </div>

                {/* SUCCESS MESSAGE */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="size-5 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* SUMMARY */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Total Security
                            </p>
                            <Users className="size-5 text-primary" />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {summary.total}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Security Aktif
                            </p>
                            <CheckCircle2 className="size-5 text-emerald-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-emerald-600">
                            {summary.active}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Security Nonaktif
                            </p>
                            <Power className="size-5 text-red-500" />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-red-500">
                            {summary.inactive}
                        </p>
                    </div>
                </div>

                {/* FORM TAMBAH / EDIT */}
                {showForm && (
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b p-5">
                            <div>
                                <h2 className="font-semibold">
                                    {editingSecurity
                                        ? 'Edit Data Security'
                                        : 'Tambah Security Baru'}
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Lengkapi informasi petugas security.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={submit}
                            className="grid gap-5 p-5 md:grid-cols-2"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nama Security *
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    placeholder="Masukkan nama security"
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Kantor *
                                </label>

                                <select
                                    value={data.office_id}
                                    onChange={(event) =>
                                        setData('office_id', event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Pilih kantor
                                    </option>

                                    {offices.map((office) => (
                                        <option
                                            key={office.id}
                                            value={office.id}
                                        >
                                            {office.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.office_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.office_id}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row md:col-span-2 md:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : editingSecurity
                                          ? 'Simpan Perubahan'
                                          : 'Tambah Security'}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* DAFTAR SECURITY */}
                <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold">
                                Daftar Petugas Security
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {securityPersonnel.length} data security ditemukan.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        applyFilters(
                                            event.target.value,
                                            officeFilter,
                                        );
                                    }}
                                    placeholder="Cari nama security..."
                                    className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus:border-primary sm:w-56"
                                />
                            </div>

                            <select
                                value={officeFilter}
                                onChange={(event) => {
                                    setOfficeFilter(event.target.value);
                                    applyFilters(search, event.target.value);
                                }}
                                className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                            >
                                <option value="">Semua Kantor</option>

                                {offices.map((office) => (
                                    <option
                                        key={office.id}
                                        value={office.id}
                                    >
                                        {office.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4">No.</th>
                                    <th className="px-5 py-4">Nama Security</th>
                                    <th className="px-5 py-4">Kantor</th>
                                    <th className="px-5 py-4">Riwayat Tamu</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {securityPersonnel.map((security, index) => (
                                    <tr
                                        key={security.id}
                                        className="transition hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <UserRound className="size-4" />
                                                </div>

                                                <span className="font-semibold">
                                                    {security.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                <Building2 className="size-3" />
                                                {security.office?.name ?? '-'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {security.visitors_count} kunjungan
                                        </td>

                                        <td className="px-5 py-4">
                                            {security.is_active ? (
                                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(security)
                                                    }
                                                    title="Edit security"
                                                    className="rounded-lg border p-2 text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-400"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleStatus(security)
                                                    }
                                                    title={
                                                        security.is_active
                                                            ? 'Nonaktifkan'
                                                            : 'Aktifkan'
                                                    }
                                                    className={`rounded-lg border p-2 transition ${
                                                        security.is_active
                                                            ? 'text-red-500 hover:bg-red-500/10'
                                                            : 'text-emerald-600 hover:bg-emerald-500/10'
                                                    }`}
                                                >
                                                    <Power className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {securityPersonnel.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center text-muted-foreground"
                                        >
                                            Belum ada data security.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t px-5 py-4 text-xs text-muted-foreground">
                        Data security yang dinonaktifkan tetap disimpan agar
                        riwayat kunjungan sebelumnya tidak berubah.
                    </div>
                </section>
            </div>
        </>
    );
}
