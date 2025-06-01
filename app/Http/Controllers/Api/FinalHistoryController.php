<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FinalHistoryController extends Controller
{
    protected $table = 'lamnghiep_dubaochay_final_history';

    protected $fillable = [
        'record_id',
        'model_type',
        'action',
        'data',
        'user_id',
        'approved_by',
        'approved_at'
    ];
    public function index()
    {
        $data = DB::table('public.lamnghiep_dubaochay_final_history')
            ->selectRaw('*') // Lấy geom và centroid
            ->get();

       

        return response()->json($data);
    }
    public $timestamps = true; // Nếu bạn dùng created_at, updated_at
}
