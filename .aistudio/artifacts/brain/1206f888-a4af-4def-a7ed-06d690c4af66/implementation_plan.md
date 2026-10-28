# TechLaptop — Hệ Thống Thương Mại Điện Tử Bán Laptop Nâng Cao & Bộ Hồ Sơ Đồ Án PHP/MySQL

Xây dựng hoàn chỉnh hệ thống **TechLaptop — Laptop chính hãng** phục vụ **Đề tài 4 — Website bán laptop nâng cao**, kết hợp đồng thời hai không gian làm việc: (1) **Ứng dụng E-Commerce & Quản trị chạy trực tiếp trên trình duyệt** với cơ sở dữ liệu quan hệ đầy đủ chức năng mua sắm, giỏ hàng, thanh toán giả lập, phân quyền User/Admin, quản lý CRUD sản phẩm và biểu đồ doanh thu thực tế; và (2) **Trung tâm Bàn giao Đồ án (Deliverables Studio)** cung cấp trọn bộ mã nguồn PHP 8.1 thuần + PDO MySQL 8.0, tệp khởi tạo CSDL, báo cáo học thuật 7 chương, 12 slide thuyết trình kèm lời dẫn, bảng kiểm thử bảo mật/chức năng, kịch bản demo 7 phút và bảng phân công nhóm 4 thành viên.

### User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là các quyết định trọng tâm đã được xác nhận để đảm bảo sản phẩm vừa chạy demo mượt mà ngay trên trình duyệt vừa có đầy đủ mã nguồn PHP/MySQL và tài liệu học thuật để nộp đồ án và chạy trên XAMPP:

- **Mô hình Kép (Live Web App + Bộ Xuất Mã Nguồn PHP/MySQL & Báo Cáo)**: Tích hợp trực tiếp cửa hàng **TechLaptop** hoạt động thực tế ngay trên trình duyệt song song với khu vực **Hồ Sơ Đồ Án & Mã Nguồn PHP/MySQL** cho phép xem, sao chép từng tệp hoặc tải xuống trọn bộ mã nguồn PHP thuần (PDO, Session, CSRF, Upload ảnh an toàn), câu lệnh SQL khởi tạo và toàn văn báo cáo đồ án.
- **Danh Mục 15 Sản Phẩm Laptop Khởi Tạo**: Khởi tạo sẵn 15 mẫu laptop chính hãng trải rộng 3 phân khúc: Văn phòng & Sinh viên (Dell Inspiron, HP Pavilion, ASUS VivoBook, Lenovo IdeaPad, Acer Aspire), Ultrabook & Đồ họa mỏng nhẹ (MacBook Air M3, MacBook Pro M3 Pro, Dell XPS 14, LG Gram, ASUS ZenBook OLED) và Gaming & Workstation hiệu năng cao (ASUS ROG Strix, Lenovo Legion Pro, Acer Predator Helios, MSI Katana, HP Omen) với thông số CPU, RAM, SSD, giá bán VND và tồn kho chuẩn xác.
- **Tài Liệu Học Thuật & Phân Công Nhóm 4 Thành Viên**: Thiết kế báo cáo đồ án 7 chương, 12 slide thuyết trình (kèm ghi chú lời nói), bảng kiểm thử 20+ kịch bản (bao gồm SQL Injection, XSS, CSRF, Transaction) và bảng phân chia nhiệm vụ chi tiết cho nhóm 4 sinh viên đúng chuẩn đồ án Công nghệ thông tin.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Cửa hàng trực tuyến TechLaptop (User Role)**: Cho phép khách hàng duyệt danh mục laptop, tìm kiếm theo từ khóa, lọc kết hợp đa tiêu chí (CPU, RAM, SSD, khoảng giá, tình trạng còn hàng), sắp xếp theo giá/tên, có phân trang; xem chi tiết cấu hình và tồn kho; quản lý giỏ hàng (thêm, tăng/giảm số lượng theo giới hạn kho, xóa); thực hiện thanh toán giả lập (COD hoặc Thanh toán trực tuyến mô phỏng thành công/thất bại có kiểm tra lại giá và tồn kho trên máy chủ); quản lý tài khoản và theo dõi lịch sử đơn hàng cá nhân.
  2. **Hệ thống Quản trị (Admin Role)**: Cung cấp Dashboard tổng quan với các chỉ số thời gian thực (tổng sản phẩm, người dùng, đơn hàng, đơn chờ xử lý, tổng doanh thu từ các đơn hàng hoàn tất), biểu đồ doanh thu trực quan theo ngày/tháng/năm; quản lý sản phẩm CRUD đầy đủ kèm tải ảnh lên và cơ chế ngừng kinh doanh bảo toàn lịch sử đơn hàng; quản lý và cập nhật trạng thái đơn hàng/thanh toán theo luồng nghiệp vụ hợp lệ; quản lý danh sách người dùng.
  3. **Trung tâm Bàn giao Đồ án (PHP/MySQL Codebase & Academic Hub)**: Cung cấp trình duyệt mã nguồn đầy đủ của toàn bộ dự án PHP 8.1 + MySQL 8.0 (sử dụng PDO Prepared Statements, `password_hash`/`password_verify`, `session_regenerate_id`, CSRF token, kiểm tra MIME ảnh bằng `finfo`, giao dịch `beginTransaction`/`commit`/`rollBack`), kèm báo cáo 7 chương (có sơ đồ Mermaid Use Case, Activity, ERD), 12 slide thuyết trình, bảng kiểm thử, hướng dẫn cài đặt XAMPP và kịch bản bảo vệ đồ án.
- **Target Audience / Persona**: Sinh viên ngành Công nghệ thông tin thực hiện đồ án môn học Lập trình Web / Thương mại điện tử cần một hệ thống vừa chạy demo trực tiếp ấn tượng trước hội đồng, vừa có mã nguồn PHP/MySQL mạch lạc, có chú thích tiếng Việt rõ ràng để giải thích từng dòng lệnh khi vấn đáp.
- **Key Value**: Đáp ứng 100% tiêu chí chấm điểm nghiệm thu (Giao diện 2đ, Chức năng cơ bản 3đ, Chức năng nâng cao 2đ, CSDL 1đ, Báo cáo & Slide 1đ, Demo & Thuyết trình 1đ) trong một nền tảng thống nhất, không dùng dữ liệu tĩnh giả lập trong giao diện.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  - **Luồng Mua Hàng & Thanh Toán Giả Lập**: Khách truy cập Trang chủ $\rightarrow$ Lọc laptop theo CPU/RAM/SSD/Giá tại trang Sản phẩm $\rightarrow$ Xem Chi tiết laptop & kiểm tra tồn kho $\rightarrow$ Thêm vào Giỏ hàng $\rightarrow$ Đăng nhập/Đăng ký tài khoản $\rightarrow$ Nhập thông tin người nhận tại trang Thanh toán & chọn COD hoặc Thanh toán trực tuyến mô phỏng (cho phép chọn kịch bản giao dịch Thành công hoặc Thất bại để trình diễn cơ chế Transaction Rollback/Trừ kho) $\rightarrow$ Xem xác nhận đơn hàng & tra cứu trong Lịch sử đơn hàng.
  - **Luồng Quản Trị Admin**: Đăng nhập bằng tài khoản Admin $\rightarrow$ Mở Admin Dashboard xem KPI và biểu đồ doanh thu $\rightarrow$ Thêm mới hoặc chỉnh sửa thông số/hình ảnh laptop (hoặc chuyển trạng thái Ngừng kinh doanh nếu sản phẩm đã từng phát sinh đơn hàng) $\rightarrow$ Duyệt đơn hàng mới từ `pending` $\rightarrow$ `confirmed` $\rightarrow$ `shipping` $\rightarrow$ `completed` và quan sát doanh thu cập nhật tức thời.
  - **Luồng Nghiên Cứu Mã Nguồn PHP & Tài Liệu Đồ Án**: Mở chuyên mục **Hồ Sơ Đồ Án & Code PHP** $\rightarrow$ Duyệt từng nhóm mã nguồn (Cấu hình & Bảo mật, Giao diện & Xử lý khách hàng, Khu vực Admin, kịch bản SQL) có tô sáng cú pháp và nút sao chép/tải tệp $\rightarrow$ Xem Báo cáo 7 chương, Slide thuyết trình 12 trang, Bảng kiểm thử và Kịch bản Demo 7 phút.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Phong cách cửa hàng công nghệ chính hãng hiện đại, chuẩn xác và đáng tin cậy. Không gian hiển thị sáng sủa, tỷ lệ ảnh sản phẩm $4:3$ đồng nhất trên nền trung tính sạch sẽ, bảng thông số kỹ thuật rõ ràng.
  - *Color Palette & Mood (Quy tắc 60-30-10)*:
    - **60% Nền trung tính chủ đạo**: Trắng tinh khiết (`#FFFFFF`) và xám lạnh sáng (`#F8FAFC` / `slate-50`) tạo độ thoáng cho danh mục laptop.
    - **30% Bề mặt cấu trúc & Thương hiệu**: Xanh Navy đậm chủ đạo (`#0F172A` / `slate-900` và `#1E3A8A` / `blue-900`) cho thanh điều hướng, khu vực Hero và bảng quản trị; viền mảnh `1px solid #E2E8F0` (`slate-200`).
    - **10% Điểm nhấn hành động & Giá bán**: Xanh dương sáng (`#2563EB` / `blue-600`) cho các nút hành động chính (CTA), trạng thái lọc đang chọn; Đỏ san hô đậm (`#DC2626` / `red-600`) dùng riêng cho hiển thị giá bán/khuyến mãi (`25.990.000 ₫`); Xanh lá (`#16A34A`) và Vàng hổ phách (`#D97706`) đi kèm nhãn văn bản tường minh cho trạng thái kho và đơn hàng.
  - *Typography & Hierarchy (Quy tắc 2+1 Font)*:
    - **Display & Body Font**: Sử dụng `Be Vietnam Pro` hiển thị tiếng Việt có dấu chuẩn xác, hiện đại (Tiêu đề lớn `clamp(2rem, 3.5vw, 3rem)` SemiBold/Bold với `text-wrap: balance`; Tên sản phẩm `16px` SemiBold; Nội dung mô tả `15px–16px` Regular).
    - **Monospace & Tabular Numerals**: Sử dụng `JetBrains Mono` cùng thuộc tính `tabular-nums` cho toàn bộ giá tiền (`25.990.000 ₫`), mã đơn hàng, số lượng tồn kho, thông số kỹ thuật và bảng thống kê doanh thu để các con số thẳng cột tuyệt đối.
  - *Component Styling & Layout*:
    - **Top Bar Contract (3 vùng chuẩn mực)**: Vùng 1 là thương hiệu `TechLaptop` trên một dòng duy nhất; Vùng 2 gồm các liên kết điều hướng ngắn gọn (`Trang chủ`, `Sản phẩm`, `Đơn hàng`, `Quản trị Admin`, `Đồ án & Code PHP`); Vùng 3 là nút Giỏ hàng/Tài khoản gọn gàng. Thanh tìm kiếm và bộ lọc cấu hình được bố trí ngay dưới Hero/Toolbar danh mục để tối ưu không gian.
    - **Zero-Pill Metadata Discipline**: Thông số kỹ thuật trên thẻ sản phẩm (`Intel Core i7 · 16GB RAM · 512GB SSD`) được trình bày dưới dạng văn bản tinh gọn ngăn cách bằng dấu chấm giữa (`·`), không lạm dụng các hộp viên thuốc màu mè gây rối mắt.
    - **Single-Elevation Depth**: Mỗi thẻ sản phẩm sử dụng đúng 1 lớp viền mảnh `border-slate-200` trên nền trắng, ảnh laptop chiếm $68\%$ chiều cao thẻ trên nền `#F1F5F9` đồng nhất, kèm hiệu ứng nhấc nhẹ `-2px` (`translateY`) trong `150ms` khi di chuột.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Kiến trúc Song hành — Trải nghiệm Live Full-Stack kết hợp Bộ Mã Nguồn PHP 8.1 / MySQL 8.0 Chuẩn XAMPP**
  - *Chosen Approach*: Vận hành một máy chủ API và CSDL thực tế ngay trong môi trường chạy trực tiếp để mọi thao tác (đăng ký, đăng nhập băm mật khẩu, lọc đa điều kiện, giỏ hàng, thanh toán Transaction, CRUD ảnh sản phẩm, thống kê biểu đồ doanh thu) đều hoạt động thật 100%; đồng thời tích hợp mô-đun xuất toàn bộ mã nguồn PHP 8.1 thuần (PDO, Bootstrap 5, Chart.js) và `database.sql` có thể tải về chạy ngay trên XAMPP/phpMyAdmin.
  - *Why*: Giúp sinh viên vừa có thể demo trực tiếp ngay lập tức trên trình duyệt mà không lo sự cố môi trường, vừa có bộ code PHP/MySQL hoàn chỉnh, có chú thích tiếng Việt chi tiết để nộp bài và chạy trên máy cá nhân.
  - *Alternatives Considered*: Chỉ hiển thị văn bản code PHP tĩnh (không thể trải nghiệm đặt hàng hay xem biểu đồ trực quan) hoặc chỉ làm giao diện mô phỏng không có code PHP/MySQL (không đáp ứng yêu cầu nộp source code PHP thuần của đề tài).

- **Decision 2: Bảo toàn lịch sử đơn hàng và tính toàn vẹn giá bán (Order Immutability & Soft Deactivation)**
  - *Chosen Approach*: Khi tạo đơn hàng, hệ thống lưu bản chụp tên sản phẩm (`product_name`) và đơn giá tại thời điểm mua (`unit_price`) vào bảng chi tiết đơn hàng trong một giao dịch (Transaction) nguyên tử đồng thời trừ tồn kho. Khi Admin xóa một sản phẩm đã từng xuất hiện trong đơn hàng lịch sử, hệ thống tự động chuyển sản phẩm sang trạng thái **Ngừng kinh doanh (`is_active = 0`)** thay vì xóa vật lý (`DELETE`), còn sản phẩm mới chưa có đơn hàng có thể xóa hoàn toàn.
  - *Why*: Ngăn chặn lỗi khóa ngoại (Foreign Key Violation) và đảm bảo báo cáo doanh thu lịch sử không bao giờ bị sai lệch khi giá laptop thay đổi hoặc ngừng bán.

- **Decision 3: Quy tắc Ghi nhận Doanh thu Minh bạch**
  - *Chosen Approach*: Tổng doanh thu và biểu đồ doanh thu trên Admin Dashboard chỉ tổng hợp từ các đơn hàng có trạng thái `completed` (Đã hoàn tất). Các đơn hàng `pending`, `confirmed`, `shipping` hoặc `cancelled` / thanh toán thất bại được thống kê riêng theo bộ đếm trạng thái.
  - *Why*: Tuân thủ đúng chuẩn mực nghiệp vụ kế toán thương mại điện tử và yêu cầu trong đề bài, tránh tính ảo doanh thu từ đơn hàng hủy hoặc chưa giao thành công.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│                        TECHLAPTOP APPLICATION & DELIVERABLES                       │
├─────────────────────────────────────────┬──────────────────────────────────────────┤
│      STOREFRONT & USER WORKSPACE        │       ADMIN & ACADEMIC STUDIO            │
│                                         │                                          │
│  ┌───────────────────────────────────┐  │  ┌────────────────────────────────────┐  │
│  │ Storefront Catalog & Filter Engine│  │  │ Admin Dashboard & Revenue Analytics│  │
│  │ • Keyword + CPU/RAM/SSD/Price/Stock│  │  │ • Real SQL KPI Aggregations        │  │
│  │ • Sort (Price Asc/Desc, Name)     │  │  │ • Daily / Monthly / Yearly Chart   │  │
│  │ • Server-backed Pagination        │  │  └─────────────────┬──────────────────┘  │
│  └─────────────────┬─────────────────┘  │                    │                     │
│                    ▼                    │                    ▼                     │
│  ┌───────────────────────────────────┐  │  ┌────────────────────────────────────┐  │
│  │ Product Detail & Session Cart     │  │  │ Product CRUD & Order Management    │  │
│  │ • Live Stock Validation           │  │  │ • Image Upload + MIME Validation   │  │
│  │ • Quantity Stepper & Line Totals  │  │  │ • Soft-Deactivate if Ordered       │  │
│  └─────────────────┬─────────────────┘  │  │ • Order Status State Machine       │  │
│                    ▼                    │  └─────────────────┬──────────────────┘  │
│  ┌───────────────────────────────────┐  │                    │                     │
│  │ Simulated Checkout & User Orders  │  │  ┌─────────────────┴──────────────────┐  │
│  │ • COD & Simulated Online Payment  │  │  │ Academic Deliverables Hub          │  │
│  │ • Success/Failure Simulation Flow │  │  │ • Full PHP 8.1 + PDO Source Viewer │  │
│  │ • Personal Order History & Detail │  │  │ • 7-Chapter Report & Mermaid Charts│  │
│  └─────────────────┬─────────────────┘  │  │ • 12 Slides + Test Matrix + Script │  │
└────────────────────┼────────────────────┴────────────────────┼─────────────────────┘
                     │                                         │
                     ▼                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                 BACKEND CONTROLLER LAYER & SECURITY MIDDLEWARE                     │
│  • Auth & RBAC Guard (Session Validation, Password Hash/Verify, Role Check)        │
│  • CSRF Token Verification & Input Sanitization / Whitelist Sorting                │
│  • Atomic Order Transaction (Re-fetch DB Prices -> Check Stock -> Deduct -> Save)  │
└─────────────────────────────────────────┬──────────────────────────────────────────┘
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                    RELATIONAL DATABASE SCHEMA (laptop_store)                       │
│  [users] 1 ──── * [orders] 1 ──── * [order_details] * ──── 1 [products]            │
└────────────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State (`laptop_store` Relational Schema)**:
  - **`users`**: `id` (PK), `username` (UNIQUE), `password` (Bcrypt hash), `role` (`admin` | `user`), `full_name`, `email`, `phone`, `address`, `created_at`.
  - **`products`**: `id` (PK), `name`, `brand`, `cpu`, `ram`, `ssd`, `price` (DECIMAL/BIGINT VND), `image`, `description`, `stock` (INT), `is_active` (TINYINT 1/0), `created_at`, `updated_at`.
  - **`orders`**: `id` (PK), `user_id` (FK $\rightarrow$ `users.id`), `total_price`, `status` (`pending` | `confirmed` | `shipping` | `completed` | `cancelled`), `payment_method` (`cod` | `online_sim`), `payment_status` (`unpaid` | `paid` | `failed`), `receiver_name`, `receiver_phone`, `shipping_address`, `created_at`, `updated_at`.
  - **`order_details`**: `id` (PK), `order_id` (FK $\rightarrow$ `orders.id` ON DELETE CASCADE), `product_id` (FK $\rightarrow$ `products.id` ON DELETE RESTRICT), `product_name` (snapshot), `unit_price` (snapshot), `quantity`, `subtotal`.

- **Interactive Component & State Mapping**:
  - **Tìm kiếm, Lọc & Phân trang Danh mục**: Thay đổi từ khóa, CPU (`Intel Core i5`, `Intel Core i7`, `AMD Ryzen 7`, `Apple M3`, ...), RAM (`8GB`, `16GB`, `32GB`), SSD (`256GB`, `512GB`, `1TB`), khoảng giá, chỉ hiện hàng còn trong kho và thứ tự sắp xếp sẽ kích hoạt truy vấn tham số hóa, trả về danh sách phân trang cùng tổng số kết quả khớp.
  - **Giỏ hàng & Kiểm tra Tồn kho Thực tế**: Mọi thao tác thêm vào giỏ hoặc cập nhật số lượng đều đối chiếu trực tiếp với `stock` hiện tại trong CSDL; chặn số lượng $\le 0$ hoặc vượt quá tồn kho và tự động tính lại thành tiền trên máy chủ.
  - **Thanh toán Giả lập & Giao dịch Nguyên tử (Transaction)**: Khi người dùng gửi biểu mẫu đặt hàng, máy chủ kiểm tra quyền đăng nhập, xác thực CSRF token, đọc lại giá bán và tồn kho thực tế từ bảng `products` (tuyệt đối không nhận tổng tiền từ trình duyệt). Nếu chọn **Thanh toán trực tuyến giả lập**, người dùng có thể chọn mô phỏng **Giao dịch Thành công** (tạo đơn + ghi `payment_status = 'paid'` + trừ kho + xóa giỏ) hoặc **Giao dịch Thất bại** (hiển thị thông báo lỗi thanh toán mô phỏng, giữ nguyên giỏ hàng hoặc ghi nhận trạng thái thất bại mà không làm sai lệch tồn kho).
  - **Quản trị Sản phẩm, Đơn hàng & Biểu đồ Doanh thu**: Admin thêm/sửa sản phẩm có kiểm tra định dạng tệp ảnh (JPEG/PNG/WebP $\le 2\text{MB}$), cập nhật trạng thái đơn hàng theo quy tắc hợp lệ (khi hủy đơn hàng chưa hoàn tất sẽ hoàn lại số lượng tồn kho tương ứng) và chuyển đổi chế độ xem biểu đồ doanh thu theo Ngày, Tháng, Năm.
  - **Trình xuất Mã nguồn PHP & Hồ sơ Đồ án**: Cho phép chuyển đổi giữa các tab: *Mã nguồn PHP/MySQL đầy đủ*, *Báo cáo đồ án 7 chương (có sơ đồ Mermaid)*, *Slide thuyết trình 12 trang kèm lời dẫn*, *Bảng kiểm thử 20+ Test Cases*, *Kịch bản Demo & Phân công nhóm 4 người*, kèm chức năng sao chép nhanh hoặc tải xuống từng tệp `.php`, `.sql`, `.md`.
