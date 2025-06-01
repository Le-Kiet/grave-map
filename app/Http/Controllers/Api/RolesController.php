<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolesController extends Controller
{
    // Lấy danh sách tất cả các vai trò
    public function index()
    {
        $data = DB::table('public.roles')->get();
        return response()->json($data);
    }

    // Thêm vai trò mới
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'guard_name' => 'required|string|max:500', // Thêm validate cho description
    ]);

    $id = DB::table('public.roles')->insertGetId([
        'name' => $request->name,
        'guard_name' => $request->guard_name, // Thêm description vào bảng
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $role = DB::table('public.roles')->find($id);
    return response()->json($role, 201);
}
    // Cập nhật vai trò
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // Thêm các điều kiện validate khác nếu cần
        ]);

        DB::table('public.roles')->where('id', $id)->update([
            'name' => $request->name,
            'updated_at' => now(),
        ]);

        $role = DB::table('public.roles')->find($id);
        return response()->json($role);
    }

    // Xóa vai trò
    public function destroy($id)
    {
        DB::table('public.roles')->where('id', $id)->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}