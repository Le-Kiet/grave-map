<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AnniversaryController extends Controller
{
    public function index()
    {
    $data = DB::table('demo.pass_away_anniversary')
        ->select(
            'id',
            'anni_date',
            'event_name',
            'location_name',
            'address',
            'note',
            DB::raw('ST_Y(location_coordinates) as latitude'),
            DB::raw('ST_X(location_coordinates) as longtitude'),
            DB::raw('ST_Y(grave_coordinates) as grave_lat'),
            DB::raw('ST_X(grave_coordinates) as grave_lng')
        )
        ->get();
    return response()->json($data);

    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:demo.pass_away_anniversary,id',
            'anni_date' => 'required|string',
            'event_name' => 'required|string',
            'location_name' => 'nullable|string',
            'address' => 'nullable|string',
            'location_coordinates' => 'nullable|array', // vẫn giữ array
            'grave_coordinates' => 'nullable|array',   // vẫn giữ array
            'note' => 'nullable|string' // ✅ dùng chuỗi
        ]);


        $loc = $request->input('location_coordinates');
        $grave = $request->input('grave_coordinates');

        $locPoint = null;
        $gravePoint = null;

        if (is_array($loc) && count($loc) === 2 && is_numeric($loc[0]) && is_numeric($loc[1])) {
            $locPoint = DB::raw("ST_SetSRID(ST_MakePoint({$loc[0]}, {$loc[1]}), 4326)");
        }

        if (is_array($grave) && count($grave) === 2 && is_numeric($grave[0]) && is_numeric($grave[1])) {
            $gravePoint = DB::raw("ST_SetSRID(ST_MakePoint({$grave[0]}, {$grave[1]}), 4326)");
        }
        DB::table('demo.pass_away_anniversary')->insert([
            'id' => $request->input('id'),
            'anni_date' => $request->input('anni_date'),
            'event_name' => $request->input('event_name'),
            'location_name' => $request->input('location_name'),
            'address' => $request->input('address'),
            'location_coordinates' => $locPoint,
            'grave_coordinates' => $gravePoint,
            'note' => $request->input('note')
        ]);


        return response()->json(['message' => 'Thêm sự kiện thành công']);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'anni_date' => 'required|string',
            'event_name' => 'required|string',
            'location_name' => 'nullable|string',
            'address' => 'nullable|string',
            'location_coordinates' => 'nullable|array',
            'grave_coordinates' => 'nullable|array',
            'note' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
     $loc = $request->input('location_coordinates');
        $grave = $request->input('grave_coordinates');

        $locPoint = null;
        $gravePoint = null;

        if (is_array($loc) && count($loc) === 2 && is_numeric($loc[0]) && is_numeric($loc[1])) {
            $locPoint = DB::raw("ST_SetSRID(ST_MakePoint({$loc[0]}, {$loc[1]}), 4326)");
        }

        if (is_array($grave) && count($grave) === 2 && is_numeric($grave[0]) && is_numeric($grave[1])) {
            $gravePoint = DB::raw("ST_SetSRID(ST_MakePoint({$grave[0]}, {$grave[1]}), 4326)");
        }

        $affected = DB::table('demo.pass_away_anniversary')
            ->where('id', $id)
            ->update([
            'anni_date' => $request->input('anni_date'),
            'event_name' => $request->input('event_name'),
            'location_name' => $request->input('location_name'),
            'address' => $request->input('address'),
            'location_coordinates' => $locPoint,
            'grave_coordinates' => $gravePoint,
            'note' => $request->input('note')
            ]);

        return response()->json([
            'message' => $affected ? 'Cập nhật thành công' : 'Không tìm thấy dữ liệu'
        ], $affected ? 200 : 404);
    }

    public function destroy($id)
    {
        $deleted = DB::table('demo.pass_away_anniversary')->where('id', $id)->delete();

        return response()->json([
            'message' => $deleted ? 'Xóa thành công' : 'Không tìm thấy dữ liệu'
        ], $deleted ? 200 : 404);
    }
}
