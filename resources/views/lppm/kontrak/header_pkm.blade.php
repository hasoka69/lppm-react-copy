<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: "Times New Roman", serif;
            font-size: 12pt;
        }

        table {
            width: 100%;
        }

        .logo {
            width: 80px;
        }

        .header-text {
            text-align: center;
            line-height: 1.2;
            font-size: 16pt;
        }

        hr {
            border: 2px solid black;
        }
    </style>
</head>

<body>

    <table>
        <tr>

            <td width="15%" style="text-align: center;">
                @php
                    // Coba beberapa kemungkinan path untuk Logo Asaindo
                    $possiblePaths = [
                        public_path('image/logo-asaindo.png')
                    ];
                    $base64 = '';
                    foreach ($possiblePaths as $path) {
                        if (file_exists($path)) {
                            $type = pathinfo($path, PATHINFO_EXTENSION);
                            $data = file_get_contents($path);
                            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                            break;
                        }
                    }
                @endphp
                @if($base64)
                    <img src="{{ $base64 }}" style="width: 80px;">
                @endif
            </td>

            <td class="header-text">

                <b>KONTRAK PENGABDIAN KEPADA MASYARAKAT</b><br>
                <b>HIBAH INTERNAL</b><br>
                <b>LEMBAGA PENELITIAN DAN PENGABDIAN KEPADA MASYARAKAT</b>

            </td>

            <td width="15%"></td>

        </tr>
    </table>

    <hr>

</body>

</html>