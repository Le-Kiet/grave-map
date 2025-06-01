<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class LorungHistoryController extends Controller
{
    public function history()
    {
        $history = DB::table('lamnghiep_lorung_history')->get();
        return response()->json($history);
    }
}