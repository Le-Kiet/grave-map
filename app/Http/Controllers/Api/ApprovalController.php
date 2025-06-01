<?php

namespace App\Http\Controllers\Api;
// use App\Http\Controllers\Api\Arr;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    // Lấy danh sách bản ghi đang chờ duyệt
    public function pending()
    {
        $pending = DB::table('lamnghiep_dubaochay_history')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pending);
    }
    public function pending_lorung()
    {
        $pending = DB::table('lamnghiep_lorung_history')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pending);
    }

    // Phê duyệt bản ghi
    private function closePolygonIfNeeded(array $coordinates)
{
    // Nếu đã có điểm đầu == điểm cuối thì thôi
    $first = $coordinates[0];
    $last = end($coordinates);

    if ($first !== $last) {
        $coordinates[] = $first;
    }

    return $coordinates;
}
    public function approve($id)
{
    $history = DB::table('lamnghiep_dubaochay_history')->where('id', $id)->first();

    if (!$history) {
        return response()->json(['message' => 'Lịch sử không tồn tại'], 404);
    }

    $data = json_decode($history->data, true);

    // Tách geom riêng ra
    $geom = $data['geom'] ?? null;
    $datawithgeom = $data; // Sao chép mảng gốc
unset($data['geom']); // Xóa cột geom khỏi bản sao
    // unset($data['geom']); // Bỏ geom ra khỏi $data để insert/update vào dubaochay
    if ($history->action === 'create') {
        DB::table('lamnghiep.dubaochay')->insert($data);
    } elseif ($history->action === 'update') {
        DB::table('lamnghiep.dubaochay')
            ->where('id', $history->record_id)
            ->update($data);
    } elseif ($history->action === 'delete') {
        DB::table('lamnghiep.dubaochay')
            ->where('id', $history->record_id)
            ->delete();
    }

    // Sau khi insert/update dubaochay xong, xử lý geom cho rghuyen nếu cần
    if (!empty($datawithgeom['geom'])) {
        $geom = $datawithgeom['geom']; // lấy geom từ data
    
        $existingHuyen = DB::table('geom.rghuyen')
            ->where('tenhuyen', $datawithgeom['tenhuyen'])
            ->first();
    
        if (!$existingHuyen) {
            // Nếu chưa có, insert mới
            DB::table('geom.rghuyen')->insert([
                'tenhuyen' => $datawithgeom['tenhuyen'],
                'geom' => DB::raw("ST_GeomFromGeoJSON('".(is_array($geom) ? json_encode($geom) : $geom)."')")
            ]);
        } 
        // Nếu bạn muốn: có rồi nhưng cập nhật lại geom nếu cần
        // else {
        //     DB::table('geom.rghuyen')
        //         ->where('id', $existingHuyen->id)
        //         ->update([
        //             'geom' => DB::raw("ST_GeomFromGeoJSON('".(is_array($geom) ? json_encode($geom) : $geom)."')")
        //         ]);
        // }
    }
    

    // Cập nhật trạng thái approved
    DB::table('lamnghiep_dubaochay_history')
        ->where('id', $id)
        ->update(['status' => 'approved']);

    // Lưu lịch sử final
    DB::table('lamnghiep_dubaochay_final_history')->insert([
        'record_id' => $history->record_id,
        'data' => json_encode($data),
        'approved_at' => now(),
        'action' => $history->action 
    ]);

    return response()->json(['message' => 'Đã phê duyệt thành công']);
}
public function approve_lorung($id)
{
    $history = DB::table('lamnghiep_lorung_history')->where('id', $id)->first();

if (!$history) {
    return response()->json(['message' => 'Lịch sử không tồn tại'], 404);
}

$data = json_decode($history->data, true);

$geom = $data['geom'] ?? null;
$dataWithoutGeom = $data;
unset($dataWithoutGeom['geom']);

if ($history->action === 'create') {
    $insertData = [
        ...$dataWithoutGeom,
        'geom' => DB::raw("ST_GeomFromGeoJSON('".(is_array($geom) ? json_encode($geom) : $geom)."')")
    ];
    DB::table('lamnghiep.lorung')->insert($insertData);
} elseif ($history->action === 'update') {
    $updateData = [
        ...$dataWithoutGeom,
        'geom' => DB::raw("ST_GeomFromGeoJSON('".(is_array($geom) ? json_encode($geom) : $geom)."')")
    ];
    DB::table('lamnghiep.lorung')
        ->where('id', $history->record_id)
        ->update($updateData);
} elseif ($history->action === 'delete') {
    DB::table('lamnghiep.lorung')
        ->where('id', $history->record_id)
        ->delete();
}

DB::table('lamnghiep_lorung_history')
    ->where('id', $id)
    ->update(['status' => 'approved']);
    DB::table('lorung_final_history')->insert([
        'record_id' => $history->record_id,
        'data' => json_encode($data),
        'approved_at' => now(),
        'action' => $history->action 
    ]);
return response()->json(['message' => 'Đã phê duyệt thành công']);
}

    // Từ chối bản ghi
    public function reject($id)
    {
        $history = DB::table('lamnghiep_dubaochay_history')->where('id', $id)->first();

        if (!$history) {
            return response()->json(['message' => 'Lịch sử không tồn tại'], 404);
        }

        DB::table('lamnghiep_dubaochay_history')
            ->where('id', $id)
            ->update(['status' => 'rejected']);

        return response()->json(['message' => 'Đã từ chối thành công']);
    }
    public function reject_lorung($id)
    {
        $history = DB::table('lamnghiep_lorung_history')->where('id', $id)->first();

        if (!$history) {
            return response()->json(['message' => 'Lịch sử không tồn tại'], 404);
        }

        DB::table('lamnghiep_lorung_history')
            ->where('id', $id)
            ->update(['status' => 'rejected']);

        return response()->json(['message' => 'Đã từ chối thành công']);
    }
}
