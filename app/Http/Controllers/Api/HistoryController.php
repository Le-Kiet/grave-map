<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    public function history()
    {
        $history = DB::table('lamnghiep_dubaochay_history')->get();
        return response()->json($history);
    }
}