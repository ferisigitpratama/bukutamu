
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Pengunjung ITN</title>

    <style>
        @page {
            margin: 15px 20px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            color: #1e293b;
        }

        /* HEADER */
        .header {
            width: 100%;
            border-bottom: 2px solid #059669;
            padding-bottom: 7px;
            margin-bottom: 9px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .logo-cell {
            width: 110px;
            vertical-align: middle;
        }

        .logo {
            max-width: 100px;
            max-height: 48px;
        }

        .company-cell {
            vertical-align: middle;
            padding-left: 10px;
        }

        .company-name {
            font-size: 15px;
            font-weight: bold;
            color: #047857;
            margin-bottom: 3px;
        }

        .company-subtitle {
            font-size: 8px;
            color: #64748b;
            line-height: 1.3;
        }

        /* JUDUL LAPORAN */
        .report-title {
            text-align: center;
            margin-bottom: 9px;
        }

        .report-title h2 {
            font-size: 12px;
            margin: 0 0 4px;
        }

        .report-title p {
            margin: 2px 0;
            color: #64748b;
            font-size: 8px;
        }

        .office-info {
            margin-top: 4px;
            font-weight: bold;
            color: #047857;
        }

        /* SECTION */
        .section-title {
            font-size: 9px;
            font-weight: bold;
            margin: 10px 0 5px;
            color: #1e293b;
        }

        /* SUMMARY */
        .summary {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 7px 10px;
            margin-bottom: 8px;
        }

        .summary strong {
            color: #047857;
            font-size: 12px;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }

        .summary-table td {
            width: 33.33%;
            padding: 7px;
            border: 1px solid #a7f3d0;
            background: #ecfdf5;
        }

        .summary-label {
            font-size: 8px;
            color: #64748b;
            margin-bottom: 3px;
        }

        .summary-number {
            font-size: 14px;
            font-weight: bold;
            color: #047857;
        }

        /* TABLE */
        .data-table,
        .receptionist-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table {
            margin-top: 5px;
            margin-bottom: 10px;
        }

        .data-table thead,
        .receptionist-table thead {
            display: table-header-group;
        }

        .data-table th,
        .receptionist-table th {
            background: #047857;
            color: white;
            padding: 5px 4px;
            text-align: left;
            font-size: 7px;
            border: 1px solid #047857;
        }

        .data-table td,
        .receptionist-table td {
            padding: 5px 4px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            font-size: 7px;
        }

        .data-table tr:nth-child(even),
        .receptionist-table tr:nth-child(even) {
            background: #f8fafc;
        }

        .center {
            text-align: center;
        }

        .empty {
            text-align: center;
            padding: 10px;
            color: #64748b;
        }

        .office-label {
            display: inline-block;
            background: #ecfdf5;
            color: #047857;
            padding: 4px 8px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 3px;
        }

        /* TANDA TANGAN */
        .signature-section {
            margin-top: 12px;
            page-break-inside: auto;
        }

        .signature-title {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 7px;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }

        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 3px 20px;
        }

        .signature-role {
            font-weight: bold;
            font-size: 9px;
        }

        .signature-space {
            height: 45px;
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
            font-size: 9px;
        }

        .signature-caption {
            font-size: 8px;
            color: #64748b;
            margin-top: 3px;
        }

        /* FOOTER */
        .footer {
            margin-top: 8px;
            text-align: right;
            font-size: 7px;
            color: #64748b;
            line-height: 1.4;
        }
    </style>
</head>

<body>

    <!-- HEADER LOGO DAN IDENTITAS ITN -->
    <div class="header">
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    @if ($logoData)
                        <img
                            src="{{ $logoData }}"
                            class="logo"
                            alt="Logo ITN"
                        >
                    @endif
                </td>

                <td class="company-cell">
                    <div class="company-name">
                        PT INDONESIA TRANS NETWORK
                    </div>

                    <div class="company-subtitle">
                        DIGITAL GUEST BOOK
                        <br>
                        Laporan Administrasi Kunjungan Tamu
                    </div>
                </td>
            </tr>
        </table>
    </div>


    <!-- JUDUL DAN PERIODE -->
    <div class="report-title">
        <h2>LAPORAN HISTORY PENGUNJUNG</h2>

        <p>
            Periode: {{ $periodLabel }}
        </p>

        <p>
            {{ $startDate->translatedFormat('d F Y') }}
            -
            {{ $endDate->translatedFormat('d F Y') }}
        </p>

        @if (!empty($selectedOfficeName))
            <p class="office-info">
                Kantor: {{ $selectedOfficeName }}
            </p>
        @endif
    </div>


    <!-- REKAPITULASI -->
    @if (!$isDailyReport)

        <div class="section-title">
            REKAPITULASI KUNJUNGAN
        </div>

        <table class="summary-table">
            <tr>
                <td>
                    <div class="summary-label">
                        Total Pengunjung
                    </div>

                    <div class="summary-number">
                        {{ $totalVisitors }} Tamu
                    </div>
                </td>

                <td>
                    <div class="summary-label">
                        Pengunjung Perusahaan
                    </div>

                    <div class="summary-number">
                        {{ $companyVisitors }} Tamu
                    </div>
                </td>

                <td>
                    <div class="summary-label">
                        Pengunjung Perorangan
                    </div>

                    <div class="summary-number">
                        {{ $individualVisitors }} Tamu
                    </div>
                </td>
            </tr>
        </table>


        <!-- REKAP RECEPTIONIST -->
        <div class="section-title">
            REKAPITULASI BERDASARKAN RECEPTIONIST
        </div>

        <table class="receptionist-table">
            <thead>
                <tr>
                    <th width="8%" class="center">No.</th>
                    <th>Nama Receptionist</th>
                    <th width="25%" class="center">Jumlah Pengunjung</th>
                    <th width="25%" class="center">Persentase</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($receptionistSummary as $index => $receptionist)
                    <tr>
                        <td class="center">
                            {{ $index + 1 }}
                        </td>

                        <td>
                            {{ $receptionist['name'] }}
                        </td>

                        <td class="center">
                            {{ $receptionist['total'] }}
                        </td>

                        <td class="center">
                            {{ $totalVisitors > 0
                                ? number_format(
                                    ($receptionist['total'] / $totalVisitors) * 100,
                                    1
                                )
                                : '0.0' }}%
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="empty">
                            Belum ada data receptionist.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

    @else

        <!-- LAPORAN HARIAN -->
        <div class="summary">
            Total Pengunjung:
            <strong>{{ $totalVisitors }} Tamu</strong>
        </div>

    @endif


    <!-- TABEL KANTOR KIMAJA -->
    @if (empty($selectedOfficeCode) || $selectedOfficeCode === 'KIMAJA')

        <div class="section-title">
            <span class="office-label">
                KANTOR KIMAJA
            </span>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th width="3%" class="center">No.</th>
                    <th width="12%">Nama Pengunjung</th>
                    <th width="10%">Telepon</th>
                    <th width="8%">Jenis</th>
                    <th width="13%">Alamat</th>
                    <th width="11%">Perusahaan</th>
                    <th width="19%">Tujuan Kunjungan</th>
                    <th width="8%">Tanggal</th>
                    <th width="6%">Waktu</th>
                    <th width="10%">Receptionist</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($kimajaVisitors as $index => $visitor)
                    <tr>
                        <td class="center">
                            {{ $index + 1 }}
                        </td>

                        <td>
                            {{ $visitor->name }}
                        </td>

                        <td>
                            {{ $visitor->phone ?: '-' }}
                        </td>

                        <td>
                            {{ $visitor->visitor_type === 'perusahaan'
                                ? 'Perusahaan'
                                : 'Perorangan' }}
                        </td>

                        <td>
                            {{ $visitor->address }}
                        </td>

                        <td>
                            {{ $visitor->company ?: '-' }}
                        </td>

                        <td>
                            {{ $visitor->purpose }}
                        </td>

                        <td>
                            {{ $visitor->visited_at->translatedFormat('d/m/Y') }}
                        </td>

                        <td>
                            {{ $visitor->visited_at->format('H:i') }}
                        </td>

                        <td>
                            {{ $visitor->receptionist->name ?? '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="10" class="empty">
                            Tidak ada data pengunjung Kantor Kimaja pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

    @endif


    <!-- TABEL KANTOR MOROTAI -->
    @if (empty($selectedOfficeCode) || $selectedOfficeCode === 'MOROTAI')

        <div class="section-title">
            <span class="office-label">
                KANTOR MOROTAI
            </span>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th width="3%" class="center">No.</th>
                    <th width="12%">Nama Pengunjung</th>
                    <th width="10%">Telepon</th>
                    <th width="8%">Jenis</th>
                    <th width="12%">Alamat</th>
                    <th width="10%">Perusahaan</th>
                    <th width="19%">Tujuan Kunjungan</th>
                    <th width="8%">Tanggal</th>
                    <th width="7%">Waktu</th>
                    <th width="11%">Security</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($morotaiVisitors as $index => $visitor)
                    <tr>
                        <td class="center">
                            {{ $index + 1 }}
                        </td>

                        <td>
                            {{ $visitor->name }}
                        </td>

                        <td>
                            {{ $visitor->phone ?: '-' }}
                        </td>

                        <td>
                            {{ $visitor->visitor_type === 'perusahaan'
                                ? 'Perusahaan'
                                : 'Perorangan' }}
                        </td>

                        <td>
                            {{ $visitor->address }}
                        </td>

                        <td>
                            {{ $visitor->company ?: '-' }}
                        </td>

                        <td>
                            {{ $visitor->purpose }}
                        </td>

                        <td>
                            {{ $visitor->visited_at->translatedFormat('d/m/Y') }}
                        </td>

                        <td>
                            {{ $visitor->visited_at->format('H:i') }}
                        </td>

                        <td>
                            {{ $visitor->security->name ?? '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="10" class="empty">
                            Tidak ada data pengunjung Kantor Morotai pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

    @endif


    <!-- TANDA TANGAN LAPORAN HARIAN -->
    @if ($isDailyReport)

        <div class="signature-section">

            <div class="signature-title">
                PENGESAHAN LAPORAN HARIAN
            </div>

            <table class="signature-table">
                <tr>
                    <td>
                        <div class="signature-role">
                            Petugas Customer Service
                        </div>

                        <div class="signature-space"></div>

                        <div class="signature-name">
                            {{ $printedBy }}
                        </div>

                        <div class="signature-caption">
                            Petugas yang mencetak laporan
                        </div>
                    </td>

                    <td>
                        <div class="signature-role">
                            Mengetahui,
                        </div>

                        <div class="signature-space"></div>

                        <div class="signature-name">
                            &nbsp;
                        </div>

                        <div class="signature-caption">
                            Supervisor / Penanggung Jawab
                        </div>
                    </td>
                </tr>
            </table>

        </div>

    @endif


    <!-- FOOTER -->
    <div class="footer">
        Dicetak oleh: {{ $printedBy }}
        <br>

        Waktu cetak:
        {{ now()->translatedFormat('d F Y H:i') }}
        WIB

        <br>
        Digital Guest Book ITN
    </div>

</body>
</html>
