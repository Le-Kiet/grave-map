<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LorungFinalHistoryController extends Controller
{
    protected $table = 'lorung_final_history';

    public function index()
    {
        $data = DB::table($this->table) // Use the protected property
            ->select('*') // Select all columns
            ->get();

        return response()->json($data);
    }
}