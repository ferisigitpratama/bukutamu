<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\SecurityPersonnelController;

Route::redirect('/', '/login')->name('home');

// AUTHENTICATED ROUTES
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [VisitorController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('/visitors', [VisitorController::class, 'index'])
        ->name('visitors.index');

    Route::post('/visitors', [VisitorController::class, 'store'])
        ->name('visitors.store');

    Route::get('/history', [VisitorController::class, 'history'])
        ->name('visitors.history');

    Route::get('/history/pdf', [VisitorController::class, 'exportPdf'])
        ->name('visitors.export-pdf');

    Route::get('/security', [SecurityPersonnelController::class, 'index'])
    ->name('security.index');

Route::post('/security', [SecurityPersonnelController::class, 'store'])
    ->name('security.store');

Route::put('/security/{securityPersonnel}', [SecurityPersonnelController::class, 'update'])
    ->name('security.update');

Route::patch('/security/{securityPersonnel}/status', [SecurityPersonnelController::class, 'toggleStatus'])
    ->name('security.status');
});

require __DIR__.'/settings.php';