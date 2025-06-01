<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class DemoController extends Controller
{
    public function index()
{
    $data = DB::table('demo.thongtinchitiet')
        ->select('id', 'hoten', 'sodt', 'diachi', 'cccd', 'gioitinh', 'longtitude', 'latitude', 'img')
        ->from('demo.thongtinchitiet')
        ->get();

    return response()->json($data);
}
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'hoten' => 'required|string',
        'sodt' => 'required|string',
        'diachi' => 'required|string',
        'cccd' => 'required|string',
        'longtitude' => 'required|numeric',
        'latitude' => 'required|numeric',
        'img' => 'nullable|array', // Thêm validation cho trường img, cho phép null hoặc là một array
    ]);

    Log::info('Dữ liệu nhận được:', $request->all());

    if ($validator->fails()) {
        Log::warning('Dữ liệu không hợp lệ:', $validator->errors()->toArray());
        return response()->json($validator->errors(), 422);
    }

    $data = $request->only([
        'hoten', 'sodt', 'diachi', 'cccd', 'gioitinh','longtitude', 'latitude', 'img'
    ]);
    
    //
    if (is_array($data['img'])) {
        $data['img'] = json_encode($data['img']); 
    }
    DB::table('demo.thongtinchitiet')->insert($data);

    return response()->json(['message' => 'Đã phê duyệt thành công']);

}
public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'hoten' => 'required|string',
        'sodt' => 'required|string',
        'diachi' => 'required|string',
        'cccd' => 'required|string',
        'longtitude' => 'required|numeric',
        'latitude' => 'required|numeric',
        'img' => 'nullable|array', // Thêm validation cho trường img, cho phép null hoặc là một array
    ]);

    Log::info('Dữ liệu cập nhật:', $request->all());

    if ($validator->fails()) {
        Log::warning('Dữ liệu không hợp lệ:', $validator->errors()->toArray());
        return response()->json($validator->errors(), 422);
    }

    $data = $request->only([
        'hoten', 'sodt', 'diachi', 'cccd', 'gioitinh', 'longtitude', 'latitude', 'img'
    ]);

    $affected = DB::table('demo.thongtinchitiet')
        ->where('id', $id)
        ->update($data);

    if ($affected) {
        Log::info("Dữ liệu với ID {$id} đã được cập nhật.");
        return response()->json(['message' => 'Đã cập nhật thành công']);
    } else {
        Log::warning("Không tìm thấy dữ liệu với ID {$id}.");
        return response()->json(['message' => 'Không tìm thấy dữ liệu'], 404);
    }
}

public function destroy($id)
{
    Log::info("Yêu cầu xóa dữ liệu với ID: {$id}");

    $deleted = DB::table('demo.thongtinchitiet')->where('id', $id)->delete();

    if ($deleted) {
        Log::info("Dữ liệu với ID {$id} đã bị xóa.");
        return response()->json(['message' => 'Đã xóa thành công']);
    } else {
        Log::warning("Không tìm thấy dữ liệu với ID {$id}.");
        return response()->json(['message' => 'Không tìm thấy dữ liệu'], 404);
    }
}


}