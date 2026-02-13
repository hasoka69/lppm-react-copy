<?php
$output = [];
exec('php artisan migrate:status', $output);
file_put_contents('migration_status.txt', implode("\n", $output));
