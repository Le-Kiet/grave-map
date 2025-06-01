<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class LorungController extends Controller
{
    public function index()
    {
        $data = DB::table('lamnghiep.lorung')
            ->selectRaw('*, ST_AsGeoJSON(geom) as geom, ST_AsText(ST_Centroid(geom)) as centroid') // Lấy geom và centroid
            ->get();

        $data = $data->map(function ($item) {
            $geom = json_decode($item->geom, true);
            if (isset($geom['coordinates'])) {
                $geom['coordinates'] = $this->swapCoordinates($geom['coordinates']);
            }
            $item->geom = json_encode($geom);

            $item->centroid = $this->formatCentroid($item->centroid);

            return $item;
        });

        return response()->json($data);
    }
    public function index_paginate(Request $request)
    {
        // Lấy tham số page và rows từ request, mặc định là 1 và 10 nếu không có
        $currentPage = $request->input('page', 1);
        $rowsPerPage = $request->input('rows', 10);
    
        // Tính toán chỉ số bắt đầu
        $offset = ($currentPage - 1) * $rowsPerPage;
    
        // Lấy dữ liệu từ database với phân trang
        $data = DB::table('lamnghiep.lorung')
            // ->selectRaw('*, ST_AsGeoJSON(geom) as geom, ST_AsText(ST_Centroid(geom)) as centroid')
            ->offset($offset) // Bỏ qua số bản ghi trước đó
            ->limit($rowsPerPage) // Giới hạn số bản ghi trả về
            ->get();
        $data = DB::table('lamnghiep.lorung')
            ->select([
                'maddlo', 
                'matinh', 'mahuyen', 'maxa', 'tenxa', 'matieukhu', 'makhoanh', 'malo',
                'soto', 'sothua', 'diadanh', 'dientich', 'mangr', 'ldlr', 'maldlr', 'loaicay',
                'namtrong', 'captuoi', 'nkheptan', 'mangrt', 'mathanhrung', 'mgo', 'mtn', 'mgolo',
                'mtnlo', 'malapdia', 'malr3', 'quyuocmdsd', 'mamdsd', 'madoituong', 'churung',
                'machurung', 'matranhchap', 'mattqsdd', 'thoihansd', 'makhoan', 'mattqh',
                'nguoiky', 'nguoichiutn', 'manguoiky', 'manguoichiutn', 'mangsinh',
                'kinhdo', 'vido', 'capkinhdo', 'capvido', 'malocu', 'mathuadat',
                'tentinh', 'tenhuyen'
            ])
            ->offset($offset)
            ->limit($rowsPerPage)
            ->get();
        // Đếm tổng số bản ghi để biết tổng trong database
        // $totalRecords = Cache::remember('lorung_total_count', 300, function () {
        //     return DB::table('lamnghiep.lorung')->count();
        // });
    
        return response()->json([
            // 'total' => $totalRecords,
            'data' => $data,
        ]);
        // $totalRecords = DB::table('lamnghiep.lorung')->count();
    
        // Xử lý dữ liệu
        // $data = $data->map(function ($item) {
        //     $geom = json_decode($item->geom, true);
        //     if (isset($geom['coordinates'])) {
        //         $geom['coordinates'] = $this->swapCoordinates($geom['coordinates']);
        //     }
        //     $item->geom = json_encode($geom);
    
        //     $item->centroid = $this->formatCentroid($item->centroid);
    
        //     return $item;
        // });
    
        // Trả về dữ liệu và tổng số bản ghi
        return response()->json([
            'total' => $totalRecords,
            'data' => $data,
        ]);
    }
    // public function index(Request $request)
    // {
    //     // Lấy tham số page và rows từ request, mặc định là 1 và 10 nếu không có
    //     $currentPage = $request->input('page', 1);
    //     $rowsPerPage = $request->input('rows', 10);
    
    //     // Tính toán chỉ số bắt đầu
    //     $offset = ($currentPage - 1) * $rowsPerPage;
    
    //     // Lấy dữ liệu từ database với phân trang
    //     $data = DB::table('lamnghiep.lorung')
    //         ->selectRaw('*, ST_AsGeoJSON(geom) as geom, ST_AsText(ST_Centroid(geom)) as centroid')
    //         ->offset($offset) // Bỏ qua số bản ghi trước đó
    //         ->limit($rowsPerPage) // Giới hạn số bản ghi trả về
    //         ->get();
    
    //     // Đếm tổng số bản ghi để biết tổng trong database
    //     $totalRecords = DB::table('lamnghiep.lorung')->count();
    
    //     // Xử lý dữ liệu
    //     $data = $data->map(function ($item) {
    //         $geom = json_decode($item->geom, true);
    //         if (isset($geom['coordinates'])) {
    //             $geom['coordinates'] = $this->swapCoordinates($geom['coordinates']);
    //         }
    //         $item->geom = json_encode($geom);
    
    //         $item->centroid = $this->formatCentroid($item->centroid);
    
    //         return $item;
    //     });
    
    //     // Trả về dữ liệu và tổng số bản ghi
    //     return response()->json([
    //         'total' => $totalRecords,
    //         'data' => $data,
    //     ]);
    // }
    // Thêm mới dữ liệu
    public function store(Request $request)
{
    $fields = [
        'geom',
        'maddlo', 'matinh', 'mahuyen', 'maxa', 'tenxa', 'matieukhu', 'makhoanh', 'malo',
        'soto', 'sothua', 'diadanh', 'dientich', 'mangr', 'ldlr', 'maldlr', 'loaicay',
        'namtrong', 'captuoi', 'nkheptan', 'mangrt', 'mathanhrung', 'mgo', 'mtn', 'mgolo',
        'mtnlo', 'malapdia', 'malr3', 'quyuocmdsd', 'mamdsd', 'madoituong', 'churung',
        'machurung', 'matranhchap', 'mattqsdd', 'thoihansd', 'makhoan', 'mattqh',
        'nguoiky', 'nguoichiutn', 'manguoiky', 'manguoichiutn', 'mangsinh',
        'kinhdo', 'vido', 'capkinhdo', 'capvido', 'malocu', 'mathuadat',
        'tentinh', 'tenhuyen'
    ];

    $data = $request->only($fields);

    foreach ($data as $key => $value) {
        if ($key === 'geom') {
            continue;
        }

        if (is_string($value) && preg_match('/[.,\/\?\!@#\$%\^&\*\(\)=\+\[\]\{\};:"<>\\\|~`]/', $value)) {
            return response()->json([
                'error' => "Trường [$key] chứa ký tự không hợp lệ. Vui lòng kiểm tra lại."
            ], 422);
        }
    }

    if (!isset($data['kinhdo']) || !isset($data['vido'])) {
        return response()->json(['error' => 'Thiếu kinh độ hoặc vĩ độ'], 422);
    }

    try {
        // Kiểm tra geom, nếu là JSON string thì decode
        if (empty($data['geom'])) {
            return response()->json(['error' => 'Thiếu dữ liệu geom'], 422);
        }

        if (is_string($data['geom'])) {
            $data['geom'] = json_decode($data['geom'], true);
        }

        if (!is_array($data['geom']) || !isset($data['geom']['type']) || !isset($data['geom']['coordinates'])) {
            return response()->json(['error' => 'Dữ liệu geom không hợp lệ'], 422);
        }

        // Kiểm tra coordinates thực sự là array
        if (!is_array($data['geom']['coordinates'])) {
            return response()->json(['error' => 'Coordinates trong geom phải là mảng'], 422);
        }

        $data['created_at'] = now();
        $data['updated_at'] = now();

        // 🔥 Lưu thẳng dữ liệu chuẩn hóa vào history
        DB::table('lamnghiep_lorung_history')->insert([
            'action' => 'create',
            'data' => json_encode($data), // lúc này data đã chuẩn hóa rồi
            'user_id' => auth()->id() ?? null,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Yêu cầu tạo mới đã được ghi nhận và chờ phê duyệt'], 202);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Lỗi khi lưu dữ liệu: ' . $e->getMessage()], 500);
    }
}
    // Cập nhật dữ liệu    
public function update(Request $request, $id)
{
    $fields = [
        'geom','maddlo', 'matinh', 'mahuyen', 'maxa', 'tenxa', 'matieukhu', 'makhoanh', 'malo',
        'soto', 'sothua', 'diadanh', 'dientich', 'mangr', 'ldlr', 'maldlr', 'loaicay',
        'namtrong', 'captuoi', 'nkheptan', 'mangrt', 'mathanhrung', 'mgo', 'mtn', 'mgolo',
        'mtnlo', 'malapdia', 'malr3', 'quyuocmdsd', 'mamdsd', 'madoituong', 'churung',
        'machurung', 'matranhchap', 'mattqsdd', 'thoihansd', 'makhoan', 'mattqh', 'nguoiky',
        'nguoichiutn', 'manguoiky', 'manguoichiutn', 'mangsinh', 'kinhdo', 'vido',
        'capkinhdo', 'capvido', 'malocu', 'mathuadat', 'tentinh', 'tenhuyen'
    ];

    $data = $request->only($fields);
    Log::info('Dữ liệu nhận được:', $data);
    // DB::table('lamnghiep.lorung')->where('id', $id)->update($data);
    // foreach ($data as $key => $value) {
    //     if (is_string($value) && preg_match('/[.,\/\?\!@#\$%\^&\*\(\)=\+\[\]\{\};:"<>\\\|~`]/', $value)) {
    //         return response()->json([
    //             'error' => "Trường [$key] chứa ký tự không hợp lệ. Vui lòng kiểm tra lại."
    //         ], 422);
    //     }
    // }
    DB::table('lamnghiep_lorung_history')->insert([
        'action' => 'update',
        'record_id' => $id, // <-- dòng này rất quan trọng
        'data' => json_encode(array_merge($data, ['id' => $id])),
        'user_id' => auth()->id(),
        'status' => 'pending'
    ]);

    return response()->json(['message' => 'Cập nhật thành công']);
}
public function destroy($id)
{
    $record = DB::table('lamnghiep.lorung')->where('id', $id)->first();

    if (!$record) {
        return response()->json(['message' => 'Không tìm thấy bản ghi trong bảng chính (lorung)'], 404);
    }

    DB::table('lamnghiep_lorung_history')->insert([
        'action' => 'delete',
        'record_id' => $id,
        'data' => json_encode($record),
        'user_id' => auth()->id(),
        'status' => 'pending'
    ]);

    return response()->json(['message' => 'Yêu cầu xoá đã được ghi nhận và chờ phê duyệt']);
}

    private function swapCoordinates($coordinates)
    {
        return array_map(function ($polygon) {
            return array_map(function ($ring) {
                return array_map(function ($point) {
                    return [$point[1], $point[0]]; 
                }, $ring);
            }, $polygon);
        }, $coordinates);
    }

    private function formatCentroid($centroid)
    {
        preg_match('/POINT\(([^ ]+) ([^ ]+)\)/', $centroid, $matches);

        if (count($matches) === 3) {
            $longitude = $matches[1];
            $latitude = $matches[2];
            return "[$latitude $longitude]";
        }
        
        return null; 
    }
}