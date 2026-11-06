<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'anisa@itn.net.id'],
            [
                'name' => 'Anisa Mardhatillah',
                'password' => Hash::make('transnet123'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'farah@itn.net.id'],
            [
                'name' => 'Farah Adila',
                'password' => Hash::make('transnet123'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'desi@itn.net.id'],
            [
                'name' => 'Desi Darmilayanto',
                'password' => Hash::make('transnet123'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'diaz@itn.net.id'],
            [
                'name' => 'Diaz Uliza',
                'password' => Hash::make('transnet123'),
            ]
        );
        User::updateOrCreate(
            ['email' => 'ferisigitpratama@gmail.com'],
            [
                'name' => 'Feri Sigit Pratama',
                'password' => Hash::make('transnet123'),
            ]
        );
    }
}
