<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$apiKey = 'AIzaSyCZSPuiDp1UNN7teUu7fJz_GZ_vQXyoM7s';
$allowedEmails = ['araujo3ve@gmail.com', 'caiorocker@gmail.com'];
$allowedFolders = ['hero', 'discography'];
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
$maxBytesByFolder = [
    'hero' => 12 * 1024 * 1024,
    'discography' => 5 * 1024 * 1024,
];

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Metodo nao permitido.');
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
    fail(401, 'Token ausente.');
}

$idToken = trim($matches[1]);
$folder = $_POST['folder'] ?? '';
if (!in_array($folder, $allowedFolders, true)) {
    fail(400, 'Pasta invalida.');
}

$maxBytes = $maxBytesByFolder[$folder] ?? (5 * 1024 * 1024);

if (!isset($_FILES['image']) || !is_array($_FILES['image'])) {
    fail(400, 'Arquivo ausente.');
}

$file = $_FILES['image'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    fail(400, 'Falha no upload do arquivo.');
}

if (($file['size'] ?? 0) > $maxBytes) {
    fail(413, 'Arquivo muito grande.');
}

$verificationUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . urlencode($apiKey);
$verificationPayload = json_encode(['idToken' => $idToken], JSON_UNESCAPED_SLASHES);

$verificationContext = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $verificationPayload,
        'timeout' => 20,
    ],
]);

$verificationResponse = @file_get_contents($verificationUrl, false, $verificationContext);
if ($verificationResponse === false) {
    fail(401, 'Nao foi possivel validar o login.');
}

$verificationData = json_decode($verificationResponse, true);
$email = strtolower((string)($verificationData['users'][0]['email'] ?? ''));
if ($email === '' || !in_array($email, $allowedEmails, true)) {
    fail(403, 'Usuario sem permissao para upload.');
}

$tmpPath = (string)($file['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
    fail(400, 'Upload invalido.');
}

$mimeType = mime_content_type($tmpPath) ?: '';
if (!isset($allowedMimeTypes[$mimeType])) {
    fail(415, 'Tipo de arquivo nao suportado.');
}

$extension = $allowedMimeTypes[$mimeType];
$baseDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $folder;
if (!is_dir($baseDirectory) && !mkdir($baseDirectory, 0755, true) && !is_dir($baseDirectory)) {
    fail(500, 'Nao foi possivel criar a pasta de upload.');
}

$safeOriginalName = preg_replace('/[^a-zA-Z0-9._-]+/', '-', (string)($file['name'] ?? 'imagem'));
$safeOriginalName = trim((string)$safeOriginalName, '-');
$targetName = time() . '-' . bin2hex(random_bytes(4)) . '-' . $safeOriginalName;
$targetName = preg_replace('/\.[a-zA-Z0-9]+$/', '', $targetName) . '.' . $extension;
$targetPath = $baseDirectory . DIRECTORY_SEPARATOR . $targetName;

if (!move_uploaded_file($tmpPath, $targetPath)) {
    fail(500, 'Nao foi possivel salvar o arquivo.');
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$url = $scheme . '://' . $host . '/uploads/' . rawurlencode($folder) . '/' . rawurlencode($targetName);

echo json_encode(['url' => $url], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
