<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VisitorController;

Route::inertia('/', 'welcome')->name('home');

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
});

require __DIR__.'/settings.php';