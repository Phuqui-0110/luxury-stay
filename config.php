<?php
// Cấu hình kết nối database (MySQL / MariaDB - XAMPP, Laragon)
define('DB_HOST', 'localhost');
define('DB_NAME', 'luxury_stay');
define('DB_USER', 'root');   // mặc định của XAMPP/Laragon
define('DB_PASS', '');       // mặc định của XAMPP/Laragon là rỗng

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function getDB() {
    static $conn = null;
    if ($conn === null) {
        mysqli_report(MYSQLI_REPORT_OFF);
        $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            jsonResponse(['success' => false, 'message' => 'Kết nối DB thất bại. Hãy kiểm tra api/config.php và đã import sql/database.sql chưa.'], 500);
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}

function requireLogin() {
    if (empty($_SESSION['user_id'])) {
        header('Location: ../login.html');
        exit;
    }
}

function requireStaff() {
    requireLogin();
    $role = $_SESSION['role'] ?? '';
    if (!in_array($role, ['staff', 'admin'], true)) {
        header('Location: ../index.html');
        exit;
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
