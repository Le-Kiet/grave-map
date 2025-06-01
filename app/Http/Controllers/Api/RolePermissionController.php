<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    // Lấy danh sách tất cả quyền hạn của chức vụ
    public function index()
    {
        $data = DB::table('public.role_has_permissions')->get();
        return response()->json($data);
    }

    // Thêm quyền hạn cho một chức vụ
    public function store(Request $request)
    {
        $request->validate([
            'role_id' => 'required|integer',
            'permission_id' => 'required|integer',
        ]);

        DB::table('public.role_has_permissions')->insert([
            'role_id' => $request->role_id,
            'permission_id' => $request->permission_id,
        ]);

        return response()->json(['message' => 'Permission assigned successfully'], 201);
    }

    public function update(Request $request)
{
    $request->validate([
        'role_id' => 'required|integer',
        'permission_id' => 'required|integer',
    ]);

    // Kiểm tra xem bản ghi có tồn tại không
    $exists = DB::table('public.role_has_permissions')
                ->where('role_id', $request->role_id)
                ->where('permission_id', $request->permission_id)
                ->exists();

    if ($exists) {
        // Nếu tồn tại, xóa bản ghi
        DB::table('public.role_has_permissions')
            ->where('role_id', $request->role_id)
            ->where('permission_id', $request->permission_id)
            ->delete();

        return response()->json(['message' => 'Permission deleted successfully']);
    } else {
        // Nếu không tồn tại, thêm bản ghi mới
        DB::table('public.role_has_permissions')->insert([
            'role_id' => $request->role_id,
            'permission_id' => $request->permission_id,
        ]);

        return response()->json(['message' => 'Permission added successfully']);
    }
}
    public function destroy(Request $request)
    {
        $request->validate([
            'role_id' => 'required|integer',
            'permission_id' => 'required|integer',
        ]);
    
        DB::table('public.role_has_permissions')
            ->where('role_id', $request->role_id)
            ->delete();
    
        return response()->json(['message' => 'Permission deleted successfully']);
    }
}