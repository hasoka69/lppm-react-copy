<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\Dosen;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'dosen'])->latest()->paginate(10);

        return Inertia::render('users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('users/Form', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['required', Rule::exists('roles', 'name')],
            // Conditional validation for Dosen/Kaprodi
            'nidn' => [Rule::requiredIf(fn() => array_intersect($request->roles, ['Dosen', 'Kaprodi'])), 'nullable', 'string'],
            'prodi' => [Rule::requiredIf(fn() => array_intersect($request->roles, ['Dosen', 'Kaprodi'])), 'nullable', 'string'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['roles']);

        // Create/Update Dosen Record if Role matches
        if (array_intersect($validated['roles'], ['Dosen', 'Kaprodi'])) {
            Dosen::updateOrCreate(
                ['email' => $user->email],
                [
                    'nidn' => $request->nidn,
                    'nama' => $user->name,
                    'prodi' => $request->prodi,
                    'email' => $user->email
                ]
            );
        }

        return redirect()->route('lppm.users.index')->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $user->load('dosen'); // Eager load dosen data

        return Inertia::render('users/Form', [
            'user' => $user->only(['id', 'name', 'email']),
            'roles' => $roles,
            'currentRoles' => $user->roles->pluck('name')->toArray(),
            'dosenProfile' => $user->dosen // Pass dosen profile
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['required', Rule::exists('roles', 'name')],
            // Conditional validation
            'nidn' => [Rule::requiredIf(fn() => array_intersect($request->roles, ['Dosen', 'Kaprodi'])), 'nullable', 'string'],
            'prodi' => [Rule::requiredIf(fn() => array_intersect($request->roles, ['Dosen', 'Kaprodi'])), 'nullable', 'string'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password']
                ? Hash::make($validated['password'])
                : $user->password,
        ]);

        $user->syncRoles($validated['roles']);

        // Sync Dosen Data
        if (array_intersect($validated['roles'], ['Dosen', 'Kaprodi'])) {
            Dosen::updateOrCreate(
                ['email' => $user->email], // Match by email
                [
                    'nidn' => $request->nidn,
                    'nama' => $user->name,
                    'prodi' => $request->prodi,
                    // 'email' is key, so implicitly set
                ]
            );
        }

        return redirect()->route('lppm.users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('lppm.users.index')->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(User $user)
    {
        $user->update([
            'password' => Hash::make('ResetPasswordNya'),
        ]);

        return redirect()->back()->with('success', 'Password berhasil direset ke default.');
    }
}
