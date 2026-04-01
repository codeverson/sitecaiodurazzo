<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    fail(405, 'Metodo nao permitido.');
}

$spotifyUrl = trim((string)($_GET['url'] ?? ''));
if ($spotifyUrl === '') {
    fail(400, 'URL ausente.');
}

$parsed = parse_url($spotifyUrl);
$host = strtolower((string)($parsed['host'] ?? ''));
if ($host !== 'open.spotify.com' && $host !== 'spotify.link') {
    fail(400, 'URL do Spotify invalida.');
}

$cacheDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'spotify-oembed';
if (!is_dir($cacheDirectory) && !mkdir($cacheDirectory, 0755, true) && !is_dir($cacheDirectory)) {
    fail(500, 'Nao foi possivel preparar o cache.');
}

$cacheKey = hash('sha256', $spotifyUrl);
$cacheFile = $cacheDirectory . DIRECTORY_SEPARATOR . $cacheKey . '.json';
$ttlSeconds = 60 * 60 * 24 * 30;

if (is_file($cacheFile) && (time() - (int) filemtime($cacheFile)) < $ttlSeconds) {
    $cached = file_get_contents($cacheFile);
    if ($cached !== false) {
        echo $cached;
        exit;
    }
}

$endpoint = 'https://open.spotify.com/oembed?url=' . rawurlencode($spotifyUrl);
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Accept: application/json\r\nUser-Agent: CaioDurazzoSite/1.0\r\n",
        'timeout' => 15,
        'ignore_errors' => true,
    ],
]);

$response = @file_get_contents($endpoint, false, $context);
if ($response === false) {
    fail(502, 'Nao foi possivel consultar o Spotify.');
}

$statusCode = 200;
if (isset($http_response_header) && is_array($http_response_header)) {
    foreach ($http_response_header as $headerLine) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $headerLine, $matches)) {
            $statusCode = (int) $matches[1];
            break;
        }
    }
}

if ($statusCode < 200 || $statusCode >= 300) {
    http_response_code($statusCode);
    echo $response;
    exit;
}

$decoded = json_decode($response, true);
if (!is_array($decoded)) {
    fail(502, 'Resposta invalida do Spotify.');
}

$safePayload = json_encode(
    [
        'title' => isset($decoded['title']) ? (string) $decoded['title'] : null,
        'thumbnail_url' => isset($decoded['thumbnail_url']) ? (string) $decoded['thumbnail_url'] : null,
        'provider_name' => isset($decoded['provider_name']) ? (string) $decoded['provider_name'] : null,
    ],
    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
);

if ($safePayload === false) {
    fail(500, 'Nao foi possivel preparar a resposta.');
}

file_put_contents($cacheFile, $safePayload, LOCK_EX);
echo $safePayload;
