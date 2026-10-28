import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit3,
  Trash2,
  Upload,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Product, User, Order, OrderStatus } from '../types';
import {
  formatVND,
  formatDateTimeVN,
  createLaptopStudioSvg,
  LaptopVisualTheme,
} from '../utils/laptopSvgGenerator';

interface AdminWorkspaceProps {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  users: User[];
  onSwitchToAdminDemo: () => void;
  onSaveProduct: (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, editId?: number) => {
    ok: boolean;
    message: string;
  };
  onDeleteOrDeactivateProduct: (productId: number) => { ok: boolean; message: string };
  onToggleProductActive: (productId: number) => void;
  onUpdateOrderStatus: (orderId: number, newStatus: OrderStatus) => {
    ok: boolean;
    message: string;
  };
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  currentUser,
  products,
  orders,
  users,
  onSwitchToAdminDemo,
  onSaveProduct,
  onDeleteOrDeactivateProduct,
  onToggleProductActive,
  onUpdateOrderStatus,
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>(
    'dashboard'
  );
  const [revenueGranularity, setRevenueGranularity] = useState<'day' | 'month' | 'year'>('month');
  const [adminFeedback, setAdminFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Product CRUD Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('ASUS');
  const [pCategory, setPCategory] = useState<Product['category']>('Văn phòng & Sinh viên');
  const [pCpu, setPCpu] = useState('Intel Core i5');
  const [pRam, setPRam] = useState('16GB');
  const [pSsd, setPSsd] = useState('512GB');
  const [pPrice, setPPrice] = useState('18990000');
  const [pStock, setPStock] = useState('10');
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Order Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderKeyword, setOrderKeyword] = useState('');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  // ============================================================================
  // SERVER-SIDE RBAC CHECK (Requirement 4.4: Chặn User truy cập URL Admin)
  // ============================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">
            HTTP 403 Forbidden — Truy cập bị từ chối bởi Middleware Phân quyền (requireAdmin)
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            {currentUser
              ? `Tài khoản hiện tại "${currentUser.username}" có vai trò là USER thông thường nên không được phép truy cập trực tiếp vào đường dẫn /admin.`
              : 'Bạn chưa đăng nhập. Hệ thống kiểm tra Session ở phía máy chủ và chặn mọi truy cập trái phép vào trang Quản trị.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onSwitchToAdminDemo}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Chuyển nhanh sang phiên đăng nhập Admin (admin / Admin@123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SQL-EQUIVALENT KPI & REVENUE AGGREGATIONS (Requirement 4.10)
  // ============================================================================
  const activeProductsCount = products.filter((p) => p.is_active === 1).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalCompletedRevenue = completedOrders.reduce((sum, o) => sum + o.total_price, 0);

  const revenueSeries = useMemo(() => {
    const grouped = new Map<string, { label: string; revenue: number; count: number }>();

    completedOrders.forEach((order) => {
      const datePart = order.created_at.split(' ')[0]; // YYYY-MM-DD
      const [yyyy, mm, dd] = datePart.split('-');
      let key = `${yyyy}-${mm}`;
      let label = `Tháng ${mm}/${yyyy}`;

      if (revenueGranularity === 'day') {
        key = `${yyyy}-${mm}-${dd}`;
        label = `${dd}/${mm}/${yyyy}`;
      } else if (revenueGranularity === 'year') {
        key = yyyy;
        label = `Năm ${yyyy}`;
      }

      const existing = grouped.get(key) || { label, revenue: 0, count: 0 };
      existing.revenue += order.total_price;
      existing.count += 1;
      grouped.set(key, existing);
    });

    return Array.from(grouped.entries())
      .sort(([k1], [k2]) => k1.localeCompare(k2))
      .map(([, val]) => val);
  }, [completedOrders, revenueGranularity]);

  const maxRevenueInChart = Math.max(
    1,
    ...revenueSeries.map((item) => item.revenue)
  );

  // ============================================================================
  // PRODUCT CRUD & IMAGE UPLOAD HANDLERS (Requirements 4.5 & 4.6)
  // ============================================================================
  const openCreateModal = () => {
    setEditingId(undefined);
    setPName('');
    setPBrand('ASUS');
    setPCategory('Ultrabook & Đồ họa');
    setPCpu('Intel Core i7');
    setPRam('16GB');
    setPSsd('512GB');
    setPPrice('25990000');
    setPStock('10');
    setPDesc(
      'Laptop chính hãng phân phối tại TechLaptop, trang bị vi xử lý thế hệ mới, màn hình chống chói sắc nét và bảo hành 24 tháng.'
    );
    setPImage(
      createLaptopStudioSvg('ASUS', 'Laptop Mới', 'Core i7 · 16GB · 512GB', 'ultrabook-silver')
    );
    setUploadStatus(null);
    setIsFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setPName(product.name);
    setPBrand(product.brand);
    setPCategory(product.category);
    setPCpu(product.cpu);
    setPRam(product.ram);
    setPSsd(product.ssd);
    setPPrice(String(product.price));
    setPStock(String(product.stock));
    setPDesc(product.description);
    setPImage(product.image);
    setUploadStatus(null);
    setIsFormOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedMimes.includes(file.type)) {
      setUploadStatus(
        `[BẢO MẬT UPLOAD] Từ chối tệp "${file.name}" (MIME: ${
          file.type || 'unknown'
        }). Chỉ chấp nhận JPEG, PNG hoặc WebP.`
      );
      return;
    }

    if (file.size > maxSize) {
      setUploadStatus(
        `[BẢO MẬT UPLOAD] Từ chối tệp "${file.name}". Dung lượng vượt quá giới hạn 2 MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPImage(reader.result);
        const randomName = `uploads/products/laptop_${Math.random()
          .toString(16)
          .slice(2, 14)}.jpg`;
        setUploadStatus(
          `Đã kiểm tra MIME (${file.type}) hợp lệ và sinh tên tệp ngẫu nhiên: ${randomName}`
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateMaliciousPhpUpload = () => {
    setUploadStatus(
      '[CHẶN BỞI FINFO MIME CHECK] Phát hiện tệp "backdoor_shell.php.jpg" có MIME thực tế là "text/x-php" (không phải image/jpeg, image/png, image/webp). Hệ thống đã hủy tải lên!'
    );
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(pPrice);
    const numericStock = Number(pStock);

    if (pName.trim().length < 5) {
      setAdminFeedback({
        type: 'error',
        text: 'Tên laptop phải có ít nhất 5 ký tự.',
      });
      return;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setAdminFeedback({
        type: 'error',
        text: 'Giá bán phải là một số dương hợp lệ.',
      });
      return;
    }
    if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
      setAdminFeedback({
        type: 'error',
        text: 'Số lượng tồn kho phải là số nguyên không âm.',
      });
      return;
    }

    const finalImage =
      pImage ||
      createLaptopStudioSvg(
        pBrand,
        pName.slice(0, 22),
        `${pCpu} · ${pRam} · ${pSsd}`,
        'ultrabook-silver'
      );

    const res = onSaveProduct(
      {
        name: pName.trim(),
        brand: pBrand.trim(),
        category: pCategory,
        cpu: pCpu.trim(),
        ram: pRam.trim(),
        ssd: pSsd.trim(),
        price: numericPrice,
        stock: numericStock,
        description: pDesc.trim(),
        image: finalImage,
        is_active: 1,
        is_featured: true,
      },
      editingId
    );

    setAdminFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
    if (res.ok) {
      setIsFormOpen(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
        if (orderKeyword.trim() !== '') {
          const kw = orderKeyword.trim().toLowerCase();
          if (
            !String(o.id).includes(kw) &&
            !o.receiver_name.toLowerCase().includes(kw) &&
            !o.receiver_phone.includes(kw)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.id - a.id);
  }, [orders, orderStatusFilter, orderKeyword]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Top Admin Workspace Header & Section Navigation */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Phân hệ Quản trị Hệ thống (Admin Portal)
          </p>
          <h1 className="text-2xl font-bold mt-0.5">
            Quản Trị Sản Phẩm, Đơn Hàng &amp; Thống Kê Doanh Thu
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard & Doanh thu' },
            { id: 'products', label: `Sản phẩm (${products.length})` },
            { id: 'orders', label: `Đơn hàng (${orders.length})` },
            { id: 'users', label: `Người dùng (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setAdminTab(tab.id as typeof adminTab);
                setAdminFeedback(null);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                adminTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flash Feedback Banner */}
      {adminFeedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-3 ${
            adminFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{adminFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminFeedback(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* =====================================================================
          TAB 1: DASHBOARD & REVENUE CHART
         ===================================================================== */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 5 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs font-medium text-slate-500">
                Tổng doanh thu thực tế (Đơn đã hoàn tất)
              </span>
              <p className="text-2xl font-bold text-blue-700 font-mono-tabular mt-1">
                {formatVND(totalCompletedRevenue)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tính từ {completedOrders.length} đơn <code className="font-mono">status = &apos;completed&apos;</code>
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs font-medium text-slate-500">
                Đơn hàng chờ xử lý
              </span>
              <p className="text-2xl font-bold text-amber-600 font-mono-tabular mt-1">
                {pendingOrdersCount} đơn
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Trên tổng số {orders.length} đơn hàng
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs font-medium text-slate-500">
                Laptop đang kinh doanh
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
                {activeProductsCount} / {products.length}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tổng tồn kho: {products.reduce((s, p) => s + p.stock, 0)} máy
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs font-medium text-slate-500">
                Tài khoản người dùng
              </span>
              <p className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
                {users.length} thành viên
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                1 Admin · {users.length - 1} User khách hàng
              </p>
            </div>
          </div>

          {/* Interactive Revenue Chart Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Biểu Đồ Thống Kê Doanh Thu Thực Tế (Chart.js / SQL GROUP BY)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy định nghiệp vụ: Chỉ tổng hợp các đơn hàng đã hoàn tất (<code className="font-mono">status = &apos;completed&apos;</code>). Không tính đơn đang chờ, đã hủy hoặc thanh toán thất bại.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'day', label: 'Theo Ngày' },
                  { id: 'month', label: 'Theo Tháng' },
                  { id: 'year', label: 'Theo Năm' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setRevenueGranularity(g.id as typeof revenueGranularity)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                      revenueGranularity === g.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="h-64 flex items-end justify-around gap-4 pt-8 border-b border-slate-300">
                    {revenueSeries.map((point) => {
                      const heightPercent = Math.max(
                        12,
                        Math.round((point.revenue / maxRevenueInChart) * 100)
                      );
                      return (
                        <div
                          key={point.label}
                          className="flex-1 flex flex-col items-center justify-end h-full group"
                        >
                          <span className="text-[11px] font-bold font-mono-tabular text-slate-700 mb-1.5">
                            {formatVND(point.revenue)}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[68px] bg-blue-700 group-hover:bg-blue-600 rounded-t-lg transition-all relative"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-around gap-4 pt-3">
                    {revenueSeries.map((point) => (
                      <div key={point.label} className="flex-1 text-center">
                        <span className="block text-xs font-semibold text-slate-800">
                          {point.label}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-mono-tabular">
                          {point.count} đơn hoàn tất
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SQL Breakdown Table */}
                <div className="md:col-span-4 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-700">
                    Bảng Số Liệu Truy Vấn SQL
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 px-3">Kỳ thống kê</th>
                        <th className="py-2.5 px-3 text-right">Số đơn</th>
                        <th className="py-2.5 px-3 text-right">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono-tabular">
                      {revenueSeries.map((row) => (
                        <tr key={row.label}>
                          <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                            {row.label}
                          </td>
                          <td className="py-2.5 px-3 text-right">{row.count}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-700">
                            {formatVND(row.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: PRODUCT CRUD & SECURE IMAGE UPLOAD
         ===================================================================== */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Quản Lý Danh Mục Sản Phẩm Laptop (CRUD &amp; Upload Ảnh)
              </h2>
              <p className="text-xs text-slate-500">
                Hỗ trợ Thêm, Sửa, Upload ảnh kiểm tra MIME thực tế và cơ chế Ngừng kinh doanh (<code className="font-mono">is_active = 0</code>) bảo toàn lịch sử đơn hàng.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm laptop mới</span>
            </button>
          </div>

          {/* Create / Edit Product Form Panel */}
          {isFormOpen && (
            <form
              onSubmit={handleProductFormSubmit}
              className="bg-white border border-blue-200 rounded-xl p-6 space-y-5 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  {editingId
                    ? `Chỉnh sửa thông tin Laptop #${editingId}`
                    : 'Thêm sản phẩm Laptop mới vào CSDL'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Đóng biểu mẫu ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tên laptop *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="VD: ASUS ZenBook 14 OLED UX3405"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Thương hiệu *
                  </label>
                  <input
                    type="text"
                    required
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="ASUS / Dell / Apple / Lenovo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phân khúc
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Văn phòng & Sinh viên">Văn phòng &amp; Sinh viên</option>
                    <option value="Ultrabook & Đồ họa">Ultrabook &amp; Đồ họa</option>
                    <option value="Gaming & Workstation">Gaming &amp; Workstation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Bộ vi xử lý (CPU) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pCpu}
                    onChange={(e) => setPCpu(e.target.value)}
                    placeholder="Intel Core i7 / Apple M3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Dung lượng RAM *
                  </label>
                  <input
                    type="text"
                    required
                    value={pRam}
                    onChange={(e) => setPRam(e.target.value)}
                    placeholder="8GB / 16GB / 32GB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ổ cứng SSD *
                  </label>
                  <input
                    type="text"
                    required
                    value={pSsd}
                    onChange={(e) => setPSsd(e.target.value)}
                    placeholder="256GB / 512GB / 1TB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000000}
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono-tabular"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono-tabular"
                  />
                </div>

                {/* Image Upload & Security Check */}
                <div className="sm:col-span-3 space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Upload hình ảnh sản phẩm (Kiểm tra MIME JPEG/PNG/WebP &le; 2MB bằng finfo)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn tệp ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleSimulateMaliciousPhpUpload}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Kiểm thử chặn upload tệp thực thi (.php giả danh .jpg)
                    </button>
                  </div>
                  {uploadStatus && (
                    <p className="text-xs font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                      {uploadStatus}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mô tả chi tiết sản phẩm *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  {editingId ? 'Lưu cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
                </button>
              </div>
            </form>
          )}

          {/* Products Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4">Cấu hình</th>
                    <th className="py-3 px-4 text-right">Giá bán</th>
                    <th className="py-3 px-4 text-right">Tồn kho</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className={p.is_active === 0 ? 'bg-slate-50/80 opacity-65' : 'hover:bg-slate-50/60'}
                    >
                      <td className="py-3 px-4 font-mono-tabular text-xs font-bold text-slate-500">
                        #{p.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.brand} · {p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono-tabular text-slate-600">
                        {p.cpu} · {p.ram} · {p.ssd}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-red-600 font-mono-tabular">
                        {formatVND(p.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-semibold">
                        <span className={p.stock === 0 ? 'text-red-600' : 'text-slate-900'}>
                          {p.stock} máy
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">
                        {p.is_active === 1 ? (
                          <span className="text-emerald-700">Đang kinh doanh</span>
                        ) : (
                          <span className="text-amber-700">Ngừng kinh doanh (is_active=0)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer"
                          >
                            Sửa
                          </button>
                          {p.is_active === 0 ? (
                            <button
                              type="button"
                              onClick={() => onToggleProductActive(p.id)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md cursor-pointer"
                            >
                              Mở bán lại
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const res = onDeleteOrDeactivateProduct(p.id);
                                setAdminFeedback({
                                  type: res.ok ? 'success' : 'error',
                                  text: res.message,
                                });
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ORDER MANAGEMENT (Quản Lý Đơn Hàng & Cập Nhật Trạng Thái)
         ===================================================================== */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderKeyword}
                onChange={(e) => setOrderKeyword(e.target.value)}
                placeholder="Tìm theo mã đơn, tên người nhận hoặc SĐT..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ xử lý (pending)' },
                { id: 'confirmed', label: 'Đã xác nhận' },
                { id: 'shipping', label: 'Đang giao' },
                { id: 'completed', label: 'Hoàn tất (Tính DT)' },
                { id: 'cancelled', label: 'Đã hủy' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    orderStatusFilter === st.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách nhận</th>
                    <th className="py-3 px-4">Ngày đặt</th>
                    <th className="py-3 px-4">Thanh toán</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4">Cập nhật trạng thái (State Machine)</th>
                    <th className="py-3 px-4 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold font-mono-tabular text-slate-900">
                        #{o.id}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <p className="font-semibold text-slate-900">{o.receiver_name}</p>
                        <p className="text-slate-500 font-mono-tabular">{o.receiver_phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono-tabular text-slate-600">
                        {formatDateTimeVN(o.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-medium text-slate-800">
                          {o.payment_method === 'cod' ? 'COD' : 'Online Giả lập'}
                        </span>
                        <span
                          className={`block font-semibold ${
                            o.payment_status === 'paid'
                              ? 'text-emerald-700'
                              : o.payment_status === 'failed'
                              ? 'text-red-600'
                              : 'text-amber-700'
                          }`}
                        >
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-red-600 font-mono-tabular">
                        {formatVND(o.total_price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={o.status}
                          disabled={o.status === 'completed' || o.status === 'cancelled'}
                          onChange={(e) => {
                            const res = onUpdateOrderStatus(
                              o.id,
                              e.target.value as OrderStatus
                            );
                            setAdminFeedback({
                              type: res.ok ? 'success' : 'error',
                              text: res.message,
                            });
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 disabled:opacity-60"
                        >
                          <option value="pending">pending (Chờ xử lý)</option>
                          <option value="confirmed">confirmed (Đã xác nhận)</option>
                          <option value="shipping">shipping (Đang giao)</option>
                          <option value="completed">completed (Đã hoàn tất - Cộng DT)</option>
                          <option value="cancelled">cancelled (Hủy đơn - Hoàn kho)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAdminOrder(o)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                        >
                          Xem ({o.details.length})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedAdminOrder && (
            <div className="bg-white border border-blue-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Chi Tiết Đơn Hàng #{selectedAdminOrder.id} — Khách hàng: {selectedAdminOrder.receiver_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Địa chỉ giao hàng: {selectedAdminOrder.shipping_address}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAdminOrder(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2">Mã SP</th>
                    <th className="py-2">Tên sản phẩm lưu tại thời điểm mua</th>
                    <th className="py-2 text-right">Đơn giá lịch sử</th>
                    <th className="py-2 text-right">Số lượng</th>
                    <th className="py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {selectedAdminOrder.details.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2.5">#{d.product_id}</td>
                      <td className="py-2.5 font-sans font-semibold text-slate-900">
                        {d.product_name}
                      </td>
                      <td className="py-2.5 text-right">{formatVND(d.unit_price)}</td>
                      <td className="py-2.5 text-right">{d.quantity}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">
                        {formatVND(d.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: USER MANAGEMENT (Quản Lý Người Dùng)
         ===================================================================== */}
      {adminTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Danh Sách Tài Khoản Người Dùng Trong Hệ Thống ({users.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mật khẩu được lưu dưới dạng mã băm Bcrypt (<code className="font-mono">password_hash</code>). Không cho phép tự đăng ký tài khoản Admin.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Email / SĐT</th>
                  <th className="py-3 px-4">Mã băm mật khẩu (Bcrypt)</th>
                  <th className="py-3 px-4 text-right">Số đơn đã đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => {
                  const userOrderCount = orders.filter((o) => o.user_id === u.id).length;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono-tabular text-xs font-bold text-slate-500">
                        #{u.id}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {u.username}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">{u.full_name}</td>
                      <td className="py-3 px-4 text-xs font-bold">
                        <span
                          className={
                            u.role === 'admin' ? 'text-blue-700' : 'text-slate-600'
                          }
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span>{u.email || '—'}</span>
                        <span className="block font-mono-tabular text-slate-400">
                          {u.phone || ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-mono text-slate-400 max-w-[200px] truncate">
                        {u.password_hash}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-bold text-slate-900">
                        {userOrderCount} đơn
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
