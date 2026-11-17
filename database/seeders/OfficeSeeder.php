<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $offices = [
            [
                'name' => 'Kantor Kimaja',
                'code' => 'KIMAJA',
                'is_active' => true,
            ],
            [
                'name' => 'Kantor Morotai',
                'code' => 'MOROTAI',
                'is_active' => true,
            ],
        ];

        foreach ($offices as $office) {
            DB::table('offices')->updateOrInsert(
                ['code' => $office['code']],
                [
                    'name' => $office['name'],
                    'is_active' => $office['is_active'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
