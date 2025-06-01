<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{

    // public function handle($request, Closure $next) {
    //       ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
    //       ->header('Access-Control-Allow-Methods', '*')
    //       ->header('Access-Control-Allow-Headers',' Origin, Content-Type, Accept, Authorization, X-Request-With')
    //       ->header('Access-Control-Allow-Credentials',' true');\
    //       return $response;
    // }
    public function handle(Request $request, Closure $next): Response
    {
        dd('CORS middleware loaded'); // Kiểm tra xem middleware có chạy không
        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return $response;
    }
}
