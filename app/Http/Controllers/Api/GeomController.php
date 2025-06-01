<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GeomController extends Controller
{
    public function index()
    {
        $data = DB::table('geom.rghuyen')
            ->select('id','tenhuyen', DB::raw('ST_AsGeoJSON(geom) as geom'))
            ->get();

        // Đảo đổi kinh độ và vĩ độ
        $data = $data->map(function ($item) {
            $geom = json_decode($item->geom, true);
            if (isset($geom['coordinates'])) {
                $geom['coordinates'] = $this->swapCoordinates($geom['coordinates']);
            }
            $item->geom = json_encode($geom);
            return $item;
        });

        return response()->json($data);
    }

    private function swapCoordinates($coordinates)
    {
        // Đảo đổi kinh độ và vĩ độ cho MultiPolygon
        return array_map(function ($polygon) {
            return array_map(function ($ring) {
                return array_map(function ($point) {
                    return [$point[1], $point[0]]; // Đảo đổi [vĩ độ, kinh độ]
                }, $ring);
            }, $polygon);
        }, $coordinates);
    }
}