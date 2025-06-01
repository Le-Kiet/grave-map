<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $data = DB::table('public.app_user')->get();
        return response()->json($data);
    }

    public function store(Request $request)
{
    // Validate the request
    $request->validate([
        'username' => 'required|string|max:255',
        'email' => 'required|email|unique:public.app_user,email',
        'password' => 'required|string|min:6',
        'role_id' => 'required|integer', 
    ]);

    // Insert new user into the database
    try {
        $id = DB::table('app_user')->insertGetId([
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id, // Sửa từ roleDescription thành role_id
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Retrieve the newly created user
        $user = DB::table('app_user')->find($id);
        return response()->json($user, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to create user: ' . $e->getMessage()], 500);
    }
}

    public function update(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'username' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:public.app_user,email,' . $id,
            'password' => 'sometimes|required|string|min:6',
            'role_id' => 'sometimes|required|string',
        ]);

        // Update user in the database
        $user = DB::table('public.app_user')->where('id', $id)->update([
            'username' => $request->username,
            'email' => $request->email,
            'password' => isset($request->password) ? bcrypt($request->password) : DB::raw('password'),
            'role_id' => $request->roleId,
            'updated_at' => now(),
        ]);

        if ($user) {
            return response()->json(['message' => 'User updated successfully.']);
        } else {
            return response()->json(['message' => 'User not found.'], 404);
        }
    }

    public function destroy($id)
    {
        // Delete user from the database
        $user = DB::table('public.app_user')->where('id', $id)->delete();

        if ($user) {
            return response()->json(['message' => 'User deleted successfully.']);
        } else {
            return response()->json(['message' => 'User not found.'], 404);
        }
    }
}