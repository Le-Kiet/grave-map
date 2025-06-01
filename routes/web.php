<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoituongController;
use App\Http\Controllers\Api\LorungController;
use App\Http\Controllers\Api\NguongocController;
use App\Http\Controllers\Api\GeomController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
// routes/web.php
// Route::get('/{any}', function () {
//     return file_get_contents(public_path('react/index.html'));
// })->where('any', '.*');
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/doituong', [DoituongController::class, 'index']);
// Route::get('/lorung', [LorungController::class, 'index']);