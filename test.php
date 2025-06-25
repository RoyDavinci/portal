<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

$directory = 'downloads';
$files = [];

if (is_dir($directory)) {
    $dir = opendir($directory);
    while (($file = readdir($dir)) !== false) {
        if ($file != "." && $file != ".." && pathinfo($file, PATHINFO_EXTENSION) == 'zip') {
            $files[] = $file;
        }
    }
    closedir($dir);
}

usort($files, function ($a, $b) {
    $dateA = DateTime::createFromFormat('Y-m-d', substr($a, 7, 10));
    $dateB = DateTime::createFromFormat('Y-m-d', substr($b, 7, 10));

    return $dateB <=> $dateA;
});



echo json_encode($files);