<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SecuritySeeder extends Seeder
{
    public function run(): void
    {
        $morotai = Office::where('code', 'MOROTAI')->firstOrFail();

        for ($i = 1; $i <= 6; $i++) {
            $name = sprintf('Security %02d', $i);

            DB::table('security_personnel')->updateOrInsert(
                [
                    'office_id' => $morotai->id,
                    'name' => $name,
                ],
                [
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
