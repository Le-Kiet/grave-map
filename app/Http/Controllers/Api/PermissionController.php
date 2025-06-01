<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = DB::table('permissions')->get();
        return response()->json($permissions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
        ]);

        $id = DB::table('permissions')->insertGetId([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'description' => $request->description,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $permission = DB::table('permissions')->find($id);
        return response()->json($permission, 201);
    }

    // Cập nhật quyền hạn
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
        ]);

        DB::table('permissions')->where('id', $id)->update([
            'name' => $request->name,
            'updated_at' => now(),
        ]);

        $permission = DB::table('permissions')->find($id);
        return response()->json($permission);
    }

    // Xóa quyền hạn
    public function destroy($id)
    {
        DB::table('permissions')->where('id', $id)->delete();
        return response()->json(['message' => 'Permission deleted successfully']);
    }
}