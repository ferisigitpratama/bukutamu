
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->string('phone', 25)
                ->nullable()
                ->after('name');

            $table->foreignId('office_id')
                ->nullable()
                ->after('receptionist_id')
                ->constrained('offices')
                ->restrictOnDelete();

            $table->foreignId('security_id')
                ->nullable()
                ->after('office_id')
                ->constrained('security_personnel')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->dropForeign(['security_id']);
            $table->dropForeign(['office_id']);

            $table->dropColumn([
                'phone',
                'office_id',
                'security_id',
            ]);
        });
    }
};
