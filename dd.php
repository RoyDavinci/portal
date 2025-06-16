<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require './conn.php';
require './log.php';

$conn = getConnection();

// Log raw inputs
log_action("Raw POST: " . json_encode($_POST));
log_action("Raw FILES: " . json_encode($_FILES));

$text = $_POST['text'] ?? '';
$batchId = $_POST['batchId'] ?? '';
$type = $_POST['sms_type'] ?? 'general'; // default to 'general' if not set

if (!$text) {
    log_action("Missing text");
    echo json_encode(["status" => false, "message" => "Text message is required."]);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] != UPLOAD_ERR_OK) {
    log_action("File upload failed.");
    echo json_encode(["status" => false, "message" => "File upload failed."]);
    exit;
}

$file_name = $_FILES['file']['name'];
$file_tmp  = $_FILES['file']['tmp_name'];
$file_size = $_FILES['file']['size'];
$max_size = 100 * 1024 * 1024;

if ($file_size > $max_size) {
    log_action("File too large: $file_size");
    echo json_encode(["status" => false, "message" => "File too large (max 100MB)."]);
    exit;
}

$allowed_extensions = ['csv', 'xls', 'xlsx', 'zip'];
$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

if (!in_array($file_ext, $allowed_extensions)) {
    echo json_encode(["status" => false, "message" => "Invalid file type."]);
    exit;
}

$upload_dir = '/var/www/html/bulksms/ubabulk/uploads/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$target_file = $upload_dir . uniqid('upload_') . '_' . basename($file_name);

if (file_exists($target_file)) {
    echo json_encode(["status" => false, "message" => "File already exists."]);
    exit;
}

if (!move_uploaded_file($file_tmp, $target_file)) {
    log_action("Failed to move uploaded file.");
    echo json_encode(["status" => false, "message" => "Failed to store uploaded file."]);
    exit;
}

$file_escaped = $conn->real_escape_string($target_file);
$text_escaped = $conn->real_escape_string($text);
$type_escaped = $conn->real_escape_string($type);
$batch_escaped = $conn->real_escape_string($batchId);

$query = "INSERT INTO uploaded_files (file_path, message, status, type, batch_id) VALUES ('$file_escaped', '$text_escaped', '0', '$type_escaped', '$batch_escaped')";
$result = $conn->query($query);

if (!$result) {
    log_action("Insert failed: " . $conn->error);
    echo json_encode(["status" => false, "message" => "Failed to save file record."]);
    closeConnection($conn);
    exit;
}

echo json_encode([
    "status" => true,
    "message" => "File uploaded and saved successfully.",
    "file" => basename($target_file),
]);

closeConnection($conn);
