<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class LamnghiepController extends Controller
{
    protected function mapData(array $data){
        return[
            'geom' => $data['geom'],
            'tentinh' => $data['tentinh'],
            'tenhuyen' => $data['tenhuyen'],
            'nhietdo' => $data['nhietdo'],
            'doam' => $data['doam'],
            'luongmua' => $data['luongmua'],
            'capdubao' => $data['capdubao'],
        ];
    }
    public function index()
    {
        $data = DB::table('lamnghiep.dubaochay')
            ->select('id', 'tentinh', 'tenhuyen', 'nhietdo', 'doam', 'luongmua', 'capdubao', 'ngay')
            ->whereIn('id', function($query) {
                $query->select(DB::raw('max(id)'))
                      ->from('lamnghiep.dubaochay')
                      ->groupBy('tentinh', 'tenhuyen');
            })
            ->get();

        return response()->json($data);
    }

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'geom' => 'required|json',
        'tentinh' => 'required|string',
        'tenhuyen' => 'required|string',
        'nhietdo' => 'required|numeric',
        'doam' => 'required|numeric',
        'luongmua' => 'required|numeric',
        'capdubao' => 'required|string',
        // 'ngay' => 'required|date_format:Y-m-d H:i:s',
    ]);
    $geom = $request->input('geom');
if (empty($geom)) {
    return response()->json(['error' => 'Thiếu geom'], 422);
}
    Log::info('Dữ liệu nhận được:', $request->all());

    if ($validator->fails()) {
        Log::warning('Dữ liệu không hợp lệ:', $validator->errors()->toArray());
        return response()->json($validator->errors(), 422);
    }

    $data = $request->only([
        'geom','tentinh', 'tenhuyen', 'nhietdo', 'doam', 'luongmua', 'capdubao'
    ]);
    // $mappedData = $this->mapData($data);
    DB::table('lamnghiep_dubaochay_history')->insert([
        'action' => 'create',
        'data' => json_encode($data),
        'user_id' => auth()->id(),
        'status' => 'pending'
    ]);

    // Kiểm tra dữ liệu đã ghi vào lịch sử
    $insertedData = DB::table('lamnghiep_dubaochay_history')->latest()->first();
    Log::info('Dữ liệu đã được ghi vào lịch sử:', (array)$insertedData);

    return response()->json(['message' => 'Yêu cầu tạo mới đã được ghi nhận và chờ phê duyệt'], 202);
}
public function update(Request $request, $id)
{
    // ... validate như cũ
    $existing = DB::table('lamnghiep.dubaochay')->where('id', $id)->first();
    if (!$existing) {
        return response()->json(['message' => 'Không tìm thấy bản ghi'], 404);
    }
    $data = $request->only([
        'tentinh', 'tenhuyen', 'nhietdo', 'doam', 'luongmua', 'capdubao'
    ]);
    // $mappedData = $this->mapData($data);
    DB::table('lamnghiep_dubaochay_history')->insert([
        'action' => 'update',
        'record_id' => $id,
        'data' => json_encode($data),
        'user_id' => auth()->id(),
        'status' => 'pending'
    ]);
    Log::info('Dữ liệu nhận được:', $request->all());
    return response()->json(['message' => 'Yêu cầu cập nhật đã được ghi nhận và chờ phê duyệt'], 202);
}
public function destroy(Request $request, $id)
{
    $existing = DB::table('lamnghiep.dubaochay')->where('id', $id)->first();
    $data = $request->all();

    if (!$existing) {
        return response()->json(['message' => 'Không tìm thấy bản ghi'], 404);
    }
    // $mappedData = $this->mapData($existing);
    // $mappedData = $this->mapData($data);

    DB::table('lamnghiep_dubaochay_history')->insert([
        'action' => 'delete',
        'record_id' => $id,
        'data' => json_encode($existing),
        'user_id' => auth()->id(),
        'status' => 'pending'
    ]);

    return response()->json(['message' => 'Yêu cầu xóa đã được ghi nhận và chờ phê duyệt'], 202);
}

}