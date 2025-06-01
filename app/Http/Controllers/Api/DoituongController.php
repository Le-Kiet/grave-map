<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoituongController extends Controller
{
    public function index()
    {
        $data = DB::table('lamnghiep.doituong')->get();
        return response()->json($data);
    }
}