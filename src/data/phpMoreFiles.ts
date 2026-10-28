import { PhpSourceFile } from '../types';

export const EXTRA_PHP_SOURCE_FILES: PhpSourceFile[] = [
  {
    path: 'includes/validation.php',
    folder: 'includes',
    title: 'includes/validation.php — Kiểm tra dữ liệu đầu vào tại Máy chủ',
    description:
      'Tập hợp các hàm kiểm tra dữ liệu sản phẩm, đơn hàng, số điện thoại và thông tin đăng ký ở phía máy chủ.',
    language: 'php',
    code: `<?php
/**
 * Các hàm kiểm tra hợp lệ dữ liệu đầu vào (Server-side Validation)
 * Đường dẫn: laptop-store/includes/validation.php
 */

declare(strict_types=1);

/**
 * Kiểm tra dữ liệu biểu mẫu thêm/sửa sản phẩm laptop
 */
function validateProductInput(array $input): array
{
    $errors = [];

    $name  = trim((string)($input['name'] ?? ''));
    $cpu   = trim((string)($input['cpu'] ?? ''));
    $ram   = trim((string)($input['ram'] ?? ''));
    $ssd   = trim((string)($input['ssd'] ?? ''));
    $price = $input['price'] ?? '';
    $stock = $input['stock'] ?? '';
    $desc  = trim((string)($input['description'] ?? ''));

    if (mb_strlen($name) < 5 || mb_strlen($name) > 180) {
        $errors[] = 'Tên laptop phải có độ dài từ 5 đến 180 ký tự.';
    }
    if ($cpu === '') {
        $errors[] = 'Vui lòng nhập thông tin bộ vi xử lý (CPU).';
    }
    if ($ram === '') {
        $errors[] = 'Vui lòng nhập dung lượng RAM.';
    }
    if ($ssd === '') {
        $errors[] = 'Vui lòng nhập dung lượng ổ cứng SSD.';
    }
    if (!is_numeric($price) || (float)$price <= 0) {
        $errors[] = 'Giá bán phải là một số dương hợp lệ.';
    }
    if (!is_numeric($stock) || (int)$stock < 0 || floor((float)$stock) != (float)$stock) {
        $errors[] = 'Số lượng tồn kho phải là số nguyên không âm.';
    }
    if (mb_strlen($desc) < 10) {
        $errors[] = 'Mô tả chi tiết sản phẩm phải có ít nhất 10 ký tự.';
    }

    return $errors;
}

/**
 * Kiểm tra quy tắc chuyển trạng thái đơn hàng hợp lệ
 */
function isValidOrderStatusTransition(string $currentStatus, string $newStatus): bool
{
    $allowedTransitions = [
        'pending'   => ['confirmed', 'cancelled'],
        'confirmed' => ['shipping', 'cancelled'],
        'shipping'  => ['completed', 'cancelled'],
        'completed' => [], // Đơn đã hoàn tất không được chuyển ngược trạng thái
        'cancelled' => [], // Đơn đã hủy không được mở lại
    ];

    if ($currentStatus === $newStatus) {
        return true;
    }

    return in_array($newStatus, $allowedTransitions[$currentStatus] ?? [], true);
}
`,
  },
  {
    path: 'includes/header.php',
    folder: 'includes',
    title: 'includes/header.php — Thanh điều hướng Bootstrap 5 & Thông báo Flash',
    description:
      'Header dùng chung toàn hệ thống hiển thị logo TechLaptop, ô tìm kiếm, số lượng giỏ hàng, trạng thái đăng nhập và thông báo thành công/lỗi.',
    language: 'php',
    code: `<?php
/**
 * Header giao diện dùng chung với Bootstrap 5 & Font Be Vietnam Pro
 * Đường dẫn: laptop-store/includes/header.php
 */

declare(strict_types=1);
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/functions.php';

$cartCount = 0;
if (!empty($_SESSION['cart']) && is_array($_SESSION['cart'])) {
    $cartCount = array_sum($_SESSION['cart']);
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechLaptop — Laptop Chính Hãng</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/laptop-store/assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-light d-flex flex-column min-vh-100">
<nav class="navbar navbar-expand-lg navbar-dark bg-navy shadow-sm sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold" href="/laptop-store/index.php">TechLaptop</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="/laptop-store/index.php">Trang chủ</a></li>
        <li class="nav-item"><a class="nav-link" href="/laptop-store/products.php">Sản phẩm</a></li>
        <?php if (isLoggedIn()): ?>
          <li class="nav-item"><a class="nav-link" href="/laptop-store/my-orders.php">Đơn hàng của tôi</a></li>
        <?php endif; ?>
        <?php if (isAdmin()): ?>
          <li class="nav-item"><a class="nav-link text-warning fw-semibold" href="/laptop-store/admin/index.php">Quản trị Admin</a></li>
        <?php endif; ?>
      </ul>
      <div class="d-flex align-items-center gap-2">
        <a href="/laptop-store/cart.php" class="btn btn-outline-light btn-sm">
          Giỏ hàng (<?= (int)$cartCount ?>)
        </a>
        <?php if (isLoggedIn()): ?>
          <a href="/laptop-store/profile.php" class="btn btn-primary btn-sm"><?= e($_SESSION['full_name'] ?? '') ?></a>
          <a href="/laptop-store/logout.php" class="btn btn-danger btn-sm">Đăng xuất</a>
        <?php else: ?>
          <a href="/laptop-store/login.php" class="btn btn-primary btn-sm">Đăng nhập</a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</nav>

<div class="container mt-3">
  <?php if (!empty($_SESSION['flash_success'])): ?>
    <div class="alert alert-success alert-dismissible fade show">
      <?= e($_SESSION['flash_success']) ?>
      <?php unset($_SESSION['flash_success']); ?>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  <?php endif; ?>
  <?php if (!empty($_SESSION['flash_error'])): ?>
    <div class="alert alert-danger alert-dismissible fade show">
      <?= e($_SESSION['flash_error']) ?>
      <?php unset($_SESSION['flash_error']); ?>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  <?php endif; ?>
</div>
`,
  },
  {
    path: 'actions/cart-add.php',
    folder: 'actions',
    title: 'actions/cart-add.php — Thêm vào Giỏ hàng có Kiểm tra Tồn kho MySQL',
    description:
      'Kiểm tra mã sản phẩm hợp lệ, sản phẩm đang kinh doanh và đối chiếu số lượng yêu cầu với số lượng tồn kho thực tế trong MySQL trước khi lưu vào Session.',
    language: 'php',
    code: `<?php
/**
 * Xử lý thêm sản phẩm vào giỏ hàng Session có kiểm tra tồn kho từ MySQL
 * Đường dẫn: laptop-store/actions/cart-add.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

requireValidPostWithCsrf();

$productId = (int)($_POST['product_id'] ?? 0);
$quantity  = (int)($_POST['quantity'] ?? 1);

if ($productId <= 0 || $quantity <= 0) {
    $_SESSION['flash_error'] = 'Số lượng hoặc mã sản phẩm không hợp lệ.';
    header('Location: /laptop-store/products.php');
    exit;
}

$pdo = getDBConnection();
$stmt = $pdo->prepare('SELECT id, name, stock, is_active FROM products WHERE id = :id LIMIT 1');
$stmt->execute([':id' => $productId]);
$product = $stmt->fetch();

if (!$product || (int)$product['is_active'] !== 1) {
    $_SESSION['flash_error'] = 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.';
    header('Location: /laptop-store/products.php');
    exit;
}

$currentInCart = (int)($_SESSION['cart'][$productId] ?? 0);
$newTotalQty   = $currentInCart + $quantity;

if ($newTotalQty > (int)$product['stock']) {
    $_SESSION['flash_error'] = sprintf(
        'Không thể thêm! Sản phẩm "%s" chỉ còn tối đa %d máy trong kho.',
        $product['name'],
        (int)$product['stock']
    );
    header('Location: /laptop-store/product-detail.php?id=' . $productId);
    exit;
}

$_SESSION['cart'][$productId] = $newTotalQty;
$_SESSION['flash_success'] = 'Đã thêm "' . $product['name'] . '" vào giỏ hàng.';
header('Location: /laptop-store/cart.php');
exit;
`,
  },
  {
    path: 'admin/order-update.php',
    folder: 'admin',
    title: 'admin/order-update.php — Cập nhật Trạng thái Đơn hàng & Hoàn kho khi Hủy',
    description:
      'Kiểm tra trạng thái chuyển tiếp hợp lệ bằng isValidOrderStatusTransition() và tự động hoàn lại số lượng tồn kho trong một PDO Transaction nếu đơn hàng chuyển sang trạng thái Đã hủy (cancelled).',
    language: 'php',
    code: `<?php
/**
 * Cập nhật trạng thái đơn hàng dành cho Admin (Có hoàn kho tự động khi hủy đơn)
 * Đường dẫn: laptop-store/admin/order-update.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/validation.php';

requireAdmin();
requireValidPostWithCsrf();

$orderId   = (int)($_POST['order_id'] ?? 0);
$newStatus = trim((string)($_POST['status'] ?? ''));

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    $stmtOrder = $pdo->prepare('SELECT id, status, payment_status FROM orders WHERE id = :id FOR UPDATE');
    $stmtOrder->execute([':id' => $orderId]);
    $order = $stmtOrder->fetch();

    if (!$order) {
        throw new RuntimeException('Không tìm thấy đơn hàng cần cập nhật.');
    }

    if (!isValidOrderStatusTransition($order['status'], $newStatus)) {
        throw new RuntimeException(
            sprintf('Không thể chuyển trạng thái từ "%s" sang "%s".', $order['status'], $newStatus)
        );
    }

    // Nếu chuyển sang trạng thái 'cancelled' từ trạng thái chưa hủy -> Hoàn lại tồn kho
    if ($newStatus === 'cancelled' && $order['status'] !== 'cancelled') {
        $stmtItems = $pdo->prepare('SELECT product_id, quantity FROM order_details WHERE order_id = :order_id');
        $stmtItems->execute([':order_id' => $orderId]);
        $items = $stmtItems->fetchAll();

        $stmtRestore = $pdo->prepare('UPDATE products SET stock = stock + :qty WHERE id = :id');
        foreach ($items as $item) {
            $stmtRestore->execute([
                ':qty' => (int)$item['quantity'],
                ':id'  => (int)$item['product_id'],
            ]);
        }
    }

    // Nếu đơn hàng hoàn tất (completed) -> Cập nhật trạng thái thanh toán thành 'paid'
    $newPaymentStatus = ($newStatus === 'completed') ? 'paid' : $order['payment_status'];

    $stmtUpdate = $pdo->prepare(
        'UPDATE orders SET status = :status, payment_status = :payment_status WHERE id = :id'
    );
    $stmtUpdate->execute([
        ':status'         => $newStatus,
        ':payment_status' => $newPaymentStatus,
        ':id'             => $orderId,
    ]);

    $pdo->commit();
    $_SESSION['flash_success'] = 'Đã cập nhật trạng thái đơn hàng #' . $orderId . ' thành công.';
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $_SESSION['flash_error'] = $e->getMessage();
}

header('Location: /laptop-store/admin/orders.php');
exit;
`,
  },
];
