<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NguongocController extends Controller
{
    public function index()
    {
        $data = DB::table('nguongoc.rung')->get();
        return response()->json($data);
    }
}
