
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('address');

            $table->string('visitor_type', 30);
            $table->string('company')->nullable();

            $table->text('purpose');

            $table->foreignId('receptionist_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->dateTime('visited_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
