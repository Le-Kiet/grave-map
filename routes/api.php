<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoituongController;
use App\Http\Controllers\Api\LorungController;
use App\Http\Controllers\Api\NguongocController;
use App\Http\Controllers\Api\GeomController;
use App\Http\Controllers\Api\LamnghiepController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\HistoryController;
use App\Http\Controllers\Api\LorungHistoryController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\FinalHistoryController;
use App\Http\Controllers\Api\LorungFinalHistoryController;
use App\Http\Controllers\Api\DemoController;
use App\Http\Controllers\Api\GraveController;
use App\Http\Controllers\Api\AnniversaryController;

Route::get('/pass-away-anni', [AnniversaryController::class, 'index']);
Route::post('/pass-away-anni', [AnniversaryController::class, 'store']);
Route::put('/pass-away-anni/update/{id}', [AnniversaryController::class, 'update']);
Route::delete('/pass-away-anni/delete/{id}', [AnniversaryController::class, 'destroy']);

Route::get('/grave', [GraveController::class, 'index']);
Route::post('/grave', [GraveController::class, 'store']);
Route::put('/grave/update/{id}', [GraveController::class, 'update']);
Route::delete('/grave/delete/{id}', [GraveController::class, 'destroy']);

Route::get('/demo', [DemoController::class, 'index']);
Route::post('/demo', [DemoController::class, 'store']);
Route::put('/demo/update/{id}', [DemoController::class, 'update']);
Route::delete('/demo/delete/{id}', [DemoController::class, 'destroy']);

Route::get('/final_history', [FinalHistoryController::class, 'index']);
Route::get('/lorung_final_history', [LorungFinalHistoryController::class, 'index']);

Route::get('/lorung/all', [LorungController::class, 'index']);
Route::get('/lorung', [LorungController::class, 'index_paginate']);

Route::post('/lorung', [LorungController::class, 'store']);
Route::put('/lorung/{id}', [LorungController::class, 'update']);
Route::delete('/lorung/{id}', [LorungController::class, 'destroy']);

Route::get('/nguongoc', [NguongocController::class, 'index']);
Route::get('/geom', [GeomController::class, 'index']);
Route::get('/lamnghiep', [LamnghiepController::class, 'index']);

Route::get('/admin/user', [UserController::class, 'index']);
Route::post('/admin/user', [UserController::class, 'store']);
Route::put('/admin/user/{id}', [UserController::class, 'update']);
Route::delete('/admin/user/{id}', [UserController::class, 'destroy']);

Route::get('/admin/roles', [RolesController::class, 'index']);
Route::post('/admin/roles', [RolesController::class, 'store']);
Route::put('/admin/roles/{id}', [RolesController::class, 'update']);
Route::delete('/admin/roles/{id}', [RolesController::class, 'destroy']);


Route::get('/admin/permissions', [PermissionController::class, 'index']);
Route::post('/admin/permissions', [PermissionController::class, 'store']);
Route::put('/admin/permissions/{id}', [PermissionController::class, 'update']);
Route::delete('/admin/permissions/{id}', [PermissionController::class, 'destroy']);


Route::get('/admin/rolepermissions', [RolePermissionController::class, 'index']);
Route::post('/admin/rolepermissions', [RolePermissionController::class, 'store']);
Route::put('/admin/rolepermissions/{id}', [RolePermissionController::class, 'update']);
Route::delete('/admin/rolepermissions', [RolePermissionController::class, 'destroy']);

Route::post('/lamnghiep', [LamnghiepController::class, 'store']);
Route::put('/lamnghiep/{id}', [LamnghiepController::class, 'update']);
Route::delete('/lamnghiep/{id}', [LamnghiepController::class, 'destroy']);

Route::get('/history', [HistoryController::class, 'history']);
Route::get('/lorung_history', [LorungHistoryController::class, 'history']);

Route::get('/approval/pending', [ApprovalController::class, 'pending']);
Route::post('/approval/approve/{id}', [ApprovalController::class, 'approve']);
Route::post('/approval/reject/{id}', [ApprovalController::class, 'reject']);

Route::get('/approval/pending_lorung', [ApprovalController::class, 'pending_lorung']);
Route::post('/approval/approve_lorung/{id}', [ApprovalController::class, 'approve_lorung']);
Route::post('/approval/reject_lorung/{id}', [ApprovalController::class, 'reject_lorung']);
