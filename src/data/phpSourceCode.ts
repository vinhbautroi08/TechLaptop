import { PhpSourceFile } from '../types';

export const PHP_SOURCE_FILES: PhpSourceFile[] = [
  {
    path: 'database.sql',
    folder: 'sql',
    title: 'database.sql — Khởi tạo CSDL MySQL 8.0 & 15 Laptop Mẫu',
    description:
      'Tạo cơ sở dữ liệu laptop_store, 4 bảng quan hệ (users, products, orders, order_details), khóa ngoại ON DELETE RESTRICT bảo toàn lịch sử đơn hàng, chỉ mục tối ưu tìm kiếm và 15 mẫu laptop chính hãng.',
    language: 'sql',
    code: `-- ============================================================================
-- ĐỀ TÀI 4: WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN LAPTOP NÂNG CAO (TECHLAPTOP)
-- Tệp khởi tạo Cơ sở dữ liệu MySQL 8.0+ (Chuẩn UTF8MB4)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS laptop_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laptop_store;

-- 1. BẢNG NGƯỜI DÙNG (users)
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu băm bằng password_hash() Bcrypt',
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG SẢN PHẨM LAPTOP (products)
CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    cpu VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    ssd VARCHAR(50) NOT NULL,
    price DECIMAL(15, 0) NOT NULL CHECK (price >= 0),
    image VARCHAR(255) NOT NULL DEFAULT 'uploads/products/default-laptop.jpg',
    description TEXT NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Đang kinh doanh, 0: Ngừng kinh doanh',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_search (name),
    INDEX idx_products_filter (is_active, cpu, ram, ssd, price, stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG ĐƠN HÀNG (orders)
CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    total_price DECIMAL(15, 0) NOT NULL CHECK (total_price >= 0),
    status ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('cod', 'online_sim') NOT NULL DEFAULT 'cod',
    payment_status ENUM('unpaid', 'paid', 'failed') NOT NULL DEFAULT 'unpaid',
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status_date (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG CHI TIẾT ĐƠN HÀNG (order_details)
-- Lưu lại product_name và unit_price tại thời điểm đặt hàng để không bị ảnh hưởng khi sản phẩm đổi giá
CREATE TABLE IF NOT EXISTS order_details (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    product_name VARCHAR(180) NOT NULL,
    unit_price DECIMAL(15, 0) NOT NULL CHECK (unit_price >= 0),
    quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(15, 0) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_details_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_details_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_details_order (order_id),
    INDEX idx_details_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DỮ LIỆU MẪU KHỞI TẠO HỆ THỐNG (CHỈ DÙNG CHO MÔI TRƯỜNG HỌC TẬP)
-- Lưu ý: Mật khẩu đều đã được băm bằng hàm password_hash(..., PASSWORD_DEFAULT)
-- Tài khoản Admin mẫu: admin (Mật khẩu gốc trước khi băm trong môi trường dev: Admin@123)
-- Tài khoản User mẫu: nguyenvanan, tranthibich (Mật khẩu gốc: User@123)
-- ============================================================================

INSERT INTO users (username, password, role, full_name, email, phone, address) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Quản Trị Viên TechLaptop', 'admin@techlaptop.edu.vn', '0901234567', '268 Lý Thường Kiệt, Quận 10, TP.HCM'),
('nguyenvanan', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'user', 'Nguyễn Văn An', 'nguyenvanan@student.edu.vn', '0912345678', '144 Xuân Thủy, Cầu Giấy, Hà Nội'),
('tranthibich', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'user', 'Trần Thị Bích', 'tranthibich@company.vn', '0987654321', '54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng');

-- 15 SẢN PHẨM LAPTOP MẪU ĐA PHÂN KHÚC
INSERT INTO products (name, cpu, ram, ssd, price, image, description, stock, is_active) VALUES
('Apple MacBook Air 13 M3 2024', 'Apple M3', '16GB', '512GB', 31990000, 'uploads/products/macbook-air-m3.jpg', 'MacBook Air 13 inch chip Apple M3 8 nhân CPU, 10 nhân GPU, màn hình Liquid Retina 500 nits, pin 18 giờ.', 14, 1),
('ASUS ROG Strix G16 G614JU Gaming', 'Intel Core i7', '16GB', '512GB', 33490000, 'uploads/products/rog-strix-g16.jpg', 'Laptop gaming Intel Core i7-13650HX, GPU RTX 4050 6GB 140W, màn hình 16 inch FHD+ 165Hz G-Sync.', 9, 1),
('Dell XPS 14 9440 OLED Ultra 7', 'Intel Core Ultra 7', '32GB', '1TB', 48990000, 'uploads/products/dell-xps-14.jpg', 'Ultrabook cao cấp khung nhôm CNC, Intel Core Ultra 7 155H, màn hình OLED 3.2K 120Hz chuẩn màu đồ họa.', 6, 1),
('Lenovo Legion Pro 5 16IRX9', 'Intel Core i7', '32GB', '1TB', 41990000, 'uploads/products/legion-pro-5.jpg', 'Máy trạm gaming Core i7-14700HX, RAM 32GB DDR5, SSD 1TB, RTX 4060 8GB, màn hình WQXGA 240Hz.', 8, 1),
('Dell Inspiron 15 3530 Office', 'Intel Core i5', '16GB', '512GB', 16490000, 'uploads/products/dell-inspiron-3530.jpg', 'Laptop văn phòng và sinh viên bền bỉ, Core i5-1335U, 16GB RAM, 512GB SSD, màn hình 15.6 inch 120Hz.', 22, 1),
('HP Pavilion 15 eg3091TU Silver', 'Intel Core i5', '16GB', '512GB', 17290000, 'uploads/products/hp-pavilion-15.jpg', 'Thiết kế vỏ kim loại thanh lịch, âm thanh B&O, Core i5-1335U, 16GB RAM, 512GB SSD.', 18, 1),
('ASUS VivoBook 15 OLED A1505VA', 'Intel Core i5', '16GB', '512GB', 18490000, 'uploads/products/vivobook-15-oled.jpg', 'Màn hình Lumina OLED 15.6 inch rực rỡ, vi xử lý Core i5-13500H 12 nhân hiệu năng cao.', 15, 1),
('Lenovo IdeaPad Slim 5 14IAH8', 'Intel Core i5', '16GB', '512GB', 15990000, 'uploads/products/ideapad-slim-5.jpg', 'Khung nhôm chuẩn quân đội MIL-STD-810H, nặng 1.46kg, màn hình 16:10 WUXGA chống chói.', 20, 1),
('Acer Aspire 5 Spin 14 Touch', 'Intel Core i5', '8GB', '256GB', 12990000, 'uploads/products/acer-aspire-spin.jpg', 'Laptop xoay gập 360 độ cảm ứng kèm bút stylus, phù hợp sinh viên ghi chú và thuyết trình.', 11, 1),
('Apple MacBook Pro 14 M3 Pro', 'Apple M3 Pro', '18GB', '512GB', 49990000, 'uploads/products/macbook-pro-14.jpg', 'Chip Apple M3 Pro chuyên nghiệp, màn hình Liquid Retina XDR 120Hz, cổng HDMI và SDXC đầy đủ.', 7, 1),
('LG Gram 16 Pro 2024 SuperLight', 'Intel Core Ultra 7', '16GB', '1TB', 36990000, 'uploads/products/lg-gram-16.jpg', 'Trọng lượng siêu nhẹ 1.199kg cho màn hình 16 inch WQXGA 144Hz, pin 77Wh dùng cả ngày.', 10, 1),
('ASUS ZenBook 14 OLED UX3405MA', 'Intel Core Ultra 7', '32GB', '1TB', 34490000, 'uploads/products/zenbook-14-oled.jpg', 'Ultrabook AI mỏng nhẹ 1.2kg, màn hình OLED 3K 120Hz, RAM 32GB LPDDR5x.', 12, 1),
('Acer Predator Helios Neo 16', 'Intel Core i7', '16GB', '1TB', 37990000, 'uploads/products/predator-helios-16.jpg', 'Tản nhiệt kim loại AeroBlade 3D, Core i7-14700HX, RTX 4060 8GB, màn hình 240Hz chuẩn sRGB.', 5, 1),
('MSI Katana 15 B13VGK Gaming', 'Intel Core i7', '16GB', '512GB', 28990000, 'uploads/products/msi-katana-15.jpg', 'Trang bị card đồ họa RTX 4070 8GB có MUX Switch, bàn phím RGB 4 vùng hành trình 1.7mm.', 13, 1),
('HP Omen 16 xf0071AX Ryzen 7', 'AMD Ryzen 7', '16GB', '1TB', 35490000, 'uploads/products/hp-omen-16.jpg', 'Chip AMD Ryzen 7 7840HS tiến trình 4nm mát mẻ kết hợp RTX 4060 8GB, màn hình 165Hz.', 0, 1);

-- ĐƠN HÀNG MẪU PHỤC VỤ THỐNG KÊ DOANH THU TRÊN DASHBOARD
INSERT INTO orders (id, user_id, total_price, status, payment_method, payment_status, receiver_name, receiver_phone, shipping_address, created_at) VALUES
(1001, 2, 48480000, 'completed', 'online_sim', 'paid', 'Nguyễn Văn An', '0912345678', '144 Xuân Thủy, Cầu Giấy, Hà Nội', '2026-08-24 10:15:00'),
(1002, 3, 66980000, 'completed', 'cod', 'paid', 'Trần Thị Bích', '0987654321', '54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng', '2026-09-14 14:40:00'),
(1003, 2, 41990000, 'completed', 'online_sim', 'paid', 'Nguyễn Văn An', '0912345678', '144 Xuân Thủy, Cầu Giấy, Hà Nội', '2026-10-12 11:05:00'),
(1004, 3, 28990000, 'pending', 'cod', 'unpaid', 'Trần Thị Bích', '0987654321', '54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng', '2026-10-28 07:10:00');

INSERT INTO order_details (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
(1001, 1, 'Apple MacBook Air 13 M3 2024', 31990000, 1, 31990000),
(1001, 5, 'Dell Inspiron 15 3530 Office', 16490000, 1, 16490000),
(1002, 2, 'ASUS ROG Strix G16 G614JU Gaming', 33490000, 2, 66980000),
(1003, 4, 'Lenovo Legion Pro 5 16IRX9', 41990000, 1, 41990000),
(1004, 14, 'MSI Katana 15 B13VGK Gaming', 28990000, 1, 28990000);
`,
  },
  {
    path: 'config/database.php',
    folder: 'config',
    title: 'config/database.php — Kết nối MySQL bằng PDO An Toàn',
    description:
      'Thiết lập kết nối PDO với chế độ tắt giả lập Prepared Statements (ATTR_EMULATE_PREPARES = false) chống SQL Injection triệt để và ghi log lỗi thay vì hiển thị thông tin nhạy cảm ra màn hình.',
    language: 'php',
    code: `<?php
/**
 * Tệp cấu hình kết nối Cơ sở dữ liệu MySQL bằng PDO
 * Đường dẫn: laptop-store/config/database.php
 */

declare(strict_types=1);

// Đọc thông tin cấu hình từ biến môi trường hoặc sử dụng mặc định của XAMPP
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'laptop_store');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

/**
 * Hàm trả về đối tượng kết nối PDO duy nhất (Singleton Pattern trong 1 request)
 */
function getDBConnection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );

        $options = [
            // Bật ngoại lệ khi có lỗi SQL để xử lý trong khối try-catch
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            // Mặc định trả về mảng kết hợp (Associative Array)
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // BẮT BUỘC tắt emulate prepares để MySQL thực thi Prepared Statements thật
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Ghi lỗi chi tiết vào file log máy chủ, tuyệt đối không in mật khẩu/stack trace ra màn hình
            error_log('[Database Connection Error] ' . $e->getMessage());
            http_response_code(500);
            die('Hệ thống đang bảo trì kết nối cơ sở dữ liệu. Vui lòng thử lại sau.');
        }
    }

    return $pdo;
}
`,
  },
  {
    path: 'includes/csrf.php',
    folder: 'includes',
    title: 'includes/csrf.php — Bảo vệ chống tấn công CSRF',
    description:
      'Sinh mã CSRF token ngẫu nhiên bằng random_bytes(32), nhúng vào form POST và kiểm tra an toàn bằng hash_equals().',
    language: 'php',
    code: `<?php
/**
 * Cơ chế tạo và kiểm tra CSRF Token cho mọi biểu mẫu POST thay đổi dữ liệu
 * Đường dẫn: laptop-store/includes/csrf.php
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Lấy hoặc khởi tạo CSRF token trong Session hiện tại
 */
function generateCsrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * In ra thẻ input ẩn chứa CSRF token để đặt trong thẻ <form method="POST">
 */
function csrfInputField(): string
{
    $token = htmlspecialchars(generateCsrfToken(), ENT_QUOTES, 'UTF-8');
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

/**
 * Kiểm tra tính hợp lệ của CSRF token gửi lên từ biểu mẫu POST
 */
function verifyCsrfToken(?string $submittedToken): bool
{
    if (empty($_SESSION['csrf_token']) || empty($submittedToken)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $submittedToken);
}

/**
 * Hàm chặn ngay lập tức nếu request không phải POST hoặc sai CSRF Token
 */
function requireValidPostWithCsrf(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        die('Phương thức truy cập không hợp lệ (Chỉ chấp nhận POST).');
    }

    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        http_response_code(403);
        die('Phiên làm việc không hợp lệ hoặc đã hết hạn (Lỗi xác thực CSRF Token).');
    }
}
`,
  },
  {
    path: 'includes/auth.php',
    folder: 'includes',
    title: 'includes/auth.php — Quản lý Session & Phân quyền RBAC',
    description:
      'Cấu hình cookie Session an toàn (HttpOnly, SameSite=Lax), tái tạo Session ID khi đăng nhập và kiểm tra phân quyền User / Admin ở phía máy chủ.',
    language: 'php',
    code: `<?php
/**
 * Quản lý trạng thái đăng nhập và kiểm tra phân quyền User / Admin tại máy chủ
 * Đường dẫn: laptop-store/includes/auth.php
 */

declare(strict_types=1);

// Thiết lập thông số bảo mật cho Session Cookie trước khi gọi session_start()
if (session_status() === PHP_SESSION_NONE) {
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isSecure,
        'httponly' => true, // Chặn JavaScript đọc session cookie (chống XSS đánh cắp phiên)
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * Kiểm tra người dùng đã đăng nhập hay chưa
 */
function isLoggedIn(): bool
{
    return isset($_SESSION['user_id']) && is_int($_SESSION['user_id']);
}

/**
 * Kiểm tra người dùng hiện tại có phải là Admin hay không
 */
function isAdmin(): bool
{
    return isLoggedIn() && ($_SESSION['user_role'] ?? '') === 'admin';
}

/**
 * Bắt buộc người dùng phải đăng nhập mới được truy cập trang
 */
function requireLogin(): void
{
    if (!isLoggedIn()) {
        $_SESSION['flash_error'] = 'Vui lòng đăng nhập để tiếp tục thực hiện chức năng này.';
        header('Location: /laptop-store/login.php');
        exit;
    }
}

/**
 * Bắt buộc quyền Admin trên từng trang quản trị (Chặn truy cập trực tiếp bằng URL)
 */
function requireAdmin(): void
{
    requireLogin();
    if (!isAdmin()) {
        http_response_code(403);
        $_SESSION['flash_error'] = 'Cảnh báo bảo mật: Tài khoản của bạn không có quyền truy cập khu vực Quản trị.';
        header('Location: /laptop-store/index.php');
        exit;
    }
}

/**
 * Lưu thông tin đăng nhập và đổi mới Session ID chống tấn công Session Fixation
 */
function loginUserSession(array $user): void
{
    session_regenerate_id(true);
    $_SESSION['user_id']   = (int)$user['id'];
    $_SESSION['username']  = (string)$user['username'];
    $_SESSION['full_name'] = (string)$user['full_name'];
    $_SESSION['user_role'] = (string)$user['role'];
}
`,
  },
  {
    path: 'includes/functions.php',
    folder: 'includes',
    title: 'includes/functions.php — Các hàm tiện ích, Escape XSS & Upload Ảnh',
    description:
      'Chứa hàm e() chống XSS bằng htmlspecialchars(), formatPrice() định dạng tiền Việt Nam và uploadProductImage() kiểm tra MIME thực tế bằng finfo.',
    language: 'php',
    code: `<?php
/**
 * Các hàm dùng chung toàn hệ thống: Chống XSS, Định dạng tiền tệ, Upload ảnh an toàn
 * Đường dẫn: laptop-store/includes/functions.php
 */

declare(strict_types=1);

/**
 * Escape dữ liệu trước khi hiển thị ra HTML để phòng chống XSS
 */
function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Định dạng giá tiền theo chuẩn Việt Nam (ví dụ: 25.990.000 ₫)
 */
function formatPrice(float|int|string $price): string
{
    return number_format((float)$price, 0, ',', '.') . ' ₫';
}

/**
 * Xử lý tải ảnh sản phẩm lên máy chủ một cách an toàn
 * - Kiểm tra lỗi upload
 * - Giới hạn dung lượng tối đa 2MB
 * - Kiểm tra MIME type thực sự bằng finfo_file()
 * - Kiểm tra kích thước ảnh bằng getimagesize()
 * - Sinh tên tệp ngẫu nhiên để không ghi đè hoặc lộ tên gốc
 */
function uploadProductImage(array $file, string $uploadDir = __DIR__ . '/../uploads/products/'): array
{
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['success' => false, 'error' => 'Dữ liệu tệp tải lên không hợp lệ.'];
    }

    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        return ['success' => false, 'error' => 'Vui lòng chọn hình ảnh sản phẩm.'];
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'Quá trình tải tệp lên bị gián đoạn (Mã lỗi: ' . $file['error'] . ').'];
    }

    // 1. Giới hạn kích thước tối đa 2 MB
    $maxSize = 2 * 1024 * 1024;
    if ($file['size'] > $maxSize || $file['size'] <= 0) {
        return ['success' => false, 'error' => 'Kích thước ảnh không được vượt quá 2 MB.'];
    }

    // 2. Kiểm tra MIME type thực tế từ nội dung binary bằng finfo
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    if (!array_key_exists($mimeType, $allowedMimes)) {
        return ['success' => false, 'error' => 'Chỉ chấp nhận tệp hình ảnh định dạng JPG, PNG hoặc WebP.'];
    }

    // 3. Xác minh cấu trúc điểm ảnh thực tế (chặn tệp mã độc PHP giả mạo header)
    if (@getimagesize($file['tmp_name']) === false) {
        return ['success' => false, 'error' => 'Tệp tải lên không phải là hình ảnh hợp lệ.'];
    }

    // 4. Đảm bảo thư mục lưu trữ tồn tại
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        return ['success' => false, 'error' => 'Không thể khởi tạo thư mục lưu trữ ảnh.'];
    }

    // 5. Tạo tên tệp ngẫu nhiên hoàn toàn
    $extension = $allowedMimes[$mimeType];
    $newFileName = 'laptop_' . bin2hex(random_bytes(12)) . '.' . $extension;
    $destination = rtrim($uploadDir, '/') . '/' . $newFileName;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return ['success' => false, 'error' => 'Không thể lưu tệp ảnh vào máy chủ.'];
    }

    return [
        'success' => true,
        'path'    => 'uploads/products/' . $newFileName,
    ];
}
`,
  },
  {
    path: 'products.php',
    folder: 'root',
    title: 'products.php — Tìm kiếm, Lọc Đa Tiêu Chí, Sắp Xếp & Phân Trang',
    description:
      'Truy vấn danh sách laptop bằng PDO Prepared Statements, kết hợp bộ lọc CPU, RAM, SSD, khoảng giá, còn hàng, whitelist trường sắp xếp ORDER BY và phân trang an toàn.',
    language: 'php',
    code: `<?php
/**
 * Trang danh sách sản phẩm: Tìm kiếm, Lọc kết hợp, Sắp xếp Whitelist & Phân trang
 * Đường dẫn: laptop-store/products.php
 */

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();

// 1. Thu thập và làm sạch tham số lọc từ GET
$keyword  = trim((string)($_GET['q'] ?? ''));
$cpu      = trim((string)($_GET['cpu'] ?? ''));
$ram      = trim((string)($_GET['ram'] ?? ''));
$ssd      = trim((string)($_GET['ssd'] ?? ''));
$minPrice = isset($_GET['min_price']) && is_numeric($_GET['min_price']) ? (float)$_GET['min_price'] : null;
$maxPrice = isset($_GET['max_price']) && is_numeric($_GET['max_price']) ? (float)$_GET['max_price'] : null;
$inStock  = isset($_GET['in_stock']) && $_GET['in_stock'] === '1';
$sort     = (string)($_GET['sort'] ?? 'newest');
$page     = max(1, (int)($_GET['page'] ?? 1));
$perPage  = 6;

// 2. Xây dựng mảng điều kiện WHERE động với tham số bind an toàn
$whereClauses = ['is_active = 1'];
$params = [];

if ($keyword !== '') {
    $whereClauses[] = 'name LIKE :keyword';
    $params[':keyword'] = '%' . $keyword . '%';
}
if ($cpu !== '') {
    $whereClauses[] = 'cpu = :cpu';
    $params[':cpu'] = $cpu;
}
if ($ram !== '') {
    $whereClauses[] = 'ram = :ram';
    $params[':ram'] = $ram;
}
if ($ssd !== '') {
    $whereClauses[] = 'ssd = :ssd';
    $params[':ssd'] = $ssd;
}
if ($minPrice !== null && $minPrice >= 0) {
    $whereClauses[] = 'price >= :min_price';
    $params[':min_price'] = $minPrice;
}
if ($maxPrice !== null && $maxPrice > 0) {
    $whereClauses[] = 'price <= :max_price';
    $params[':max_price'] = $maxPrice;
}
if ($inStock) {
    $whereClauses[] = 'stock > 0';
}

$whereSql = implode(' AND ', $whereClauses);

// 3. Whitelist cho mệnh đề ORDER BY (Tuyệt đối không nối chuỗi trực tiếp từ $_GET['sort'])
$allowedSorts = [
    'newest'     => 'created_at DESC',
    'price_asc'  => 'price ASC',
    'price_desc' => 'price DESC',
    'name_asc'   => 'name ASC',
];
$orderBySql = $allowedSorts[$sort] ?? $allowedSorts['newest'];

// 4. Đếm tổng số bản ghi khớp điều kiện để tính số trang
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE $whereSql");
$countStmt->execute($params);
$totalProducts = (int)$countStmt->fetchColumn();
$totalPages = max(1, (int)ceil($totalProducts / $perPage));
$page = min($page, $totalPages);
$offset = ($page - 1) * $perPage;

// 5. Truy vấn danh sách sản phẩm theo trang
$sql = "SELECT id, name, cpu, ram, ssd, price, image, stock
        FROM products
        WHERE $whereSql
        ORDER BY $orderBySql
        LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$products = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>
<!-- Giao diện hiển thị bộ lọc và lưới sản phẩm Bootstrap 5 -->
<div class="container py-4">
  <h1 class="h3 fw-bold mb-4">Danh Mục Laptop Chính Hãng (<?= $totalProducts ?> sản phẩm)</h1>
  <!-- Phần hiển thị thẻ sản phẩm sử dụng hàm e() chống XSS -->
  <div class="row g-4">
    <?php foreach ($products as $item): ?>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <img src="<?= e($item['image']) ?>" class="card-img-top" alt="<?= e($item['name']) ?>">
          <div class="card-body d-flex flex-column">
            <h2 class="h6 fw-bold"><?= e($item['name']) ?></h2>
            <p class="text-muted small mb-2">
              <?= e($item['cpu']) ?> · <?= e($item['ram']) ?> · <?= e($item['ssd']) ?>
            </p>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
              <span class="fw-bold text-danger fs-5"><?= formatPrice($item['price']) ?></span>
              <a href="product-detail.php?id=<?= (int)$item['id'] ?>" class="btn btn-primary btn-sm">Xem chi tiết</a>
            </div>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'actions/process-checkout.php',
    folder: 'actions',
    title: 'actions/process-checkout.php — Đặt hàng & Thanh toán Giả lập bằng PDO Transaction',
    description:
      'Thực thi quy trình 10 bước đặt hàng chuẩn mực trong một PDO Transaction: khóa dòng tồn kho bằng FOR UPDATE, đọc lại giá thực tế từ MySQL, trừ kho, lưu đơn hàng và rollback nếu có bất kỳ lỗi nào.',
    language: 'php',
    code: `<?php
/**
 * Xử lý đặt hàng và thanh toán giả lập an toàn bằng PDO Transaction
 * Đường dẫn: laptop-store/actions/process-checkout.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';

// 1. Bắt buộc người dùng đã đăng nhập và kiểm tra phương thức POST + CSRF Token
requireLogin();
requireValidPostWithCsrf();

// 2. Kiểm tra giỏ hàng trong Session không rỗng
$cart = $_SESSION['cart'] ?? [];
if (empty($cart) || !is_array($cart)) {
    $_SESSION['flash_error'] = 'Giỏ hàng của bạn đang trống. Không thể tạo đơn hàng.';
    header('Location: /laptop-store/cart.php');
    exit;
}

// 3. Kiểm tra dữ liệu người nhận ở phía máy chủ
$receiverName    = trim((string)($_POST['receiver_name'] ?? ''));
$receiverPhone   = trim((string)($_POST['receiver_phone'] ?? ''));
$shippingAddress = trim((string)($_POST['shipping_address'] ?? ''));
$paymentMethod   = (string)($_POST['payment_method'] ?? 'cod');
$simResult       = (string)($_POST['simulation_outcome'] ?? 'success'); // Phục vụ mô phỏng thanh toán online

if ($receiverName === '' || !preg_match('/^0[0-9]{9,10}$/', $receiverPhone) || strlen($shippingAddress) < 10) {
    $_SESSION['flash_error'] = 'Vui lòng nhập đầy đủ họ tên, số điện thoại hợp lệ (10-11 số) và địa chỉ nhận hàng chi tiết.';
    header('Location: /laptop-store/checkout.php');
    exit;
}

if (!in_array($paymentMethod, ['cod', 'online_sim'], true)) {
    $paymentMethod = 'cod';
}

// Nếu người dùng chọn mô phỏng thanh toán trực tuyến thất bại -> Không trừ kho, báo lỗi rõ ràng
if ($paymentMethod === 'online_sim' && $simResult === 'failed') {
    $_SESSION['flash_error'] = '[MÔ PHỎNG THANH TOÁN] Giao dịch thanh toán trực tuyến giả lập bị từ chối. Đơn hàng chưa được tạo và tồn kho được giữ nguyên.';
    header('Location: /laptop-store/checkout.php');
    exit;
}

$pdo = getDBConnection();

try {
    // BẮT ĐẦU TRANSACTION ĐỂ ĐẢM BẢO TÍNH NGUYÊN TỬ (ATOMICITY)
    $pdo->beginTransaction();

    $calculatedTotal = 0;
    $orderItemsData  = [];

    // Chuẩn bị câu lệnh đọc lại sản phẩm từ MySQL kèm khóa dòng FOR UPDATE chống Race Condition
    $stmtProduct = $pdo->prepare(
        'SELECT id, name, price, stock, is_active
         FROM products
         WHERE id = :id
         FOR UPDATE'
    );

    foreach ($cart as $productId => $quantity) {
        $productId = (int)$productId;
        $quantity  = (int)$quantity;

        if ($quantity <= 0) {
            throw new RuntimeException('Số lượng sản phẩm trong giỏ hàng không hợp lệ.');
        }

        $stmtProduct->execute([':id' => $productId]);
        $product = $stmtProduct->fetch();

        if (!$product || (int)$product['is_active'] !== 1) {
            throw new RuntimeException('Một sản phẩm trong giỏ hàng không tồn tại hoặc đã ngừng kinh doanh.');
        }

        if ((int)$product['stock'] < $quantity) {
            throw new RuntimeException(
                sprintf('Sản phẩm "%s" chỉ còn %d máy trong kho (bạn chọn %d).', $product['name'], $product['stock'], $quantity)
            );
        }

        // Tính lại thành tiền dựa trên giá thực tế từ MySQL (Tuyệt đối không nhận giá từ trình duyệt)
        $unitPrice = (float)$product['price'];
        $subtotal  = $unitPrice * $quantity;
        $calculatedTotal += $subtotal;

        $orderItemsData[] = [
            'product_id'   => (int)$product['id'],
            'product_name' => (string)$product['name'],
            'unit_price'   => $unitPrice,
            'quantity'     => $quantity,
            'subtotal'     => $subtotal,
        ];
    }

    // Xác định trạng thái thanh toán ban đầu
    $paymentStatus = ($paymentMethod === 'online_sim') ? 'paid' : 'unpaid';
    $orderStatus   = ($paymentMethod === 'online_sim') ? 'confirmed' : 'pending';

    // 6. Tạo bản ghi trong bảng orders
    $stmtOrder = $pdo->prepare(
        'INSERT INTO orders (user_id, total_price, status, payment_method, payment_status, receiver_name, receiver_phone, shipping_address)
         VALUES (:user_id, :total_price, :status, :payment_method, :payment_status, :receiver_name, :receiver_phone, :shipping_address)'
    );
    $stmtOrder->execute([
        ':user_id'          => $_SESSION['user_id'],
        ':total_price'      => $calculatedTotal,
        ':status'           => $orderStatus,
        ':payment_method'   => $paymentMethod,
        ':payment_status'   => $paymentStatus,
        ':receiver_name'    => $receiverName,
        ':receiver_phone'   => $receiverPhone,
        ':shipping_address' => $shippingAddress,
    ]);

    $orderId = (int)$pdo->lastInsertId();

    // 7. Tạo các bản ghi trong order_details và 8. Trừ số lượng tồn kho trong products
    $stmtDetail = $pdo->prepare(
        'INSERT INTO order_details (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES (:order_id, :product_id, :product_name, :unit_price, :quantity, :subtotal)'
    );
    $stmtDeductStock = $pdo->prepare(
        'UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty'
    );

    foreach ($orderItemsData as $item) {
        $stmtDetail->execute([
            ':order_id'     => $orderId,
            ':product_id'   => $item['product_id'],
            ':product_name' => $item['product_name'],
            ':unit_price'   => $item['unit_price'],
            ':quantity'     => $item['quantity'],
            ':subtotal'     => $item['subtotal'],
        ]);

        $stmtDeductStock->execute([
            ':qty' => $item['quantity'],
            ':id'  => $item['product_id'],
        ]);
    }

    // 9. Xác nhận hoàn tất Transaction
    $pdo->commit();

    // 10. Xóa giỏ hàng sau khi đặt hàng thành công
    unset($_SESSION['cart']);
    $_SESSION['flash_success'] = 'Đặt hàng thành công! Mã đơn hàng của bạn là #' . $orderId;
    header('Location: /laptop-store/order-success.php?id=' . $orderId);
    exit;

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('[Checkout Error] ' . $e->getMessage());
    $_SESSION['flash_error'] = $e instanceof RuntimeException
        ? $e->getMessage()
        : 'Có lỗi hệ thống xảy ra khi xử lý đơn hàng. Dữ liệu đã được hoàn tác an toàn.';
    header('Location: /laptop-store/cart.php');
    exit;
}
`,
  },
  {
    path: 'actions/process-login.php',
    folder: 'actions',
    title: 'actions/process-login.php — Xác thực Đăng nhập & Chống Session Fixation',
    description:
      'Truy vấn tài khoản bằng Prepared Statement, xác minh mật khẩu băm bằng password_verify() và gọi session_regenerate_id(true).',
    language: 'php',
    code: `<?php
/**
 * Xử lý đăng nhập người dùng bằng password_verify() và tái tạo Session ID
 * Đường dẫn: laptop-store/actions/process-login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireValidPostWithCsrf();

$username = trim((string)($_POST['username'] ?? ''));
$password = (string)($_POST['password'] ?? '');

if ($username === '' || $password === '') {
    $_SESSION['flash_error'] = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.';
    header('Location: /laptop-store/login.php');
    exit;
}

$pdo = getDBConnection();
$stmt = $pdo->prepare('SELECT id, username, password, role, full_name FROM users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

// Sử dụng password_verify để kiểm tra mật khẩu băm Bcrypt an toàn
if (!$user || !password_verify($password, $user['password'])) {
    // Thông báo lỗi chung để tránh lộ thông tin tài khoản nào tồn tại (Account Enumeration)
    $_SESSION['flash_error'] = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
    header('Location: /laptop-store/login.php');
    exit;
}

// Đăng nhập thành công: tái tạo Session ID mới bằng session_regenerate_id(true)
loginUserSession($user);

$_SESSION['flash_success'] = 'Chào mừng ' . $user['full_name'] . ' đã quay trở lại!';
if ($user['role'] === 'admin') {
    header('Location: /laptop-store/admin/index.php');
} else {
    header('Location: /laptop-store/index.php');
}
exit;
`,
  },
  {
    path: 'actions/process-register.php',
    folder: 'actions',
    title: 'actions/process-register.php — Đăng ký Tài khoản & Băm mật khẩu Bcrypt',
    description:
      'Kiểm tra độ mạnh mật khẩu, chống trùng lặp username và cố định vai trò role = user (không cho phép tự đăng ký Admin).',
    language: 'php',
    code: `<?php
/**
 * Xử lý đăng ký tài khoản khách hàng mới
 * Đường dẫn: laptop-store/actions/process-register.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireValidPostWithCsrf();

$username        = trim((string)($_POST['username'] ?? ''));
$fullName        = trim((string)($_POST['full_name'] ?? ''));
$email           = trim((string)($_POST['email'] ?? ''));
$password        = (string)($_POST['password'] ?? '');
$confirmPassword = (string)($_POST['confirm_password'] ?? '');

// 1. Kiểm tra dữ liệu đầu vào
if (!preg_match('/^[a-zA-Z0-9_]{4,30}$/', $username)) {
    $_SESSION['flash_error'] = 'Tên đăng nhập phải từ 4-30 ký tự, chỉ gồm chữ cái, chữ số và dấu gạch dưới.';
    header('Location: /laptop-store/register.php');
    exit;
}

if (mb_strlen($fullName) < 2) {
    $_SESSION['flash_error'] = 'Vui lòng nhập họ và tên hợp lệ.';
    header('Location: /laptop-store/register.php');
    exit;
}

if (strlen($password) < 6 || $password !== $confirmPassword) {
    $_SESSION['flash_error'] = 'Mật khẩu phải có ít nhất 6 ký tự và khớp với mật khẩu xác nhận.';
    header('Location: /laptop-store/register.php');
    exit;
}

$pdo = getDBConnection();

// 2. Kiểm tra tên đăng nhập đã tồn tại hay chưa
$checkStmt = $pdo->prepare('SELECT id FROM users WHERE username = :username LIMIT 1');
$checkStmt->execute([':username' => $username]);
if ($checkStmt->fetch()) {
    $_SESSION['flash_error'] = 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.';
    header('Location: /laptop-store/register.php');
    exit;
}

// 3. Băm mật khẩu an toàn bằng password_hash() và lưu với role cố định là 'user'
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insertStmt = $pdo->prepare(
    "INSERT INTO users (username, password, role, full_name, email)
     VALUES (:username, :password, 'user', :full_name, :email)"
);
$insertStmt->execute([
    ':username'  => $username,
    ':password'  => $passwordHash,
    ':full_name' => $fullName,
    ':email'     => $email !== '' ? $email : null,
]);

$_SESSION['flash_success'] = 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.';
header('Location: /laptop-store/login.php');
exit;
`,
  },
  {
    path: 'admin/product-delete.php',
    folder: 'admin',
    title: 'admin/product-delete.php — Xóa hoặc Ngừng Kinh Doanh Bảo Toàn Lịch Sử Đơn Hàng',
    description:
      'Kiểm tra sản phẩm đã từng xuất hiện trong bảng order_details hay chưa. Nếu đã có đơn hàng lịch sử, hệ thống chuyển sang trạng thái Ngừng kinh doanh (is_active = 0) thay vì xóa vật lý.',
    language: 'php',
    code: `<?php
/**
 * Xử lý xóa hoặc ngừng kinh doanh sản phẩm an toàn với khóa ngoại lịch sử đơn hàng
 * Đường dẫn: laptop-store/admin/product-delete.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

// Kiểm tra quyền Admin và phương thức POST + CSRF Token (Không xóa qua liên kết GET)
requireAdmin();
requireValidPostWithCsrf();

$productId = (int)($_POST['product_id'] ?? 0);
if ($productId <= 0) {
    $_SESSION['flash_error'] = 'Mã sản phẩm không hợp lệ.';
    header('Location: /laptop-store/admin/products.php');
    exit;
}

$pdo = getDBConnection();

// Kiểm tra sản phẩm đã từng phát sinh trong bảng order_details hay chưa
$stmtCheck = $pdo->prepare('SELECT COUNT(*) FROM order_details WHERE product_id = :id');
$stmtCheck->execute([':id' => $productId]);
$orderUsageCount = (int)$stmtCheck->fetchColumn();

if ($orderUsageCount > 0) {
    // Sản phẩm đã có trong lịch sử đơn hàng -> Chuyển sang trạng thái Ngừng kinh doanh (is_active = 0)
    $stmtDeactivate = $pdo->prepare('UPDATE products SET is_active = 0 WHERE id = :id');
    $stmtDeactivate->execute([':id' => $productId]);
    $_SESSION['flash_success'] = 'Sản phẩm đã phát sinh trong ' . $orderUsageCount . ' đơn hàng lịch sử nên được chuyển sang trạng thái "Ngừng kinh doanh" để bảo toàn dữ liệu thống kê.';
} else {
    // Sản phẩm chưa từng có đơn hàng -> Xóa vật lý an toàn
    $stmtDelete = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmtDelete->execute([':id' => $productId]);
    $_SESSION['flash_success'] = 'Đã xóa hoàn toàn sản phẩm khỏi hệ thống.';
}

header('Location: /laptop-store/admin/products.php');
exit;
`,
  },
  {
    path: 'admin/index.php',
    folder: 'admin',
    title: 'admin/index.php — Dashboard Quản Trị & Thống Kê Doanh Thu Chart.js',
    description:
      'Truy vấn tổng hợp SQL cho các chỉ số KPI (Tổng sản phẩm, Người dùng, Đơn hàng, Đơn chờ xử lý, Doanh thu thực tế từ các đơn completed) và kết xuất biểu đồ doanh thu bằng Chart.js.',
    language: 'php',
    code: `<?php
/**
 * Trang Dashboard Quản trị & Thống kê Doanh thu thực tế từ MySQL
 * Đường dẫn: laptop-store/admin/index.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

// Bắt buộc quyền Admin ở phía máy chủ
requireAdmin();

$pdo = getDBConnection();

// 1. Truy vấn các chỉ số tổng quan từ MySQL
$totalProducts = (int)$pdo->query('SELECT COUNT(*) FROM products WHERE is_active = 1')->fetchColumn();
$totalUsers    = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
$totalOrders   = (int)$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$pendingOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();

// Quy tắc nghiệp vụ: Chỉ tính doanh thu từ các đơn hàng đã hoàn tất (status = 'completed')
$totalRevenue  = (float)$pdo->query("SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status = 'completed'")->fetchColumn();

// 2. Truy vấn doanh thu theo tháng để vẽ biểu đồ Chart.js
$stmtMonthly = $pdo->query(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_label,
            SUM(total_price) AS monthly_revenue,
            COUNT(*) AS order_count
     FROM orders
     WHERE status = 'completed'
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month_label ASC
     LIMIT 12"
);
$monthlyData = $stmtMonthly->fetchAll();

$chartLabels = array_column($monthlyData, 'month_label');
$chartValues = array_map('floatval', array_column($monthlyData, 'monthly_revenue'));

require_once __DIR__ . '/../includes/header.php';
?>
<div class="container py-4">
  <h1 class="h3 fw-bold mb-4">Bảng Điều Khiển Quản Trị & Thống Kê Doanh Thu</h1>

  <div class="row g-3 mb-4">
    <div class="col-md-3">
      <div class="card border-0 shadow-sm p-3">
        <div class="text-muted small">Tổng doanh thu (Đơn hoàn tất)</div>
        <div class="fs-4 fw-bold text-primary"><?= formatPrice($totalRevenue) ?></div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-0 shadow-sm p-3">
        <div class="text-muted small">Đơn hàng chờ xử lý</div>
        <div class="fs-4 fw-bold text-warning"><?= $pendingOrders ?> / <?= $totalOrders ?> đơn</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-0 shadow-sm p-3">
        <div class="text-muted small">Sản phẩm đang kinh doanh</div>
        <div class="fs-4 fw-bold"><?= $totalProducts ?> mẫu</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card border-0 shadow-sm p-3">
        <div class="text-muted small">Tổng tài khoản người dùng</div>
        <div class="fs-4 fw-bold"><?= $totalUsers ?> thành viên</div>
      </div>
    </div>
  </div>

  <div class="card border-0 shadow-sm p-4">
    <h2 class="h5 fw-bold mb-3">Biểu Đồ Doanh Thu Theo Tháng (Đơn Hàng Đã Hoàn Tất)</h2>
    <canvas id="revenueChart" height="100"></canvas>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  const labels = <?= json_encode($chartLabels, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  const values = <?= json_encode($chartValues, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;

  new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Doanh thu thực tế (VNĐ)',
        data: values,
        backgroundColor: '#1E3A8A',
        borderRadius: 6
      }]
    }
  });
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
`,
  },
  {
    path: 'README.md',
    folder: 'root',
    title: 'README.md — Hướng dẫn Cài đặt XAMPP 11 Bước & Xử lý Lỗi Thường Gặp',
    description:
      'Tài liệu hướng dẫn từng bước cài đặt trên XAMPP, import database.sql, phân quyền thư mục uploads/products, thiết lập mật khẩu Admin và kịch bản chạy thử.',
    language: 'markdown',
    code: `# TechLaptop — Website Thương Mại Điện Tử Bán Laptop Nâng Cao (Đề Tài 4)

Hệ thống thương mại điện tử bán laptop chính hãng xây dựng bằng **PHP 8.1+ thuần**, **MySQL 8.0+ (PDO)**, **Bootstrap 5** và **Chart.js** phục vụ đồ án môn học ngành Công nghệ thông tin.

---

## Hướng Dẫn Cài Đặt Từng Bước (11 Bước Chuẩn Trên XAMPP)

### Bước 1: Cài đặt và khởi động Apache, MySQL trong XAMPP
1. Tải và cài đặt **XAMPP** (phiên bản hỗ trợ PHP 8.1 hoặc 8.2 trở lên).
2. Mở **XAMPP Control Panel**, nhấn **Start** tại hai dịch vụ **Apache** và **MySQL** cho đến khi cả hai chuyển sang nền màu xanh lá.

### Bước 2: Đưa thư mục dự án vào \`htdocs\`
1. Sao chép toàn bộ thư mục mã nguồn \`laptop-store\` vào đường dẫn:
   - Windows: \`C:\\xampp\\htdocs\\laptop-store\`
   - macOS / Linux: \`/Applications/XAMPP/htdocs/laptop-store\` hoặc \`/opt/lampp/htdocs/laptop-store\`

### Bước 3: Truy cập phpMyAdmin
1. Mở trình duyệt web và truy cập địa chỉ: \`http://localhost/phpmyadmin\`

### Bước 4: Tạo cơ sở dữ liệu và import \`database.sql\`
1. Nhấn vào tab **Import** (Nhập) trên thanh công cụ phpMyAdmin.
2. Chọn tệp \`database.sql\` nằm trong thư mục gốc \`laptop-store/database.sql\`.
3. Nhấn **Go / Thực hiện** ở cuối trang. Hệ thống sẽ tự động tạo CSDL \`laptop_store\` chuẩn \`utf8mb4_unicode_ci\` cùng 4 bảng và 15 mẫu laptop.

### Bước 5: Cấu hình kết nối MySQL trong \`config/database.php\`
1. Mở tệp \`laptop-store/config/database.php\`.
2. Kiểm tra các hằng số kết nối mặc định:
   - \`DB_HOST\`: \`127.0.0.1\`
   - \`DB_PORT\`: \`3306\`
   - \`DB_NAME\`: \`laptop_store\`
   - \`DB_USER\`: \`root\`
   - \`DB_PASS\`: \`''\` (để trống trên XAMPP mặc định, hoặc điền mật khẩu nếu máy bạn đã đặt mật khẩu root).

### Bước 6: Chuẩn bị thư mục upload và ảnh sản phẩm
1. Đảm bảo thư mục \`laptop-store/uploads/products/\` đã tồn tại.
2. Cấp quyền ghi (Write Permission \`0755\` trên Linux/macOS hoặc quyền Modify trên Windows) cho thư mục \`uploads/products/\`.
3. Đặt các tệp ảnh mẫu (\`.jpg\`, \`.png\`, \`.webp\`) vào \`uploads/products/\` hoặc sử dụng chức năng **Sửa sản phẩm -> Upload ảnh** trong trang Admin để tải ảnh từ máy tính lên.

### Bước 7: Thiết lập tài khoản Admin an toàn
- Trong môi trường học tập, \`database.sql\` tạo sẵn tài khoản quản trị với mật khẩu đã được băm bằng \`password_hash()\`.
- Để đổi mật khẩu Admin sang mật khẩu riêng của nhóm bạn, chạy lệnh PHP CLI hoặc tạo script tạm thời gọi:
  \`\`\`php
  echo password_hash('MatKhauMoiCuaBan@2026', PASSWORD_DEFAULT);
  \`\`\`
  Sau đó cập nhật chuỗi băm vào cột \`password\` của bản ghi \`username = 'admin'\` trong bảng \`users\`.

### Bước 8: Truy cập website qua địa chỉ localhost
- Trang chủ khách hàng: \`http://localhost/laptop-store/index.php\`
- Trang quản trị Admin: \`http://localhost/laptop-store/admin/index.php\`

### Bước 9: Đăng nhập bằng tài khoản mẫu (Chỉ dùng cho môi trường học tập)
- **Tài khoản Admin**: Tên đăng nhập \`admin\` | Mật khẩu mẫu: \`Admin@123\`
- **Tài khoản Khách hàng (User)**: Tên đăng nhập \`nguyenvanan\` | Mật khẩu mẫu: \`User@123\`

### Bước 10: Thực hiện thử nghiệm từng chức năng
1. Tìm kiếm theo từ khóa kết hợp lọc CPU, RAM, SSD, khoảng giá và sắp xếp tăng/giảm dần.
2. Thêm laptop vào giỏ hàng, thử nhập số lượng lớn hơn tồn kho để kiểm tra cơ chế chặn tự động.
3. Tiến hành thanh toán giả lập (chọn COD hoặc Thanh toán trực tuyến mô phỏng).
4. Đăng nhập Admin để thêm/sửa sản phẩm, duyệt đơn hàng sang \`completed\` và kiểm tra biểu đồ doanh thu cập nhật.

### Bước 11: Xử lý các lỗi thường gặp khi chạy PHP/MySQL
- **Lỗi \`SQLSTATE[HY000] [1049] Unknown database 'laptop_store'\`**: Bạn chưa import tệp \`database.sql\` trong phpMyAdmin.
- **Lỗi không tải được ảnh lên**: Kiểm tra cấu hình \`extension=fileinfo\` đã được bật (bỏ dấu \`;\`) trong tệp \`php.ini\` của XAMPP để sử dụng lớp \`finfo\`.
- **Lỗi tiếng Việt hiển thị dấu hỏi \`?\`**: Đảm bảo khi import SQL chọn bảng mã \`utf8mb4\`.
`,
  },
];
