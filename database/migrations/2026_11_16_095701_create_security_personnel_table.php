
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_personnel', function (Blueprint $table) {
            $table->id();

            $table->foreignId('office_id')
                ->constrained('offices')
                ->restrictOnDelete();

            $table->string('name');
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['office_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_personnel');
    }
};
