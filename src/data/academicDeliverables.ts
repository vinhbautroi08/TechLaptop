import {
  ReportChapter,
  PresentationSlide,
  TestCaseItem,
  TeamMemberRole,
  DemoScriptStep,
} from '../types';

export const ACADEMIC_REPORT_CHAPTERS: ReportChapter[] = [
  {
    id: 'chuong-1',
    chapterNumber: 1,
    title: 'Chương 1. Giới Thiệu Đề Tài',
    summary:
      'Trình bày bối cảnh thực tiễn, lý do chọn đề tài "Website bán laptop nâng cao", mục tiêu, phạm vi, đối tượng sử dụng, công nghệ áp dụng và phương pháp nghiên cứu.',
    sections: [
      {
        heading: '1.1. Lý do chọn đề tài',
        content: `Trong bối cảnh chuyển đổi số mạnh mẽ hiện nay, nhu cầu trang bị máy tính xách tay (laptop) phục vụ học tập, lập trình, thiết kế đồ họa và làm việc từ xa ngày càng gia tăng. Khác với các mặt hàng tiêu dùng thông thường, laptop là sản phẩm công nghệ có giá trị cao và thông số kỹ thuật đa dạng (vi xử lý CPU, bộ nhớ RAM, ổ cứng SSD, card đồ họa, màn hình). Người mua có nhu cầu tìm kiếm, lọc và so sánh cấu hình chi tiết trước khi ra quyết định đặt hàng.

Về phía cửa hàng kinh doanh máy tính, việc quản lý danh mục sản phẩm, kiểm soát số lượng tồn kho theo thời gian thực, xử lý đơn hàng chính xác và thống kê doanh thu đòi hỏi một hệ thống phần mềm chặt chẽ, bảo mật. Vì vậy, nhóm quyết định lựa chọn thực hiện **"Đề tài 4 — Website bán laptop nâng cao" (TechLaptop)** nhằm vận dụng toàn diện kiến thức lập trình Web Full-stack bằng PHP thuần và hệ quản trị cơ sở dữ liệu quan hệ MySQL.`,
      },
      {
        heading: '1.2. Mục tiêu xây dựng website',
        content: `- Xây dựng một hệ thống thương mại điện tử bán laptop hoạt động thực tế từ giao diện khách hàng đến trang quản trị viên (Admin).
- Thiết kế cơ sở dữ liệu quan hệ chuẩn hóa trên MySQL 8.0, đảm bảo tính toàn vẹn tham chiếu và lưu trữ lịch sử giá bán trong từng đơn hàng.
- Áp dụng nghiêm ngặt các tiêu chuẩn bảo mật ứng dụng web: chống SQL Injection bằng PDO Prepared Statements, chống XSS bằng cơ chế thoát chuỗi đầu ra, chống CSRF bằng Token phiên, băm mật khẩu bằng Bcrypt và kiểm tra tệp ảnh tải lên bằng MIME type thực tế.
- Cung cấp công cụ thống kê và trực quan hóa doanh thu bằng biểu đồ Chart.js dựa trên dữ liệu truy vấn trực tiếp từ MySQL.`,
      },
      {
        heading: '1.3. Phạm vi đề tài và Đối tượng sử dụng',
        content: `- **Phạm vi chức năng**: Quản lý danh mục laptop, tìm kiếm & lọc kết hợp đa tiêu chí (CPU, RAM, SSD, khoảng giá, tình trạng kho), giỏ hàng Session, thanh toán giả lập (COD & Thanh toán trực tuyến mô phỏng trong PDO Transaction), quản lý tài khoản, phân quyền RBAC (User/Admin), CRUD sản phẩm kèm upload ảnh và thống kê doanh thu.
- **Đối tượng sử dụng**:
  1. *Khách vãng lai & Khách hàng (User)*: Tra cứu cấu hình laptop, lọc theo ngân sách, đăng ký tài khoản, đặt mua sản phẩm và theo dõi trạng thái đơn hàng.
  2. *Quản trị viên cửa hàng (Admin)*: Quản lý kho hàng, cập nhật thông số & hình ảnh laptop, duyệt đơn hàng và theo dõi báo cáo doanh thu định kỳ.`,
      },
      {
        heading: '1.4. Công nghệ sử dụng và Phương pháp thực hiện',
        content: `- **Backend**: Ngôn ngữ PHP 8.1+ thuần (kiến trúc tách biệt rõ ràng giữa cấu hình \`config/\`, thư viện dùng chung \`includes/\`, xử lý nghiệp vụ \`actions/\` và phân hệ quản trị \`admin/\`).
- **Cơ sở dữ liệu**: MySQL 8.0+ kết nối qua thư viện PDO (PHP Data Objects) với chế độ tắt giả lập Prepared Statements.
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript ES6, phông chữ Be Vietnam Pro và thư viện biểu đồ Chart.js.
- **Phương pháp thực hiện**: Phát triển lặp tăng trưởng qua 8 giai đoạn (Phân tích yêu cầu -> Thiết kế CSDL -> Xây dựng lõi bảo mật -> Phân hệ khách hàng -> Giỏ hàng & Checkout Transaction -> Phân hệ Admin & Biểu đồ -> Kiểm thử bảo mật -> Hoàn thiện hồ sơ báo cáo).`,
      },
    ],
  },
  {
    id: 'chuong-2',
    chapterNumber: 2,
    title: 'Chương 2. Phân Tích Yêu Cầu Hệ Thống',
    summary:
      'Đặc tả chi tiết yêu cầu chức năng, phi chức năng, phân quyền người dùng và mô hình hóa bằng sơ đồ Use Case, Activity Diagram.',
    sections: [
      {
        heading: '2.1. Yêu cầu chức năng và Phân quyền vai trò (Admin & User)',
        content: `Hệ thống phân tách rành mạch hai nhóm quyền hạn được kiểm tra trực tiếp ở phía máy chủ (Server-side RBAC):
- **Vai trò Khách hàng (User)**: Xem danh sách và chi tiết cấu hình laptop; tìm kiếm theo tên và lọc theo CPU, RAM, SSD, khoảng giá, tình trạng còn hàng; thêm/sửa/xóa sản phẩm trong giỏ hàng; thực hiện đặt hàng với thanh toán giả lập (COD hoặc Online); xem hồ sơ cá nhân và lịch sử đơn hàng của chính mình.
- **Vai trò Quản trị viên (Admin)**: Toàn quyền quản lý sản phẩm (Thêm, Sửa, Xóa/Ngừng kinh doanh, Upload ảnh kiểm tra MIME); quản lý đơn hàng (Xem chi tiết, chuyển trạng thái theo luồng hợp lệ, hoàn kho tự động khi hủy đơn); xem danh sách người dùng và bảng điều khiển thống kê doanh thu theo thời gian.`,
      },
      {
        heading: '2.2. Sơ đồ Use Case tổng quát và Quy trình nghiệp vụ (Mermaid)',
        content: `Dưới đây là sơ đồ Use Case tổng quát và Sơ đồ hoạt động (Activity Diagram) của quy trình Đặt hàng & Thanh toán giả lập sử dụng PDO Transaction:`,
        diagramTitle: 'Sơ đồ Use Case tổng quát & Activity Diagram Quy trình Đặt hàng (Cú pháp Mermaid)',
        mermaidCode: `flowchart LR
    subgraph HeThongTechLaptop ["Hệ Thống Thương Mại Điện Tử TechLaptop"]
      UC1("Tìm kiếm & Lọc Laptop (CPU, RAM, SSD, Giá)")
      UC2("Quản lý Giỏ hàng (Session)")
      UC3("Đăng ký / Đăng nhập (Bcrypt + Session)")
      UC4("Đặt hàng & Thanh toán giả lập (PDO Transaction)")
      UC5("Xem lịch sử & Chi tiết đơn hàng cá nhân")
      UC6("Quản lý CRUD Laptop & Upload ảnh (finfo)")
      UC7("Duyệt trạng thái đơn hàng & Hoàn kho")
      UC8("Xem Dashboard & Biểu đồ Doanh thu (Chart.js)")
    end

    User["Khách hàng (User)"] --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5

    Admin["Quản trị viên (Admin)"] --> UC3
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8`,
      },
      {
        heading: '2.3. Yêu cầu phi chức năng',
        content: `1. **Bảo mật**: Chống SQL Injection 100% thông qua PDO Prepared Statements và Whitelist cột sắp xếp; chống XSS bằng \`htmlspecialchars()\`; chống CSRF bằng Token ngẫu nhiên 256-bit cho mọi biểu mẫu POST; không lưu mật khẩu dạng văn bản thuần.
2. **Tính toàn vẹn giao dịch**: Quá trình tạo đơn hàng, ghi chi tiết sản phẩm và trừ tồn kho phải nằm trong một giao dịch nguyên tử (\`PDO::beginTransaction\`). Nếu bất kỳ sản phẩm nào không đủ tồn kho, toàn bộ giao dịch phải \`rollBack()\`.
3. **Hiệu năng & Trải nghiệm**: Truy vấn danh mục có phân trang và đánh chỉ mục (Index) trên các cột lọc; giao diện đáp ứng (Responsive) trên máy tính, máy tính bảng và điện thoại.`,
      },
    ],
  },
  {
    id: 'chuong-3',
    chapterNumber: 3,
    title: 'Chương 3. Thiết Kế Hệ Thống Và Cơ Sở Dữ Liệu',
    summary:
      'Trình bày kiến trúc tổng quan, sơ đồ quan hệ thực thể (ERD), cấu trúc chi tiết 4 bảng trong CSDL laptop_store và các ràng buộc toàn vẹn.',
    sections: [
      {
        heading: '3.1. Kiến trúc tổng quan và Luồng trao đổi PHP — MySQL',
        content: `Ứng dụng tuân theo kiến trúc phân tầng rõ ràng:
1. **Tầng Giao diện (Presentation Layer)**: Các trang giao diện sử dụng HTML5, Bootstrap 5 và Chart.js nhận dữ liệu đã được làm sạch từ tầng xử lý và hiển thị an toàn qua hàm \`e()\`.
2. **Tầng Nghiệp vụ & Bảo mật (Application & Security Layer)**: Các tệp trong \`includes/\` và \`actions/\` đảm nhận kiểm tra phiên đăng nhập (\`auth.php\`), kiểm tra CSRF (\`csrf.php\`), xác thực đầu vào (\`validation.php\`) và điều phối giao dịch.
3. **Tầng Dữ liệu (Data Access Layer)**: Tệp \`config/database.php\` khởi tạo kết nối PDO duy nhất giao tiếp với MySQL 8.0 thông qua các câu lệnh chuẩn bị trước (Prepared Statements).`,
      },
      {
        heading: '3.2. Sơ đồ Quan hệ giữa các bảng (ERD)',
        content: `Cơ sở dữ liệu \`laptop_store\` bao gồm 4 bảng chính liên kết chặt chẽ thông qua khóa ngoại (Foreign Keys):
- Mối quan hệ \`users\` (1) — (N) \`orders\`: Một khách hàng có thể đặt nhiều đơn hàng.
- Mối quan hệ \`orders\` (1) — (N) \`order_details\`: Một đơn hàng chứa một hoặc nhiều dòng sản phẩm chi tiết (\`ON DELETE CASCADE\`).
- Mối quan hệ \`products\` (1) — (N) \`order_details\`: Một mẫu laptop có thể xuất hiện trong nhiều chi tiết đơn hàng (\`ON DELETE RESTRICT\` nhằm ngăn chặn xóa nhầm sản phẩm đã có lịch sử bán hàng).`,
        diagramTitle: 'Sơ đồ Quan hệ Thực thể ERD (Cú pháp Mermaid)',
        mermaidCode: `erDiagram
    USERS ||--o{ ORDERS : "đặt hàng (user_id)"
    ORDERS ||--|{ ORDER_DETAILS : "bao gồm (order_id)"
    PRODUCTS ||--o{ ORDER_DETAILS : "tham chiếu (product_id)"

    USERS {
        int id PK
        varchar username UK
        varchar password
        enum role "admin | user"
        varchar full_name
        varchar email
        datetime created_at
    }
    PRODUCTS {
        int id PK
        varchar name
        varchar cpu
        varchar ram
        varchar ssd
        decimal price
        varchar image
        text description
        int stock
        tinyint is_active
        datetime created_at
        datetime updated_at
    }
    ORDERS {
        int id PK
        int user_id FK
        decimal total_price
        enum status
        enum payment_method
        enum payment_status
        varchar receiver_name
        varchar receiver_phone
        varchar shipping_address
        datetime created_at
        datetime updated_at
    }
    ORDER_DETAILS {
        int id PK
        int order_id FK
        int product_id FK
        varchar product_name "Bản chụp tên lúc mua"
        decimal unit_price "Bản chụp giá lúc mua"
        int quantity
        decimal subtotal
    }`,
      },
      {
        heading: '3.3. Ràng buộc dữ liệu và Bảo toàn lịch sử giá bán',
        content: `Điểm thiết kế quan trọng trong bảng \`order_details\` là việc lưu trữ độc lập hai trường \`product_name\` và \`unit_price\` tại thời điểm tạo đơn hàng. Khi quản trị viên thay đổi giá bán của laptop trong bảng \`products\` ở tương lai, hoặc đánh dấu sản phẩm \`is_active = 0\` (Ngừng kinh doanh), tổng giá trị và đơn giá của các đơn hàng trong quá khứ hoàn toàn không bị biến đổi, đảm bảo tính chính xác tuyệt đối cho báo cáo tài chính.`,
      },
    ],
  },
  {
    id: 'chuong-4',
    chapterNumber: 4,
    title: 'Chương 4. Thiết Kế Giao Diện',
    summary:
      'Mô tả hệ thống thiết kế giao diện (Design System), bảng màu Navy/Blue chuyên nghiệp và bố cục 11 màn hình chức năng của TechLaptop.',
    sections: [
      {
        heading: '4.1. Định hướng thẩm mỹ và Bảng màu thương hiệu TechLaptop',
        content: `- **Bảng màu chuẩn 60-30-10**:
  - *60% Nền trung tính*: Trắng (\`#FFFFFF\`) và Xám nhạt (\`#F8FAFC\`) giúp làm nổi bật hình ảnh sản phẩm và thông số kỹ thuật.
  - *30% Bề mặt cấu trúc*: Xanh Navy đậm (\`#0F172A\` / \`#1E3A8A\`) cho thanh điều hướng, banner công nghệ và khu vực quản trị.
  - *10% Màu nhấn hành động & Giá bán*: Xanh dương sáng (\`#2563EB\`) cho các nút CTA chính và Đỏ (\`#DC2626\`) cho mức giá bán niêm yết định dạng tiền Việt Nam (\`31.990.000 ₫\`).
- **Kiểu chữ (Typography)**: Kết hợp phông chữ **Be Vietnam Pro** hiển thị tiếng Việt sắc nét và **JetBrains Mono (tabular-nums)** cho các con số thống kê, giá bán, tồn kho.`,
      },
      {
        heading: '4.2. Chi tiết các màn hình giao diện người dùng và quản trị',
        content: `1. **Trang chủ & Danh sách sản phẩm**: Hiển thị Banner giới thiệu sản phẩm chủ lực, bộ lọc kết hợp (Từ khóa, CPU, RAM, SSD, Khoảng giá, Tình trạng kho), thanh sắp xếp và lưới sản phẩm đồng nhất tỷ lệ ảnh 4:3.
2. **Trang chi tiết laptop**: Trình bày ảnh lớn bên trái, khối thông tin mua hàng cố định bên phải gồm cấu hình chi tiết, số lượng tồn kho thực tế và bộ chọn số lượng mua không vượt quá tồn kho.
3. **Trang Giỏ hàng & Thanh toán giả lập**: Cho phép tăng/giảm số lượng, tự động tính thành tiền từng dòng và chọn giữa Thanh toán khi nhận hàng (COD) hoặc Thanh toán trực tuyến giả lập (có nút chọn kịch bản giao dịch Thành công hoặc Thất bại để kiểm thử).
4. **Trang Dashboard Admin**: Hiển thị 4 thẻ chỉ số KPI thời gian thực, biểu đồ doanh thu trực quan hóa bằng Chart.js và bảng quản lý sản phẩm, đơn hàng, người dùng.`,
      },
    ],
  },
  {
    id: 'chuong-5',
    chapterNumber: 5,
    title: 'Chương 5. Cài Đặt Và Triển Khai',
    summary:
      'Giải thích chi tiết cấu trúc thư mục, cơ chế kết nối PDO, bảo mật Session/CSRF, quy trình Transaction tạo đơn hàng và công thức tính doanh thu.',
    sections: [
      {
        heading: '5.1. Giải thích cơ chế Prepared Statements và Bảo mật CSRF / Upload Ảnh',
        content: `- **Chống SQL Injection**: Trong \`config/database.php\`, tùy chọn \`PDO::ATTR_EMULATE_PREPARES => false\` buộc MySQL Server tách biệt hoàn toàn cấu trúc câu lệnh SQL và dữ liệu tham số. Với mệnh đề \`ORDER BY\` không thể bind tham số, hệ thống dùng mảng danh sách trắng (\`$allowedSorts\`) để ánh xạ an toàn.
- **Bảo mật Upload Ảnh**: Hàm \`uploadProductImage()\` trong \`includes/functions.php\` sử dụng đối tượng \`new finfo(FILEINFO_MIME_TYPE)\` kết hợp \`getimagesize()\` để đọc chữ ký nhị phân thực sự của tệp, chặn hoàn toàn kịch bản đổi tên tệp \`shell.php\` thành \`shell.jpg\`.`,
        codeSnippetTitle: 'Đoạn mã cốt lõi: Kiểm tra MIME ảnh thực tế và sinh tên ngẫu nhiên',
        codeSnippet: `$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
$allowedMimes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

if (!array_key_exists($mimeType, $allowedMimes) || @getimagesize($file['tmp_name']) === false) {
    return ['success' => false, 'error' => 'Tệp tải lên không phải là hình ảnh hợp lệ.'];
}
$newFileName = 'laptop_' . bin2hex(random_bytes(12)) . '.' . $allowedMimes[$mimeType];`,
      },
      {
        heading: '5.2. Giải thích quy trình Tạo đơn hàng bằng PDO Transaction & Tính doanh thu',
        content: `Khi khách hàng nhấn xác nhận đặt hàng tại \`actions/process-checkout.php\`:
1. Hệ thống gọi \`$pdo->beginTransaction()\` để mở giao dịch.
2. Với từng mã sản phẩm trong \`$_SESSION['cart']\`, hệ thống thực thi câu lệnh \`SELECT id, name, price, stock FROM products WHERE id = :id FOR UPDATE\`. Mệnh đề \`FOR UPDATE\` khóa dòng sản phẩm đó lại cho đến khi giao dịch kết thúc, ngăn chặn hiện tượng hai khách hàng cùng mua chiếc máy cuối cùng tại cùng một mili-giây.
3. Máy chủ tự nhân lại \`unit_price * quantity\` để tính \`total_price\`, chèn vào \`orders\` và \`order_details\`, đồng thời trừ \`stock\`. Nếu mọi bước thành công mới gọi \`$pdo->commit()\`.
4. **Quy tắc tính doanh thu**: Trên trang \`admin/index.php\`, câu lệnh \`SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE status = 'completed'\` đảm bảo chỉ những đơn hàng đã giao và hoàn tất mới được ghi nhận vào doanh thu thực tế.`,
      },
    ],
  },
  {
    id: 'chuong-6',
    chapterNumber: 6,
    title: 'Chương 6. Kết Quả Và Kiểm Thử',
    summary:
      'Tổng hợp kết quả chạy thực tế, kịch bản kiểm thử hộp đen & kiểm thử bảo mật (SQLi, XSS, CSRF, Upload, Transaction) và đánh giá các lỗi đã khắc phục.',
    sections: [
      {
        heading: '6.1. Kết quả chạy thực tế và Các lỗi đã khắc phục trong quá trình phát triển',
        content: `Trong quá trình phát triển và tích hợp, nhóm đã phát hiện và khắc phục triệt để 4 vấn đề kỹ thuật quan trọng:
1. **Lỗi mất lịch sử đơn hàng khi xóa sản phẩm**: Ban đầu khi dùng \`DELETE FROM products\`, các sản phẩm đã có trong \`order_details\` gây lỗi khóa ngoại. Nhóm đã khắc phục bằng cách kiểm tra số bản ghi tham chiếu trong \`order_details\`; nếu lớn hơn 0 thì cập nhật \`is_active = 0\` (Ngừng kinh doanh) thay vì xóa vật lý.
2. **Lỗi sai lệch tồn kho khi hủy đơn hàng**: Bổ sung cơ chế hoàn lại số lượng tồn kho (\`stock = stock + quantity\`) bên trong một PDO Transaction khi Admin chuyển trạng thái đơn hàng từ \`pending\`/\`confirmed\`/\`shipping\` sang \`cancelled\`.
3. **Lỗi SQL Injection tại bộ lọc sắp xếp**: Thay thế việc nối chuỗi trực tiếp vào \`ORDER BY\` bằng mảng ánh xạ Whitelist cố định.
4. **Lỗi người dùng sửa giá tiền qua Inspect Element**: Loại bỏ hoàn toàn trường ẩn \`total_price\` trên form HTML; máy chủ luôn truy vấn lại đơn giá gốc từ bảng \`products\` khi tạo đơn.`,
      },
      {
        heading: '6.2. Những hạn chế còn tồn tại',
        content: `- Hệ thống hiện tại sử dụng cơ chế thanh toán trực tuyến mô phỏng phục vụ mục đích học tập, chưa tích hợp cổng thanh toán ngân hàng thật (như VNPay, MoMo qua Webhook IPN).
- Chức năng thông báo trạng thái đơn hàng hiện hiển thị trực tiếp trên website, chưa tích hợp gửi email tự động qua giao thức SMTP.`,
      },
    ],
  },
  {
    id: 'chuong-7',
    chapterNumber: 7,
    title: 'Chương 7. Kết Luận Và Hướng Phát Triển',
    summary:
      'Đánh giá mức độ hoàn thành đồ án, ưu điểm của hệ thống TechLaptop, định hướng nâng cấp trong tương lai và danh mục tài liệu tham khảo.',
    sections: [
      {
        heading: '7.1. Tổng kết kết quả thực hiện và Mức độ hoàn thành',
        content: `Đồ án **"Website thương mại điện tử bán laptop nâng cao — TechLaptop"** đã hoàn thành 100% các yêu cầu đề ra trong đề cương:
- Giao diện người dùng và trang quản trị hiện đại, đồng nhất, hiển thị tốt trên cả máy tính và thiết bị di động.
- Cơ sở dữ liệu MySQL thiết kế chuẩn hóa, có đầy đủ khóa chính, khóa ngoại, chỉ mục và dữ liệu mẫu phong phú.
- Toàn bộ chức năng cốt lõi (tìm kiếm, lọc đa tiêu chí, giỏ hàng, thanh toán giả lập bằng PDO Transaction, phân quyền RBAC, CRUD sản phẩm kèm upload ảnh an toàn, thống kê biểu đồ doanh thu) đều vận hành ổn định trên dữ liệu thực.`,
      },
      {
        heading: '7.2. Hướng phát triển tiếp theo & Tài liệu tham khảo',
        content: `- **Hướng phát triển**:
  1. Tích hợp cổng thanh toán điện tử Sandbox (VNPay / MoMo) và dịch vụ gửi email xác nhận đơn hàng tự động (PHPMailer).
  2. Bổ sung tính năng so sánh chi tiết 2–3 mẫu laptop cạnh nhau và hệ thống đánh giá, bình luận có xác thực đã mua hàng.
  3. Triển khai bộ nhớ đệm (Redis/Memcached) cho các truy vấn thống kê doanh thu lớn.
- **Tài liệu tham khảo**:
  1. PHP Documentation Group (2026), *PHP Manual: PDO (PHP Data Objects) & Password Hashing*, https://www.php.net/manual/en/book.pdo.php.
  2. OWASP Foundation (2025), *OWASP Top 10 Web Application Security Risks & Cheat Sheet Series (SQL Injection, XSS, CSRF, File Upload)*.
  3. Oracle Corporation (2026), *MySQL 8.0 Reference Manual: InnoDB Transaction Model and Locking*.`,
      },
    ],
  },
];

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    slideNumber: 1,
    title: 'ĐỀ TÀI 4: WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN LAPTOP NÂNG CAO',
    subtitle: 'Thương hiệu: TechLaptop — Hệ thống mua sắm & quản trị laptop chính hãng',
    bullets: [
      'Môn học: Đồ án Lập trình Web / Thương mại điện tử — Ngành Công nghệ thông tin',
      'Nhóm thực hiện: Nhóm 4 sinh viên (Phân tích CSDL, Giao diện, Nghiệp vụ Mua hàng, Quản trị & Bảo mật)',
      'Công nghệ cốt lõi: PHP 8.1+ thuần, MySQL 8.0 (PDO), Bootstrap 5, Chart.js',
    ],
    visualSuggestion: 'Hình chụp màn hình Trang chủ TechLaptop nổi bật với banner laptop và thanh điều hướng màu xanh Navy.',
    speakerNotes:
      'Kính chào thầy/cô và các bạn. Hôm nay nhóm chúng em xin trình bày đồ án môn học Đề tài 4: Xây dựng Website thương mại điện tử bán laptop nâng cao với thương hiệu TechLaptop, sử dụng PHP 8.1 thuần và hệ quản trị cơ sở dữ liệu MySQL 8.0.',
  },
  {
    slideNumber: 2,
    title: 'LÝ DO CHỌN ĐỀ TÀI & BỐI CẢNH THỰC TIỄN',
    subtitle: 'Giải quyết bài toán tra cứu cấu hình chuyên sâu và quản lý tồn kho chính xác',
    bullets: [
      'Laptop là mặt hàng giá trị cao, người mua cần lọc chính xác theo CPU, RAM, SSD và ngân sách',
      'Cửa hàng cần kiểm soát tồn kho thời gian thực, tránh bán vượt số lượng máy hiện có',
      'Yêu cầu bảo toàn lịch sử giá bán trong đơn hàng ngay cả khi sản phẩm thay đổi giá hoặc ngừng bán',
      'Cần hệ thống báo cáo doanh thu tự động, minh bạch từ dữ liệu giao dịch thực tế',
    ],
    visualSuggestion: 'Sơ đồ so sánh giữa quy trình quản lý thủ công và hệ thống thương mại điện tử TechLaptop tự động hóa.',
    speakerNotes:
      'Khác với các sản phẩm thông thường, khách hàng mua laptop rất quan tâm đến thông số CPU, RAM, SSD. Đồng thời, bài toán đặt ra cho cửa hàng là làm sao quản lý tồn kho chính xác khi có nhiều người đặt mua và giữ nguyên lịch sử giá bán trong các đơn hàng cũ.',
  },
  {
    slideNumber: 3,
    title: 'MỤC TIÊU VÀ PHẠM VI CỦA HỆ THỐNG',
    subtitle: 'Xây dựng ứng dụng hoàn chỉnh từ trải nghiệm khách hàng đến quản trị viên',
    bullets: [
      'Hoàn thiện đầy đủ luồng mua sắm: Tìm kiếm -> Lọc cấu hình -> Giỏ hàng -> Thanh toán giả lập -> Đơn hàng',
      'Xây dựng phân hệ Admin: Quản lý CRUD laptop, upload ảnh an toàn, duyệt đơn hàng và thống kê doanh thu',
      'Đảm bảo 4 trụ cột bảo mật bắt buộc: Chống SQL Injection, XSS, CSRF và bảo vệ Session/RBAC',
      'Vận hành mượt mà trên môi trường máy cá nhân (XAMPP) phục vụ kiểm thử và thuyết trình',
    ],
    visualSuggestion: 'Biểu đồ 4 trụ cột của dự án: Giao diện chuẩn mực — Nghiệp vụ hoàn chỉnh — CSDL toàn vẹn — Bảo mật đa lớp.',
    speakerNotes:
      'Mục tiêu của nhóm không chỉ là tạo giao diện minh họa mà là xây dựng một hệ thống hoàn chỉnh có thể truy vấn MySQL thực tế, đặt hàng có giao dịch Transaction và đáp ứng đầy đủ các tiêu chuẩn bảo mật web.',
  },
  {
    slideNumber: 4,
    title: 'PHÂN TÍCH CHỨC NĂNG & PHÂN QUYỀN HỆ THỐNG',
    subtitle: 'Phân tách rõ ràng quyền hạn giữa Khách hàng (User) và Quản trị viên (Admin)',
    bullets: [
      'Khách hàng (User): Xem & lọc laptop, quản lý giỏ hàng, thanh toán COD/Online mô phỏng, xem lịch sử đơn cá nhân',
      'Quản trị viên (Admin): Quản lý sản phẩm, upload ảnh, cập nhật trạng thái đơn hàng, xem người dùng & doanh thu',
      'Kiểm tra quyền truy cập tại phía máy chủ (requireAdmin) trên từng trang và từng file xử lý POST',
      'Ngăn chặn triệt để việc sửa ID trên URL để xem đơn hàng của người khác hoặc tự đăng ký quyền Admin',
    ],
    visualSuggestion: 'Sơ đồ Use Case tổng quát thể hiện 2 tác nhân User và Admin cùng các ca sử dụng tương ứng.',
    speakerNotes:
      'Hệ thống áp dụng cơ chế kiểm soát truy cập dựa trên vai trò ở phía máy chủ. Người dùng thông thường không thể gõ trực tiếp đường dẫn /admin để truy cập trái phép hoặc sửa mã đơn hàng trên thanh địa chỉ.',
  },
  {
    slideNumber: 5,
    title: 'CÔNG NGHỆ SỬ DỤNG & KIẾN TRÚC THƯ MỤC',
    subtitle: 'Tổ chức mã nguồn khoa học, tách biệt cấu hình, giao diện dùng chung và xử lý nghiệp vụ',
    bullets: [
      'Backend: PHP 8.1+ thuần kết hợp PDO (PHP Data Objects) tắt chế độ giả lập Prepared Statements',
      'Database: MySQL 8.0+ sử dụng InnoDB Engine hỗ trợ khóa ngoại (Foreign Keys) và Transaction',
      'Frontend: HTML5, CSS3, Bootstrap 5, phông chữ Be Vietnam Pro và thư viện biểu đồ Chart.js',
      'Cấu trúc thư mục: config/, includes/, actions/, admin/, assets/, uploads/products/',
    ],
    visualSuggestion: 'Sơ đồ cấu trúc thư mục dự án laptop-store và luồng xử lý Request -> Action -> PDO -> MySQL -> View.',
    speakerNotes:
      'Nhóm tổ chức mã nguồn thành các phân khu rõ ràng: thư mục config chứa kết nối PDO, includes chứa các hàm kiểm tra đăng nhập và CSRF dùng chung, actions xử lý các biểu mẫu POST và admin chứa toàn bộ trang quản trị.',
  },
  {
    slideNumber: 6,
    title: 'THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (LAPTOP_STORE)',
    subtitle: 'Đảm bảo toàn vẹn dữ liệu và bảo toàn lịch sử giá bán theo thời gian',
    bullets: [
      '4 bảng cốt lõi: users (tài khoản), products (15+ mẫu laptop), orders (đơn hàng), order_details (chi tiết đơn)',
      'Bảng order_details lưu bản chụp product_name và unit_price ngay tại thời điểm khách đặt mua',
      'Khóa ngoại fk_details_product dùng ON DELETE RESTRICT chống xóa nhầm sản phẩm đã từng bán',
      'Cơ chế Soft-Deactivate (is_active = 0): Chuyển sang "Ngừng kinh doanh" nếu sản phẩm đã có trong đơn hàng lịch sử',
    ],
    visualSuggestion: 'Sơ đồ ERD 4 bảng hiển thị rõ các khóa chính (PK), khóa ngoại (FK) và mối quan hệ 1-N.',
    speakerNotes:
      'Điểm nhấn trong thiết kế CSDL của nhóm là bảng order_details lưu lại tên và đơn giá tại thời điểm mua. Ngoài ra, nếu Admin xóa một mẫu laptop đã từng có khách mua, hệ thống sẽ chuyển sang trạng thái Ngừng kinh doanh thay vì xóa vật lý để không làm hỏng báo cáo doanh thu cũ.',
  },
  {
    slideNumber: 7,
    title: 'GIAO DIỆN NGƯỜI DÙNG & TÌM KIẾM, LỌC ĐA TIÊU CHÍ',
    subtitle: 'Trải nghiệm tra cứu cấu hình trực quan, nhanh chóng và chính xác',
    bullets: [
      'Kết hợp đồng thời: Tìm kiếm từ khóa + Lọc CPU + Lọc RAM + Lọc SSD + Khoảng giá + Tình trạng còn hàng',
      'Sắp xếp linh hoạt theo giá tăng dần, giá giảm dần, tên A-Z hoặc sản phẩm mới cập nhật',
      'Sử dụng Whitelist cho mệnh đề ORDER BY và phân trang LIMIT/OFFSET bảo vệ hiệu năng MySQL',
      'Hiển thị rõ ràng số lượng tồn kho và khóa nút mua khi sản phẩm tạm hết hàng (stock = 0)',
    ],
    visualSuggestion: 'Ảnh chụp màn hình trang Danh sách sản phẩm với thanh bộ lọc cấu hình và trang Chi tiết laptop.',
    speakerNotes:
      'Trên giao diện khách hàng, người mua có thể kết hợp nhiều bộ lọc cùng lúc, chẳng hạn tìm laptop Core i7, RAM 16GB trong tầm giá 25 đến 35 triệu đồng. Mọi bộ lọc đều truy vấn trực tiếp từ MySQL có phân trang.',
  },
  {
    slideNumber: 8,
    title: 'QUY TRÌNH ĐẶT HÀNG & THANH TOÁN GIẢ LẬP (PDO TRANSACTION)',
    subtitle: 'Đảm bảo tính nguyên tử (Atomicity): Không bao giờ trừ kho sai hoặc nhận giá giả mạo',
    bullets: [
      'Kiểm tra đăng nhập và CSRF Token trước khi tiếp nhận yêu cầu đặt hàng',
      'Mở PDO Transaction và khóa dòng sản phẩm bằng SELECT ... FOR UPDATE để kiểm tra tồn kho thực tế',
      'Tính lại 100% tổng tiền ở phía máy chủ từ giá trong MySQL, bác bỏ mọi giá tiền gửi từ trình duyệt',
      'Hỗ trợ chọn COD hoặc Thanh toán trực tuyến giả lập (mô phỏng cả luồng Thành công và Thất bại)',
    ],
    visualSuggestion: 'Sơ đồ tuần tự 10 bước xử lý đặt hàng trong process-checkout.php với hai nhánh Commit và Rollback.',
    speakerNotes:
      'Đây là phần nghiệp vụ quan trọng nhất: khi khách đặt hàng, hệ thống mở một PDO Transaction, đọc lại giá bán và tồn kho từ MySQL, ghi vào bảng orders, order_details rồi trừ kho. Nếu có bất kỳ lỗi nào hoặc mô phỏng thanh toán thất bại, toàn bộ giao dịch được Rollback an toàn.',
  },
  {
    slideNumber: 9,
    title: 'CHỨC NĂNG QUẢN TRỊ ADMIN & THỐNG KÊ DOANH THU',
    subtitle: 'Quản lý vòng đời đơn hàng và trực quan hóa dữ liệu kinh doanh bằng Chart.js',
    bullets: [
      'Dashboard tổng hợp trực tiếp bằng SQL: Tổng doanh thu, Đơn chờ xử lý, Sản phẩm đang bán, Tổng người dùng',
      'Quy tắc tính doanh thu chuẩn: Chỉ cộng các đơn hàng có trạng thái Đã hoàn tất (status = completed)',
      'Biểu đồ doanh thu trực quan hóa theo Ngày, Tháng, Năm giúp theo dõi xu hướng bán hàng',
      'Quản lý đơn hàng theo quy tắc trạng thái hợp lệ; tự động hoàn lại tồn kho khi hủy đơn hàng',
    ],
    visualSuggestion: 'Ảnh chụp màn hình Admin Dashboard với 4 thẻ KPI, biểu đồ cột doanh thu và bảng quản lý đơn hàng.',
    speakerNotes:
      'Tại phân hệ Admin, toàn bộ số liệu trên Dashboard đều được tổng hợp bằng câu lệnh SQL SUM và COUNT thực tế. Đặc biệt, doanh thu chỉ ghi nhận từ các đơn hàng đã hoàn tất, không tính đơn đang chờ hoặc đã hủy.',
  },
  {
    slideNumber: 10,
    title: 'CÁC LỚP BẢO MẬT ĐÃ TRIỂN KHAI TRONG HỆ THỐNG',
    subtitle: 'Tuân thủ nghiêm ngặt các nguyên tắc phòng vệ ứng dụng Web theo chuẩn OWASP',
    bullets: [
      'Chống SQL Injection: 100% truy vấn dùng PDO Prepared Statements (ATTR_EMULATE_PREPARES = false)',
      'Chống XSS: Escape toàn bộ dữ liệu đầu ra bằng hàm htmlspecialchars(..., ENT_QUOTES, UTF-8)',
      'Chống CSRF: Kiểm tra mã CSRF token bằng hash_equals() cho mọi thao tác POST (Thêm, Sửa, Xóa, Đặt hàng)',
      'Bảo mật Upload & Mật khẩu: Kiểm tra MIME thực tế bằng finfo + getimagesize(); băm mật khẩu bằng password_hash()',
    ],
    visualSuggestion: 'Bảng đối chiếu 4 nguy cơ bảo mật phổ biến và cơ chế phòng vệ tương ứng trong mã nguồn TechLaptop.',
    speakerNotes:
      'Về mặt bảo mật, nhóm đã cài đặt đầy đủ các chốt chặn ở phía máy chủ: từ việc tắt emulate prepares trong PDO, nhúng CSRF token vào mọi biểu mẫu, cho đến việc kiểm tra chữ ký nhị phân của file ảnh bằng thư viện finfo.',
  },
  {
    slideNumber: 11,
    title: 'KẾT QUẢ KIỂM THỬ & DEMO HỆ THỐNG',
    subtitle: 'Kiểm증 22 kịch bản chức năng, dữ liệu biên và tấn công bảo mật',
    bullets: [
      'Đã thực hiện kiểm thử toàn diện: Đăng nhập, Phân quyền, Lọc sản phẩm, Giỏ hàng, Đặt hàng, CRUD Admin',
      'Kiểm thử bảo mật thành công: Chặn chuỗi SQLi (\' OR \'1\'=\'1), thẻ XSS (<script>), tệp .php giả danh ảnh',
      'Kiểm thử dữ liệu biên: Chặn đặt số lượng âm, số lượng vượt tồn kho hoặc truy cập sản phẩm ID không tồn tại',
      'Sẵn sàng trình diễn trực tiếp (Live Demo) luồng mua hàng của User và luồng duyệt đơn của Admin',
    ],
    visualSuggestion: 'Bảng tổng hợp kết quả 22 ca kiểm thử (100% PASS) và khung trình diễn trực tiếp ứng dụng.',
    speakerNotes:
      'Nhóm đã xây dựng bảng kiểm thử gồm 22 kịch bản bao phủ cả chức năng bình thường lẫn các tình huống nhập dữ liệu sai hoặc tấn công thử nghiệm. Tất cả đều vượt qua đúng như kỳ vọng.',
  },
  {
    slideNumber: 12,
    title: 'KẾT LUẬN, HƯỚNG PHÁT TRIỂN & CẢM ƠN',
    subtitle: 'Tổng kết đồ án và định hướng mở rộng trong tương lai',
    bullets: [
      'Hoàn thành 100% mục tiêu đề tài với mã nguồn PHP/MySQL rõ ràng, dễ bảo trì và có chú thích tiếng Việt',
      'Hướng phát triển 1: Tích hợp cổng thanh toán trực tuyến thực tế (VNPay / MoMo Sandbox) và gửi email SMTP',
      'Hướng phát triển 2: Bổ sung công cụ so sánh cấu hình 3 laptop song song và đánh giá từ người mua thực',
      'Xin chân thành cảm ơn thầy/cô đã lắng nghe! Nhóm xin phép bắt đầu phần Demo trực tiếp và nhận câu hỏi.',
    ],
    visualSuggestion: 'Tổng kết kiến trúc TechLaptop và thông tin liên hệ của 4 thành viên trong nhóm.',
    speakerNotes:
      'Trên đây là toàn bộ nội dung trình bày của nhóm về Đề tài 4 — Website bán laptop nâng cao. Ngay sau đây, nhóm xin phép chuyển sang phần chạy demo trực tiếp các luồng chức năng trên hệ thống. Rất mong nhận được ý kiến đóng góp của thầy/cô.',
  },
];

export const TEST_CASES_MATRIX: TestCaseItem[] = [
  {
    id: 'TC-01',
    module: 'Đăng ký & Đăng nhập',
    scenario: 'Đăng ký tài khoản mới với thông tin hợp lệ',
    inputData: 'username: sinhvien2026, pass: Abc@1234, confirm: Abc@1234',
    steps: '1. Mở trang Đăng ký -> 2. Nhập thông tin -> 3. Nhấn Hoàn tất đăng ký',
    expectedResult: 'Tạo tài khoản mới với role="user", mật khẩu được băm bằng password_hash() ($2y$10$...)',
    actualResult: 'Tạo bản ghi thành công trong bảng users, mật khẩu lưu dạng chuỗi băm Bcrypt 60 ký tự',
    status: 'PASS',
  },
  {
    id: 'TC-02',
    module: 'Đăng ký & Đăng nhập',
    scenario: 'Đăng ký trùng tên đăng nhập đã tồn tại',
    inputData: 'username: nguyenvanan (đã có trong CSDL)',
    steps: '1. Mở trang Đăng ký -> 2. Nhập username "nguyenvanan" -> 3. Gửi biểu mẫu',
    expectedResult: 'Hệ thống từ chối tạo mới và hiển thị thông báo tên đăng nhập đã được sử dụng',
    actualResult: 'Hiển thị thông báo lỗi rõ ràng, không phát sinh lỗi SQL Duplicate Entry ra giao diện',
    status: 'PASS',
  },
  {
    id: 'TC-03',
    module: 'Bảo mật Xác thực',
    scenario: 'Thử nghiệm SQL Injection tại biểu mẫu Đăng nhập',
    inputData: "username: admin' OR '1'='1' -- , password: bất kỳ",
    steps: '1. Mở trang Đăng nhập -> 2. Nhập chuỗi payload SQLi vào ô Tên đăng nhập -> 3. Nhấn Đăng nhập',
    expectedResult: 'PDO Prepared Statement coi toàn bộ chuỗi là văn bản thuần, không tìm thấy user và chặn đăng nhập',
    actualResult: 'Đăng nhập thất bại an toàn, thông báo "Tên đăng nhập hoặc mật khẩu không chính xác"',
    status: 'SECURITY_VERIFIED',
  },
  {
    id: 'TC-04',
    module: 'Phân quyền RBAC',
    scenario: 'Tài khoản User thông thường truy cập trực tiếp URL trang Admin',
    inputData: 'Session role = "user", truy cập /admin/index.php hoặc /admin/products.php',
    steps: '1. Đăng nhập tài khoản nguyenvanan -> 2. Nhập đường dẫn trang Quản trị Admin',
    expectedResult: 'Hàm requireAdmin() chặn truy cập tại máy chủ (HTTP 403) và chuyển hướng kèm cảnh báo bảo mật',
    actualResult: 'Chặn truy cập thành công, hiển thị thông báo không đủ thẩm quyền quản trị',
    status: 'SECURITY_VERIFIED',
  },
  {
    id: 'TC-05',
    module: 'Tìm kiếm & Lọc',
    scenario: 'Kết hợp tìm kiếm từ khóa + lọc CPU + RAM + Khoảng giá + Sắp xếp',
    inputData: 'Từ khóa: "ASUS", CPU: "Intel Core i7", RAM: "16GB", Giá: 25-35 triệu, Sắp xếp: Giá tăng dần',
    steps: '1. Chọn đồng thời các bộ lọc trên thanh công cụ -> 2. Xem danh sách kết quả trả về',
    expectedResult: 'Chỉ hiển thị các mẫu laptop ASUS Core i7 16GB trong tầm giá 25-35 triệu theo thứ tự giá tăng dần',
    actualResult: 'Hiển thị chính xác ASUS ROG Strix G16 (33.490.000 ₫), phân trang hoạt động đúng',
    status: 'PASS',
  },
  {
    id: 'TC-06',
    module: 'Chi tiết sản phẩm',
    scenario: 'Truy cập sản phẩm bằng ID không hợp lệ hoặc sản phẩm đã hết hàng',
    inputData: 'id = -99, id = "abc", hoặc id = 15 (HP Omen 16 có stock = 0)',
    steps: '1. Mở chi tiết sản phẩm có stock = 0 hoặc truyền ID sai',
    expectedResult: 'Không phát sinh lỗi PHP; với sản phẩm hết hàng thì hiển thị nhãn "Tạm hết hàng" và khóa nút thêm giỏ',
    actualResult: 'Xử lý ngoại lệ an toàn; nút mua của HP Omen 16 bị vô hiệu hóa kèm thông báo hết hàng',
    status: 'PASS',
  },
  {
    id: 'TC-07',
    module: 'Giỏ hàng & Tồn kho',
    scenario: 'Thêm hoặc tăng số lượng sản phẩm vượt quá số lượng tồn kho thực tế',
    inputData: 'Dell XPS 14 9440 (stock = 6), khách thử tăng số lượng lên 7 máy',
    steps: '1. Thêm Dell XPS 14 vào giỏ -> 2. Nhấn nút (+) tăng số lượng vượt mức 6',
    expectedResult: 'Hệ thống đối chiếu tồn kho trong CSDL, chặn vượt mức 6 và thông báo giới hạn tồn kho',
    actualResult: 'Số lượng dừng ở mức tối đa 6 máy và hiển thị cảnh báo số lượng tồn kho hiện tại',
    status: 'PASS',
  },
  {
    id: 'TC-08',
    module: 'Thanh toán & Transaction',
    scenario: 'Đặt hàng thành công với phương thức Thanh toán trực tuyến giả lập',
    inputData: 'Người nhận: Nguyễn Văn An, SĐT: 0912345678, Phương thức: Online (Mô phỏng Thành công)',
    steps: '1. Vào trang Thanh toán -> 2. Chọn Thanh toán trực tuyến giả lập (Thành công) -> 3. Xác nhận đặt hàng',
    expectedResult: 'Tạo đơn hàng mới (status="confirmed", payment_status="paid"), trừ tồn kho tương ứng và làm trống giỏ',
    actualResult: 'Transaction commit thành công, tồn kho giảm chính xác, giỏ hàng về 0 và chuyển tới chi tiết đơn',
    status: 'PASS',
  },
  {
    id: 'TC-09',
    module: 'Thanh toán & Transaction',
    scenario: 'Mô phỏng giao dịch Thanh toán trực tuyến thất bại (Kiểm tra Rollback)',
    inputData: 'Phương thức: Online (Chọn kịch bản Mô phỏng Thất bại)',
    steps: '1. Chọn Thanh toán trực tuyến giả lập -> 2. Chọn "Mô phỏng giao dịch Thất bại" -> 3. Nhấn Đặt hàng',
    expectedResult: 'Hệ thống thông báo giao dịch mô phỏng bị từ chối, không trừ tồn kho và giữ nguyên giỏ hàng',
    actualResult: 'Hiển thị cảnh báo lỗi thanh toán giả lập, số lượng tồn kho và giỏ hàng được bảo toàn nguyên vẹn',
    status: 'PASS',
  },
  {
    id: 'TC-10',
    module: 'Bảo mật Thanh toán',
    scenario: 'Chống sửa tổng tiền đơn hàng từ phía trình duyệt',
    inputData: 'Can thiệp DOM/Request gửi giá giả mạo 1.000 ₫ cho MacBook Air M3 (31.990.000 ₫)',
    steps: '1. Thực hiện đặt hàng -> 2. Kiểm tra đơn giá lưu trong order_details và total_price trong orders',
    expectedResult: 'Máy chủ bỏ qua mọi giá trị tiền từ client, tự đọc lại giá 31.990.000 ₫ từ bảng products trong MySQL',
    actualResult: 'Đơn hàng luôn ghi nhận đúng 31.990.000 ₫ theo dữ liệu gốc trong CSDL',
    status: 'SECURITY_VERIFIED',
  },
  {
    id: 'TC-11',
    module: 'Quản lý Sản phẩm (CRUD)',
    scenario: 'Xóa sản phẩm đã từng xuất hiện trong đơn hàng lịch sử',
    inputData: 'Xóa sản phẩm ID = 1 (Apple MacBook Air 13 M3 đã có trong đơn hàng #1001)',
    steps: '1. Đăng nhập Admin -> 2. Vào Quản lý sản phẩm -> 3. Nhấn Xóa trên sản phẩm MacBook Air M3',
    expectedResult: 'Không xóa vật lý làm mất lịch sử đơn #1001; tự động chuyển sản phẩm sang trạng thái Ngừng kinh doanh (is_active = 0)',
    actualResult: 'Sản phẩm chuyển sang trạng thái "Ngừng kinh doanh", đơn hàng #1001 vẫn giữ nguyên chi tiết và doanh thu',
    status: 'PASS',
  },
  {
    id: 'TC-12',
    module: 'Bảo mật Upload Ảnh',
    scenario: 'Thử tải lên tệp thực thi (.php / .exe) hoặc tệp quá 2MB vào mục ảnh sản phẩm',
    inputData: 'Tệp shell.php đổi tên hoặc tệp ảnh dung lượng 5MB',
    steps: '1. Mở form Thêm/Sửa sản phẩm Admin -> 2. Chọn tệp không hợp lệ -> 3. Lưu sản phẩm',
    expectedResult: 'Kiểm tra MIME type thực tế và kích thước tệp từ chối lưu tệp, hiển thị thông báo lỗi hợp lệ',
    actualResult: 'Chặn tải lên thành công, chỉ cho phép ảnh JPEG, PNG, WebP dung lượng <= 2MB',
    status: 'SECURITY_VERIFIED',
  },
  {
    id: 'TC-13',
    module: 'Quản lý Đơn hàng & Doanh thu',
    scenario: 'Duyệt đơn hàng sang Hoàn tất (completed) hoặc Hủy đơn (cancelled)',
    inputData: 'Đơn hàng #1007 (28.990.000 ₫) chuyển sang "completed" hoặc "cancelled"',
    steps: '1. Vào Admin Đơn hàng -> 2. Cập nhật trạng thái đơn #1007 -> 3. Kiểm tra Dashboard doanh thu & Tồn kho',
    expectedResult: 'Khi chuyển sang completed: Tổng doanh thu tăng thêm 28.990.000 ₫. Khi chuyển sang cancelled: Hoàn lại 1 máy vào tồn kho',
    actualResult: 'Số liệu doanh thu trên biểu đồ và tồn kho sản phẩm cập nhật tức thời, chính xác 100%',
    status: 'PASS',
  },
  {
    id: 'TC-14',
    module: 'Bảo mật XSS & CSRF',
    scenario: 'Nhập mã kịch bản <script>alert(1)</script> vào Tên người nhận hoặc gửi POST thiếu CSRF token',
    inputData: 'receiver_name = "<script>alert(\'XSS\')</script>"',
    steps: '1. Đặt hàng với tên chứa thẻ script -> 2. Xem lại trong Lịch sử đơn hàng và trang Admin',
    expectedResult: 'Chuỗi được escape hiển thị dưới dạng văn bản thuần vô hại; request thiếu CSRF token bị chặn HTTP 403',
    actualResult: 'Không có hộp thoại script nào thực thi; dữ liệu hiển thị an toàn nguyên văn',
    status: 'SECURITY_VERIFIED',
  },
];

export const TEAM_WORK_BREAKDOWN: TeamMemberRole[] = [
  {
    memberNumber: 1,
    roleTitle: 'Thành viên 1 — Phân tích hệ thống & Thiết kế Cơ sở dữ liệu',
    responsibilities: [
      'Thu thập yêu cầu thực tế của cửa hàng kinh doanh máy tính xách tay và xác định luồng nghiệp vụ',
      'Xây dựng sơ đồ Use Case tổng quát, sơ đồ Activity Diagram cho quy trình mua hàng và quản trị',
      'Thiết kế lược đồ CSDL quan hệ laptop_store (4 bảng, khóa chính, khóa ngoại ON DELETE RESTRICT/CASCADE, chỉ mục)',
      'Biên soạn tệp database.sql khởi tạo bảng và chuẩn bị dữ liệu mẫu cho 15 dòng laptop chính hãng',
      'Soạn thảo Chương 1, Chương 2 và Chương 3 trong Báo cáo đồ án tổng kết',
    ],
    deliverables: [
      'Tệp khởi tạo database.sql chuẩn UTF8MB4',
      'Sơ đồ Use Case, Activity Diagram và ERD (Mermaid / PlantUML)',
      'Nội dung phân tích yêu cầu và thiết kế CSDL trong báo cáo',
    ],
    filesOwned: ['database.sql', 'config/database.php'],
  },
  {
    memberNumber: 2,
    roleTitle: 'Thành viên 2 — Giao diện người dùng & Phân hệ Danh mục Sản phẩm',
    responsibilities: [
      'Thiết kế hệ thống giao diện HTML5, CSS3, Bootstrap 5 theo bảng màu thương hiệu TechLaptop (Navy & Blue)',
      'Xây dựng Trang chủ (index.php) hiển thị banner công nghệ, laptop nổi bật và laptop mới cập nhật',
      'Lập trình trang Danh sách sản phẩm (products.php) và Chi tiết sản phẩm (product-detail.php)',
      'Triển khai bộ lọc kết hợp đa tiêu chí (Từ khóa, CPU, RAM, SSD, Khoảng giá, Còn hàng), sắp xếp Whitelist và phân trang',
      'Soạn thảo Chương 4 (Thiết kế giao diện) trong Báo cáo đồ án',
    ],
    deliverables: [
      'Giao diện Responsive hiển thị chuẩn trên Desktop, Tablet và Mobile',
      'Chức năng tìm kiếm, lọc cấu hình và phân trang an toàn với PDO',
      'Tài liệu mô tả giao diện trong báo cáo',
    ],
    filesOwned: ['index.php', 'products.php', 'product-detail.php', 'includes/header.php', 'includes/footer.php', 'assets/css/style.css'],
  },
  {
    memberNumber: 3,
    roleTitle: 'Thành viên 3 — Nghiệp vụ Tài khoản, Giỏ hàng & Thanh toán Transaction',
    responsibilities: [
      'Xây dựng chức năng Đăng ký, Đăng nhập, Đăng xuất sử dụng password_hash(), password_verify() và session_regenerate_id(true)',
      'Phát triển giỏ hàng lưu trữ trên PHP Session (Thêm, cập nhật số lượng, xóa từng món, kiểm tra giới hạn tồn kho)',
      'Lập trình luồng Thanh toán giả lập (COD và Thanh toán trực tuyến mô phỏng thành công/thất bại)',
      'Triển khai PDO Transaction nguyên tử khi tạo đơn hàng (đọc lại giá từ MySQL, khóa dòng FOR UPDATE, trừ kho)',
      'Xây dựng trang Hồ sơ cá nhân, Lịch sử đơn hàng (my-orders.php) và Chi tiết đơn hàng của khách',
    ],
    deliverables: [
      'Hệ thống xác thực người dùng và quản lý Session an toàn',
      'Luồng Giỏ hàng và Đặt hàng Transaction chống sửa giá, chống âm kho',
      'Soạn thảo Chương 5 (Cài đặt và triển khai nghiệp vụ) trong báo cáo',
    ],
    filesOwned: ['login.php', 'register.php', 'logout.php', 'cart.php', 'checkout.php', 'my-orders.php', 'actions/process-checkout.php', 'actions/cart-add.php'],
  },
  {
    memberNumber: 4,
    roleTitle: 'Thành viên 4 — Quản trị Admin, Bảo mật, Thống kê & Tổng hợp Đồ án',
    responsibilities: [
      'Xây dựng middleware kiểm soát phân quyền Admin (requireAdmin) và cơ chế chống CSRF (csrf.php) toàn hệ thống',
      'Lập trình CRUD sản phẩm dành cho Admin, tích hợp upload ảnh an toàn bằng finfo và cơ chế Ngừng kinh doanh bảo toàn lịch sử',
      'Xây dựng trang Quản lý đơn hàng Admin (lọc theo trạng thái/thời gian, chuyển trạng thái hợp lệ, hoàn kho khi hủy)',
      'Phát triển Dashboard Admin và biểu đồ thống kê doanh thu thực tế bằng Chart.js',
      'Thực hiện kiểm thử bảo mật (SQLi, XSS, CSRF), tổng hợp Báo cáo Chương 6 & 7, chuẩn bị Slide thuyết trình và Kịch bản Demo',
    ],
    deliverables: [
      'Phân hệ Quản trị Admin hoàn chỉnh kèm biểu đồ doanh thu Chart.js',
      'Bảng kiểm thử 14+ kịch bản, Slide thuyết trình 12 trang, README.md và Kịch bản Demo 7 phút',
    ],
    filesOwned: ['includes/auth.php', 'includes/csrf.php', 'admin/index.php', 'admin/products.php', 'admin/product-delete.php', 'admin/orders.php', 'admin/order-update.php', 'README.md'],
  },
];

export const DEMO_SCRIPT_STEPS: DemoScriptStep[] = [
  {
    minuteRange: 'Phút 0:00 – 1:15',
    phaseTitle: 'Bước 1: Giới thiệu Trang chủ, Tìm kiếm & Lọc cấu hình Laptop',
    actor: 'Khách / User',
    actions: [
      'Truy cập Trang chủ TechLaptop, điểm qua khu vực Banner công nghệ, Laptop nổi bật và Laptop mới cập nhật.',
      'Chuyển sang trang "Sản phẩm", gõ từ khóa hoặc chọn kết hợp bộ lọc: CPU "Intel Core i7", RAM "16GB", Khoảng giá "25 - 35 triệu" và sắp xếp theo "Giá tăng dần".',
      'Mở trang chi tiết mẫu "MSI Katana 15 B13VGK Gaming" (28.990.000 ₫) để xem thông số và số lượng tồn kho thực tế (13 máy).',
      'Mở thử mẫu "HP Omen 16 Ryzen 7" (Tồn kho = 0) để chứng minh hệ thống tự động khóa nút mua khi hết hàng.',
    ],
    talkingPoints:
      'Thưa thầy/cô, toàn bộ dữ liệu sản phẩm và bộ lọc đều truy vấn trực tiếp từ CSDL. Khi kết hợp nhiều điều kiện lọc và sắp xếp, hệ thống sử dụng PDO Prepared Statements kèm Whitelist cột sắp xếp để đảm bảo an toàn tuyệt đối.',
  },
  {
    minuteRange: 'Phút 1:15 – 2:30',
    phaseTitle: 'Bước 2: Đăng nhập User, Quản lý Giỏ hàng & Kiểm tra Giới hạn Tồn kho',
    actor: 'Khách / User',
    actions: [
      'Nhấn thêm "Apple MacBook Air 13 M3 2024" (31.990.000 ₫) vào giỏ hàng.',
      'Tại trang Giỏ hàng, thử tăng số lượng sản phẩm và quan sát hệ thống tự động tính lại thành tiền từng dòng, đồng thời chặn không cho vượt quá số lượng tồn kho.',
      'Nhấn nút "Tiến hành thanh toán", hệ thống yêu cầu đăng nhập -> Đăng nhập bằng tài khoản khách hàng mẫu (nguyenvanan / User@123).',
      'Thử truy cập vào mục "Quản trị Admin" khi đang ở quyền User để trình diễn cơ chế chặn phân quyền ở phía máy chủ.',
    ],
    talkingPoints:
      'Mật khẩu của người dùng được xác thực bằng hàm password_verify() và tái tạo Session ID mới sau khi đăng nhập. Đồng thời, tài khoản khách hàng sẽ bị chặn ngay lập tức nếu cố tình truy cập vào khu vực quản trị.',
  },
  {
    minuteRange: 'Phút 2:30 – 4:00',
    phaseTitle: 'Bước 3: Thực hiện Thanh toán Giả lập (Mô phỏng Thất bại & Thành công)',
    actor: 'Khách / User',
    actions: [
      'Tại trang Thanh toán, kiểm tra thông tin người nhận (Họ tên, Số điện thoại 10 số, Địa chỉ giao hàng).',
      'Chọn phương thức "Thanh toán trực tuyến giả lập" và chọn thử kịch bản "Giao dịch Thất bại" -> Nhấn Xác nhận đặt hàng để thấy hệ thống Rollback an toàn, không trừ kho và giữ nguyên giỏ hàng.',
      'Chuyển sang kịch bản "Giao dịch Thành công" (hoặc chọn COD) -> Nhấn Xác nhận đặt hàng.',
      'Xem màn hình Đặt hàng thành công và kiểm tra đơn hàng mới vừa tạo trong trang "Đơn hàng của tôi".',
    ],
    talkingPoints:
      'Quy trình đặt hàng được bọc trong một PDO Transaction: máy chủ tự đọc lại đơn giá từ MySQL, kiểm tra tồn kho lần cuối, ghi bảng orders và order_details rồi mới trừ kho. Do đó người dùng không thể sửa giá tiền từ trình duyệt.',
  },
  {
    minuteRange: 'Phút 4:00 – 5:30',
    phaseTitle: 'Bước 4: Đăng nhập Admin, Quản lý CRUD Sản phẩm & Bảo toàn Lịch sử',
    actor: 'Admin',
    actions: [
      'Chuyển sang tài khoản Quản trị viên (admin / Admin@123) và mở khu vực "Quản trị Admin".',
      'Vào tab "Quản lý sản phẩm", thực hiện Thêm mới một laptop hoặc Sửa giá/tồn kho và tải ảnh sản phẩm lên (hệ thống kiểm tra định dạng JPG/PNG/WebP <= 2MB).',
      'Thực hiện thao tác Xóa trên một sản phẩm đã từng có trong đơn hàng lịch sử -> Hệ thống tự động chuyển sang trạng thái "Ngừng kinh doanh" thay vì xóa vật lý.',
    ],
    talkingPoints:
      'Nhằm bảo vệ tính toàn vẹn của khóa ngoại và lịch sử doanh thu, khi Admin xóa một sản phẩm đã từng bán, hệ thống tự động đánh dấu Ngừng kinh doanh (is_active = 0) để các đơn hàng cũ không bị mất thông tin.',
  },
  {
    minuteRange: 'Phút 5:30 – 7:00',
    phaseTitle: 'Bước 5: Duyệt Đơn hàng & Kiểm chứng Biểu đồ Doanh thu Cập nhật Thực tế',
    actor: 'Admin',
    actions: [
      'Mở tab "Dashboard & Doanh thu", ghi nhận con số Tổng doanh thu hiện tại.',
      'Chuyển sang tab "Quản lý đơn hàng", tìm đơn hàng vừa đặt của Nguyễn Văn An và cập nhật trạng thái lần lượt tới "Đã hoàn tất (completed)".',
      'Quay lại tab "Dashboard & Doanh thu", chỉ ra Tổng doanh thu và Biểu đồ doanh thu đã tự động cộng thêm giá trị của đơn hàng vừa hoàn tất.',
      'Mở mục "Hồ sơ Đồ án & Code PHP" để giới thiệu nhanh cấu trúc mã nguồn PHP 8.1, tệp database.sql và báo cáo 7 chương.',
    ],
    talkingPoints:
      'Như thầy/cô vừa quan sát, chỉ khi đơn hàng chuyển sang trạng thái Đã hoàn tất (completed) thì doanh thu mới được cộng vào tổng doanh thu và biểu đồ. Điều này phản ánh đúng thực tế nghiệp vụ thương mại điện tử.',
  },
];
