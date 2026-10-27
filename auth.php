<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'Phương thức không hợp lệ'], 405);
        }
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        if ($email === '' || $password === '') {
            jsonResponse(['success' => false, 'message' => 'Vui lòng nhập email và mật khẩu'], 400);
        }
        $db = getDB();
        $stmt = $db->prepare("SELECT id, full_name, email, password, role FROM users WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true); // chống session fixation
            $_SESSION['user_id'] = (int)$user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            jsonResponse([
                'success' => true,
                'user' => [
                    'id' => (int)$user['id'],
                    'name' => $user['full_name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        }
        jsonResponse(['success' => false, 'message' => 'Email hoặc mật khẩu không đúng'], 401);
        break;

    case 'register':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'Phương thức không hợp lệ'], 405);
        }
        $name = trim($_POST['full_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $password = $_POST['password'] ?? '';
        if ($name === '' || $email === '' || $password === '') {
            jsonResponse(['success' => false, 'message' => 'Vui lòng điền đủ thông tin'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['success' => false, 'message' => 'Email không hợp lệ'], 400);
        }
        if (strlen($password) < 6) {
            jsonResponse(['success' => false, 'message' => 'Mật khẩu phải có ít nhất 6 ký tự'], 400);
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $db = getDB();
        $stmt = $db->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, 'customer')");
        $stmt->bind_param('ssss', $name, $email, $phone, $hash);
        if ($stmt->execute()) {
            jsonResponse(['success' => true, 'message' => 'Đăng ký thành công']);
        }
        if ($stmt->errno === 1062) { // trùng email
            jsonResponse(['success' => false, 'message' => 'Email đã tồn tại'], 409);
        }
        jsonResponse(['success' => false, 'message' => 'Không thể đăng ký, vui lòng thử lại'], 500);
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
        jsonResponse(['success' => true]);
        break;

    case 'me':
        if (empty($_SESSION['user_id'])) {
            jsonResponse(['logged_in' => false]);
        }
        jsonResponse([
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['full_name'],
                'email' => $_SESSION['email'],
                'role' => $_SESSION['role']
            ]
        ]);
        break;

    default:
        jsonResponse(['success' => false, 'error' => 'Invalid action'], 400);
}
