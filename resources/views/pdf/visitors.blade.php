
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Pengunjung ITN</title>

    <style>
        @page {
            margin: 25px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #1e293b;
        }

        /* HEADER */
        .header {
            width: 100%;
            border-bottom: 2px solid #059669;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .logo-cell {
            width: 125px;
            vertical-align: middle;
        }

        .logo {
            max-width: 115px;
            max-height: 65px;
        }

        .company-cell {
            vertical-align: middle;
            padding-left: 12px;
        }

        .company-name {
            font-size: 17px;
            font-weight: bold;
            color: #047857;
            margin-bottom: 5px;
        }

        .company-subtitle {
            font-size: 9px;
            color: #64748b;
            line-height: 1.5;
        }

        /* JUDUL LAPORAN */
        .report-title {
            text-align: center;
            margin-bottom: 18px;
        }

        .report-title h2 {
            font-size: 14px;
            margin: 0 0 7px;
        }

        .report-title p {
            margin: 3px 0;
            color: #64748b;
        }

        /* SECTION */
        .section-title {
            font-size: 11px;
            font-weight: bold;
            margin: 18px 0 9px;
            color: #1e293b;
        }

        /* TOTAL PENGUNJUNG */
        .summary {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 10px 12px;
            margin-bottom: 15px;
        }

        .summary strong {
            color: #047857;
            font-size: 14px;
        }

        /* SUMMARY CARD */
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        .summary-table td {
            width: 33.33%;
            padding: 11px;
            border: 1px solid #a7f3d0;
            background: #ecfdf5;
        }

        .summary-label {
            font-size: 9px;
            color: #64748b;
            margin-bottom: 5px;
        }

        .summary-number {
            font-size: 17px;
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
            margin-top: 8px;
        }

        .data-table thead,
        .receptionist-table thead {
            display: table-header-group;
        }

        .data-table th,
        .receptionist-table th {
            background: #047857;
            color: white;
            padding: 9px 6px;
            text-align: left;
            font-size: 9px;
            border: 1px solid #047857;
        }

        .data-table td,
        .receptionist-table td {
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            font-size: 9px;
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
            padding: 20px;
            color: #64748b;
        }

        /* TANDA TANGAN */
        .signature-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }

        .signature-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 12px;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }

        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 5px 30px;
        }

        .signature-role {
            font-weight: bold;
            font-size: 10px;
        }

        .signature-space {
            height: 85px;
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
            font-size: 10px;
        }

        .signature-caption {
            font-size: 9px;
            color: #64748b;
            margin-top: 4px;
        }

        /* FOOTER */
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 9px;
            color: #64748b;
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
    </div>


    <!-- ================================================= -->
    <!-- REKAPITULASI KHUSUS MINGGUAN, BULANAN, DAN CUSTOM -->
    <!-- ================================================= -->

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

                    <th>
                        Nama Receptionist
                    </th>

                    <th width="25%" class="center">
                        Jumlah Pengunjung
                    </th>

                    <th width="25%" class="center">
                        Persentase
                    </th>
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

        <!-- FORMAT SEDERHANA KHUSUS LAPORAN HARIAN -->
        <div class="summary">
            Total Pengunjung:
            <strong>{{ $totalVisitors }} Tamu</strong>
        </div>

    @endif


    <!-- =========================== -->
    <!-- DETAIL DATA SELURUH TAMU -->
    <!-- =========================== -->

    <div class="section-title">
        DETAIL DATA PENGUNJUNG
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th width="4%" class="center">No.</th>
                <th width="13%">Nama Pengunjung</th>
                <th width="9%">Jenis</th>
                <th width="15%">Alamat</th>
                <th width="13%">Perusahaan</th>
                <th width="19%">Tujuan Kunjungan</th>
                <th width="9%">Tanggal</th>
                <th width="7%">Waktu</th>
                <th width="11%">Receptionist</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($visitors as $index => $visitor)
                <tr>
                    <td class="center">
                        {{ $index + 1 }}
                    </td>

                    <td>
                        {{ $visitor->name }}
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
                    <td colspan="9" class="empty">
                        Tidak ada data pengunjung pada periode ini.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>


    <!-- =========================== -->
    <!-- TANDA TANGAN LAPORAN HARIAN -->
    <!-- =========================== -->

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
