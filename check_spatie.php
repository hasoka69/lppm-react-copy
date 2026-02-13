<?php
if (class_exists('Spatie\Permission\Models\Permission')) {
    echo "Spatie Permission exists.\n";
} else {
    echo "Spatie Permission NOT found.\n";
}
if (class_exists('App\Models\Permission')) {
    echo "App Permission exists.\n";
} else {
    echo "App Permission NOT found.\n";
}
