<?php

namespace App\Http\Controllers;

use App\Models\Office;
use App\Models\SecurityPersonnel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SecurityPersonnelController extends Controller
{
    /**
     * Menampilkan daftar security.
     */
    public function index(Request $request)
    {
        $query = SecurityPersonnel::with('office')
            ->withCount('visitors')
            ->orderBy('name');

        if ($request->filled('office_id')) {
            $query->where('office_id', $request->office_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%");
        }

        $securityPersonnel = $query->get();

        $offices = Office::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('security/index', [
            'securityPersonnel' => $securityPersonnel,
            'offices' => $offices,
            'filters' => [
                'office_id' => $request->office_id,
                'search' => $request->search,
            ],
            'summary' => [
                'total' => SecurityPersonnel::count(),
                'active' => SecurityPersonnel::where('is_active', true)->count(),
                'inactive' => SecurityPersonnel::where('is_active', false)->count(),
            ],
        ]);
    }

    /**
     * Menyimpan security baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'office_id' => [
                'required',
                'integer',
                Rule::exists('offices', 'id')->where('is_active', true),
            ],
        ], [
            'name.required' => 'Nama security wajib diisi.',
            'office_id.required' => 'Kantor wajib dipilih.',
            'office_id.exists' => 'Kantor tidak ditemukan atau tidak aktif.',
        ]);

        SecurityPersonnel::create([
            'name' => trim($validated['name']),
            'office_id' => $validated['office_id'],
            'is_active' => true,
        ]);

        return redirect()
            ->route('security.index')
            ->with('success', 'Security berhasil ditambahkan.');
    }

    /**
     * Memperbarui data security.
     */
    public function update(Request $request, SecurityPersonnel $securityPersonnel)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'office_id' => [
                'required',
                'integer',
                Rule::exists('offices', 'id')->where('is_active', true),
            ],
        ], [
            'name.required' => 'Nama security wajib diisi.',
            'office_id.required' => 'Kantor wajib dipilih.',
            'office_id.exists' => 'Kantor tidak ditemukan atau tidak aktif.',
        ]);

        $securityPersonnel->update([
            'name' => trim($validated['name']),
            'office_id' => $validated['office_id'],
        ]);

        return redirect()
            ->route('security.index')
            ->with('success', 'Data security berhasil diperbarui.');
    }

    /**
     * Mengaktifkan atau menonaktifkan security.
     */
    public function toggleStatus(SecurityPersonnel $securityPersonnel)
    {
        $securityPersonnel->update([
            'is_active' => !$securityPersonnel->is_active,
        ]);

        $message = $securityPersonnel->is_active
            ? 'Security berhasil diaktifkan.'
            : 'Security berhasil dinonaktifkan.';

        return redirect()
            ->route('security.index')
            ->with('success', $message);
    }
}
