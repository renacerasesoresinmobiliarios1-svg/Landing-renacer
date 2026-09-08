<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
try {
    /** @var \Illuminate\Foundation\Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    error_log((string) $e);
    http_response_code(500);
    header('Content-Type: text/plain');
    echo "Error del servidor. Por favor, intenta de nuevo más tarde.";
    exit(1);
}
