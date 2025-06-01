<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class GraveController extends Controller
{
public function index()
{
    $data = DB::table('demo.category_graves')
        ->select(
            'id',
            'grave',
            'generation',
            'location',
            'note',
            DB::raw('ST_Y(geom) as latitude'),
            DB::raw('ST_X(geom) as longtitude')
        )
        ->get();

    return response()->json($data);
}


public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'grave' => 'required',
        'generation' => 'nullable|integer',
        'location' => 'required',
        'geom' => 'required|array', // Yêu cầu là array [lng, lat]
        'note' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $coords = $request->input('geom');
    $geom = $request->input('geom');

    if (!isset($geom['type']) || $geom['type'] !== 'Point') {
        return response()->json(['geom' => ['Loại hình địa lý không hợp lệ']], 422);
    }

    $coords = $geom['coordinates'] ?? [];

    if (!is_array($coords) || count($coords) !== 2 || 
        !is_numeric($coords[0]) || !is_numeric($coords[1])) {
        return response()->json(['geom' => ['Toạ độ không hợp lệ']], 422);
    }

    // if (!is_array($coords) || count($coords) < 2) {
    //     return response()->json(['geom' => ['Toạ độ không hợp lệ']], 422);
    // }

    DB::table('demo.category_graves')->insert([
        'grave' => $request->input('grave'),
        'generation' => $request->input('generation'),
        'location' => $request->input('location'),
        'geom' => DB::raw("ST_SetSRID(ST_MakePoint({$coords[0]}, {$coords[1]}), 4326)"),
        'note' => $request->input('note')
    ]);

    return response()->json(['message' => 'Thêm thành công']);
}




    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'grave' => 'required',
            'generation' => 'nullable|integer',
            'location' => 'nullable',
            'geom' => 'required|array', // [lng, lat]
            'note' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }


    $coords = $request->input('geom');
    $geom = $request->input('geom');

    if (!isset($geom['type']) || $geom['type'] !== 'Point') {
        return response()->json(['geom' => ['Loại hình địa lý không hợp lệ']], 422);
    }

    $coords = $geom['coordinates'] ?? [];

        $affected = DB::table('demo.category_graves')
            ->where('id', $id)
            ->update([
                'grave' => $request->input('grave'),
                'generation' => $request->input('generation'),
                'location' => $request->input('location'),
                'geom' => DB::raw("ST_SetSRID(ST_MakePoint({$coords[0]}, {$coords[1]}), 4326)"),
                'note' => $request->input('note')
            ]);

        return response()->json([
            'message' => $affected ? 'Cập nhật thành công' : 'Không tìm thấy dữ liệu'
        ], $affected ? 200 : 404);
    }

    public function destroy($id)
    {
        $deleted = DB::table('demo.category_graves')->where('id', $id)->delete();

        return response()->json([
            'message' => $deleted ? 'Đã xóa thành công' : 'Không tìm thấy dữ liệu'
        ], $deleted ? 200 : 404);
    }
}
