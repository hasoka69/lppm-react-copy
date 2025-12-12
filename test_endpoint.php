<?php
// Test the endpoint directly without going through the web server

require 'vendor/autoload.php';

// Create the Laravel app
$app = require_once 'bootstrap/app.php';

// Boot the app
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

// Create a test request
$request = \Illuminate\Http\Request::create('/pengajuan/1/anggota-dosen', 'GET');

// Set the user to ID 1 (to bypass authorization)
$user = \App\Models\User::find(1);
$request->setUserResolver(function () use ($user) {
    return $user;
});

// Handle the request through the application
$response = $kernel->handle($request);

// Output the response
echo "Status: " . $response->status() . "\n";
echo "Content-Type: " . $response->headers->get('content-type') . "\n";
echo "Body:\n";
echo $response->getContent();
