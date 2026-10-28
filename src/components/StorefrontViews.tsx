import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Package,
  CreditCard,
  Truck,
  User as UserIcon,
  LogOut,
  Lock,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  Product,
  User,
  Order,
  CartItem,
  ProductFilterState,
  PaymentMethod,
} from '../types';
import { formatVND, formatDateTimeVN, createLaptopStudioSvg } from '../utils/laptopSvgGenerator';
import { ActivePage } from './Navbar';

// ============================================================================
// REUSABLE PRODUCT CARD (Follows E-Commerce Reference & Zero-Pill Metadata)
// ============================================================================
interface ProductCardProps {
  product: Product;
  onViewDetail: (productId: number) => void;
  onAddToCart: (productId: number, qty: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onAddToCart,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image Slot (4:3 aspect ratio on clean neutral backdrop) */}
      <div
        onClick={() => onViewDetail(product.id)}
        className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer border-b border-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = createLaptopStudioSvg(
              product.brand,
              product.name,
              `${product.cpu} · ${product.ram}`,
              'business-slate'
            );
          }}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Unboxed Metadata: Brand · Category · Stock status */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-slate-500">
              {product.brand} · {product.category}
            </span>
            <span
              className={`font-medium tabular-nums ${
                isOutOfStock ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {isOutOfStock ? 'Tạm hết hàng' : `Còn ${product.stock} máy`}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetail(product.id)}
            className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Hardware Specs (Clean unboxed text with middot separators) */}
          <p className="mt-1.5 text-xs text-slate-600 font-mono-tabular">
            <span>{product.cpu}</span>
            <span aria-hidden="true"> · </span>
            <span>RAM {product.ram}</span>
            <span aria-hidden="true"> · </span>
            <span>SSD {product.ssd}</span>
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] text-slate-400">Giá niêm yết</span>
            <span className="text-base font-bold text-red-600 font-mono-tabular">
              {formatVND(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetail(product.id)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Chi tiết
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product.id, 1)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// ============================================================================
// 1. HOME VIEW (Trang Chủ)
// ============================================================================
interface HomeViewProps {
  products: Product[];
  onViewDetail: (productId: number) => void;
  onAddToCart: (productId: number, qty: number) => void;
  onNavigate: (page: ActivePage) => void;
  onQuickSearch: (keyword: string, category?: string) => void;
  currentUser: User | null;
  onQuickSwitchUser: (username: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onViewDetail,
  onAddToCart,
  onNavigate,
  onQuickSearch,
  currentUser,
  onQuickSwitchUser,
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const activeProducts = useMemo(
    () => products.filter((p) => p.is_active === 1),
    [products]
  );

  const featuredProducts = useMemo(
    () => activeProducts.filter((p) => p.is_featured).slice(0, 6),
    [activeProducts]
  );

  const newestProducts = useMemo(
    () =>
      [...activeProducts]
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, 3),
    [activeProducts]
  );

  const heroFlagship = activeProducts.find((p) => p.id === 3) || activeProducts[0];

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(heroSearch);
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Storefront Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: Brand Value Proposition & Direct Search */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium text-blue-400 tracking-wide">
                  TechLaptop — Hệ thống phân phối máy tính xách tay chính hãng
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.15]">
                  Hiệu năng chuẩn xác cho Lập trình, Đồ họa và Doanh nghiệp
                </h1>
                <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                  Tra cứu cấu hình chuyên sâu theo vi xử lý CPU, dung lượng RAM, ổ cứng SSD. Cam kết tồn kho thực tế từ cơ sở dữ liệu MySQL, bảo hành chính hãng 24 tháng.
                </p>
              </div>

              {/* Search Bar & Primary Actions */}
              <div className="space-y-4 pt-2">
                <form
                  onSubmit={handleHeroSearchSubmit}
                  className="flex flex-col sm:flex-row gap-2.5 max-w-xl"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Tìm theo tên laptop (VD: MacBook M3, ROG Strix, XPS 14)..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Tìm kiếm ngay
                  </button>
                </form>

                {/* Quick Demo Switcher Strip for Instructor / Student Defense */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="text-slate-400">Chế độ trải nghiệm nhanh đồ án:</span>
                  <button
                    type="button"
                    onClick={() => onQuickSwitchUser('nguyenvanan')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      currentUser?.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    Khách hàng (nguyenvanan)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onQuickSwitchUser('admin');
                      onNavigate('admin');
                    }}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      currentUser?.role === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    Quản trị viên (Admin Dashboard)
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('deliverables')}
                    className="px-3 py-1.5 rounded-md font-medium bg-slate-800 text-blue-300 hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Xem Mã nguồn PHP/MySQL & Báo cáo 7 Chương
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Flagship Laptop Spotlight Card */}
            {heroFlagship && (
              <div className="lg:col-span-5 flex">
                <div className="w-full bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between p-5">
                  <div
                    onClick={() => onViewDetail(heroFlagship.id)}
                    className="aspect-4/3 rounded-lg overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={heroFlagship.image}
                      alt={heroFlagship.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-blue-400 font-medium">
                        Sản phẩm tiêu điểm · {heroFlagship.cpu}
                      </p>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        {heroFlagship.name}
                      </h2>
                      <p className="text-sm font-bold text-red-400 font-mono-tabular mt-0.5">
                        {formatVND(heroFlagship.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewDetail(heroFlagship.id)}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Khám phá
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full-width 4-Column Storefront Metrics Strip */}
          <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="font-mono-tabular text-xl font-bold text-white">
                {activeProducts.length} mẫu laptop
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Đầy đủ phân khúc Văn phòng, Đồ họa OLED & Gaming
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-xl font-bold text-white">
                100% PDO MySQL
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Truy vấn Prepared Statements & Transaction nguyên tử
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-xl font-bold text-white">
                Bảo hành 24 tháng
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Đổi mới trong 30 ngày đầu nếu có lỗi phần cứngNSX
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-xl font-bold text-white">
                Giao hàng toàn quốc
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Hỗ trợ thanh toán COD và Thanh toán trực tuyến mô phỏng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Laptops (Danh sách laptop nổi bật) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Danh mục chọn lọc
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Laptop Nổi Bật Hàng Đầu
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Xem toàn bộ {activeProducts.length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Newly Updated & Brand Configuration Architecture */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Phân loại cấu hình & Thương hiệu
              </p>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Laptop Mới Cập Nhật & Lọc Nhanh Theo Nhu Cầu
              </h2>
            </div>

            {/* Interactive Filter Buttons by CPU / Segment */}
            <div className="flex flex-wrap items-center gap-2">
              {['Intel Core i5', 'Intel Core i7', 'Intel Core Ultra 7', 'Apple M3', 'AMD Ryzen 7'].map(
                (cpuLabel) => (
                  <button
                    key={cpuLabel}
                    type="button"
                    onClick={() => onQuickSearch('', cpuLabel)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Lọc {cpuLabel}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {newestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={onViewDetail}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// 2. PRODUCT CATALOG VIEW (Trang Danh Sách Sản Phẩm + Tìm Kiếm + Lọc + Phân Trang)
// ============================================================================
interface ProductCatalogViewProps {
  products: Product[];
  filters: ProductFilterState;
  onUpdateFilters: (partial: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  onViewDetail: (productId: number) => void;
  onAddToCart: (productId: number, qty: number) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  filters,
  onUpdateFilters,
  onResetFilters,
  onViewDetail,
  onAddToCart,
}) => {
  const activeProducts = useMemo(
    () => products.filter((p) => p.is_active === 1),
    [products]
  );

  // Extract distinct CPU, RAM, SSD values dynamically from database records
  const cpuOptions = useMemo(
    () => Array.from(new Set(activeProducts.map((p) => p.cpu))).sort(),
    [activeProducts]
  );
  const ramOptions = useMemo(
    () => Array.from(new Set(activeProducts.map((p) => p.ram))),
    [activeProducts]
  );
  const ssdOptions = useMemo(
    () => Array.from(new Set(activeProducts.map((p) => p.ssd))),
    [activeProducts]
  );

  // Combined Filter + Sort Engine (mirrors products.php PDO Prepared Query)
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        if (filters.keyword.trim() !== '') {
          const kw = filters.keyword.trim().toLowerCase();
          if (
            !p.name.toLowerCase().includes(kw) &&
            !p.brand.toLowerCase().includes(kw) &&
            !p.cpu.toLowerCase().includes(kw)
          ) {
            return false;
          }
        }
        if (filters.cpu && p.cpu !== filters.cpu) return false;
        if (filters.ram && p.ram !== filters.ram) return false;
        if (filters.ssd && p.ssd !== filters.ssd) return false;
        if (filters.inStockOnly && p.stock <= 0) return false;

        if (filters.priceRange === 'under15' && p.price >= 15000000) return false;
        if (
          filters.priceRange === '15to25' &&
          (p.price < 15000000 || p.price > 25000000)
        )
          return false;
        if (
          filters.priceRange === '25to35' &&
          (p.price < 25000000 || p.price > 35000000)
        )
          return false;
        if (filters.priceRange === 'above35' && p.price <= 35000000) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'name_asc') return a.name.localeCompare(b.name, 'vi');
        return b.created_at.localeCompare(a.created_at);
      });
  }, [activeProducts, filters]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(Math.max(1, filters.page), totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Page Title & Active Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Danh Sách Sản Phẩm Laptop Chính Hãng
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Tìm thấy <strong className="font-mono-tabular text-slate-900">{filteredProducts.length}</strong> sản phẩm khớp điều kiện truy vấn
          </p>
        </div>

        {/* Security Test Helper Button for SQLi Demonstration */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateFilters({
                keyword: "ASUS' OR '1'='1",
                page: 1,
              })
            }
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Thử nghiệm chuỗi SQLi: &apos; OR &apos;1&apos;=&apos;1
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Multi-Criteria Filter & Sort Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Keyword Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tìm theo tên laptop
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => onUpdateFilters({ keyword: e.target.value, page: 1 })}
                placeholder="Nhập tên laptop..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* CPU Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Vi xử lý (CPU)
            </label>
            <select
              value={filters.cpu}
              onChange={(e) => onUpdateFilters({ cpu: e.target.value, page: 1 })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="">Tất cả CPU</option>
              {cpuOptions.map((cpu) => (
                <option key={cpu} value={cpu}>
                  {cpu}
                </option>
              ))}
            </select>
          </div>

          {/* RAM Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Dung lượng RAM
            </label>
            <select
              value={filters.ram}
              onChange={(e) => onUpdateFilters({ ram: e.target.value, page: 1 })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="">Tất cả RAM</option>
              {ramOptions.map((ram) => (
                <option key={ram} value={ram}>
                  {ram}
                </option>
              ))}
            </select>
          </div>

          {/* SSD Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ổ cứng SSD
            </label>
            <select
              value={filters.ssd}
              onChange={(e) => onUpdateFilters({ ssd: e.target.value, page: 1 })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="">Tất cả SSD</option>
              {ssdOptions.map((ssd) => (
                <option key={ssd} value={ssd}>
                  {ssd}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Khoảng giá
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) =>
                onUpdateFilters({
                  priceRange: e.target.value as ProductFilterState['priceRange'],
                  page: 1,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under15">Dưới 15 triệu</option>
              <option value="15to25">Từ 15 – 25 triệu</option>
              <option value="25to35">Từ 25 – 35 triệu</option>
              <option value="above35">Trên 35 triệu</option>
            </select>
          </div>
        </div>

        {/* Bottom Filter Row: Stock Checkbox & Sort Order */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                onUpdateFilters({ inStockOnly: e.target.checked, page: 1 })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Chỉ hiển thị sản phẩm đang còn hàng trong kho (stock &gt; 0)</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Sắp xếp theo:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {[
                { id: 'newest', label: 'Mới nhất' },
                { id: 'price_asc', label: 'Giá tăng dần' },
                { id: 'price_desc', label: 'Giá giảm dần' },
                { id: 'name_asc', label: 'Tên A–Z' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    onUpdateFilters({
                      sortBy: s.id as ProductFilterState['sortBy'],
                      page: 1,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filters.sortBy === s.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">
            Không tìm thấy sản phẩm laptop phù hợp
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Từ khóa <span className="font-mono text-slate-800">&quot;{filters.keyword}&quot;</span> hoặc tổ hợp bộ lọc hiện tại không khớp với bản ghi nào trong bảng <code className="font-mono">products</code>.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Xóa bộ lọc để xem toàn bộ laptop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-600 tabular-nums">
            Trang {safePage} / {totalPages} (Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} laptop)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => onUpdateFilters({ page: safePage - 1 })}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Trước</span>
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => onUpdateFilters({ page: pageNum })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg tabular-nums cursor-pointer ${
                  pageNum === safePage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => onUpdateFilters({ page: safePage + 1 })}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Sau</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. PRODUCT DETAIL VIEW (Trang Chi Tiết Sản Phẩm — Contiguous Purchase Module)
// ============================================================================
interface ProductDetailViewProps {
  product: Product | undefined;
  onBackToCatalog: () => void;
  onAddToCart: (productId: number, qty: number) => void;
  onSelectInvalidIdDemo: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBackToCatalog,
  onAddToCart,
  onSelectInvalidIdDemo,
}) => {
  const [buyQty, setBuyQty] = useState(1);

  // Handle invalid product ID or deactivated product gracefully (Requirement 4.1)
  if (!product || product.is_active === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">
            Sản phẩm không tồn tại hoặc đã ngừng kinh doanh
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Hệ thống đã kiểm tra tham số <code className="font-mono">id</code> bằng PDO Prepared Statement và chặn truy cập sản phẩm không hợp lệ mà không phát sinh lỗi hệ thống PHP.
          </p>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Quay lại danh sách laptop
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const maxBuyable = Math.max(0, product.stock);
  const clampedQty = isOutOfStock ? 0 : Math.min(Math.max(1, buyQty), maxBuyable);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Top Breadcrumb & Invalid ID Test Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại Danh sách sản phẩm</span>
        </button>

        <button
          type="button"
          onClick={onSelectInvalidIdDemo}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          Kiểm thử truy cập ID không hợp lệ (?id=9999)
        </button>
      </div>

      {/* Contiguous 2-Column Purchase Module */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Studio Image */}
        <div className="lg:col-span-6 space-y-3">
          <div className="aspect-4/3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono-tabular">
            <span>Mã SP: #{product.id}</span>
            <span>Cập nhật: {formatDateTimeVN(product.updated_at)}</span>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-red-600 font-mono-tabular">
                {formatVND(product.price)}
              </span>
              <span className="text-xs text-slate-500">Đã bao gồm VAT 10%</span>
            </div>
          </div>

          {/* Hardware Specification Table */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-sm">
            <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/70">
              <span className="text-slate-500 font-medium">Bộ vi xử lý (CPU)</span>
              <span className="col-span-2 font-semibold text-slate-900 font-mono-tabular">
                {product.cpu}
              </span>
            </div>
            <div className="grid grid-cols-3 px-4 py-2.5">
              <span className="text-slate-500 font-medium">Dung lượng RAM</span>
              <span className="col-span-2 font-semibold text-slate-900 font-mono-tabular">
                {product.ram}
              </span>
            </div>
            <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/70">
              <span className="text-slate-500 font-medium">Ổ cứng lưu trữ (SSD)</span>
              <span className="col-span-2 font-semibold text-slate-900 font-mono-tabular">
                {product.ssd} NVMe PCIe
              </span>
            </div>
            <div className="grid grid-cols-3 px-4 py-2.5">
              <span className="text-slate-500 font-medium">Tình trạng tồn kho</span>
              <span
                className={`col-span-2 font-semibold font-mono-tabular ${
                  isOutOfStock ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {isOutOfStock
                  ? 'Hết hàng (0 máy trong kho)'
                  : `Còn hàng (${product.stock} máy sẵn sàng giao)`}
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1.5">
              Mô tả chi tiết sản phẩm
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Picker & Add to Cart Action */}
          {isOutOfStock ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <span>
                Sản phẩm này hiện đang <strong>Tạm hết hàng (stock = 0)</strong>. Hệ thống đã khóa chức năng thêm vào giỏ hàng theo đúng quy tắc kiểm soát tồn kho.
              </span>
            </div>
          ) : (
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Số lượng mua:
                </span>
                <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold font-mono-tabular text-slate-900">
                    {clampedQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBuyQty((q) => Math.min(maxBuyable, q + 1))}
                    className="p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  (Tối đa {maxBuyable} máy theo tồn kho)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(product.id, clampedQty)}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm vào giỏ hàng ({formatVND(product.price * clampedQty)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. CART VIEW (Trang Giỏ Hàng — PHP Session Cart Equivalent)
// ============================================================================
interface CartViewProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQty: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  products,
  onUpdateQty,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
}) => {
  const enrichedItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart, products]);

  const totalAmount = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.subtotal, 0),
    [enrichedItems]
  );

  const totalUnits = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.quantity, 0),
    [enrichedItems]
  );

  if (enrichedItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
          <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Hãy khám phá danh mục laptop chính hãng và thêm sản phẩm bạn yêu thích vào giỏ hàng.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Tiếp tục mua sắm laptop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Giỏ Hàng Của Bạn ({totalUnits} sản phẩm)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Đơn giá và số lượng tồn kho được đối chiếu trực tiếp từ bảng <code className="font-mono">products</code> trong CSDL MySQL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-200">
            {enrichedItems.map(({ product, quantity, subtotal }) => (
              <div
                key={product.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-18 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {product.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono-tabular mt-0.5">
                      {product.cpu} · {product.ram} · {product.ssd}
                    </p>
                    <p className="text-xs font-semibold text-red-600 font-mono-tabular mt-1">
                      Đơn giá: {formatVND(product.price)} · Tồn kho: {product.stock} máy
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, quantity - 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold font-mono-tabular text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(product.id, quantity + 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Subtotal */}
                  <div className="text-right min-w-[120px]">
                    <span className="block text-[11px] text-slate-400">Thành tiền</span>
                    <span className="text-sm font-bold text-slate-900 font-mono-tabular">
                      {formatVND(subtotal)}
                    </span>
                  </div>

                  {/* Remove Item */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Xóa sản phẩm khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary Box */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tổng số lượng máy:</span>
              <span className="font-semibold text-slate-900 font-mono-tabular">
                {totalUnits} chiếc
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển tiêu chuẩn:</span>
              <span className="font-semibold text-emerald-700">Miễn phí</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">Tổng tiền đơn hàng:</span>
              <span className="text-xl font-bold text-red-600 font-mono-tabular">
                {formatVND(totalAmount)}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tiến hành thanh toán
            </button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tiếp tục mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. SIMULATED CHECKOUT VIEW (Trang Thanh Toán Giả Lập + PDO Transaction)
// ============================================================================
interface CheckoutViewProps {
  cart: CartItem[];
  products: Product[];
  currentUser: User | null;
  onRequireLogin: () => void;
  onPlaceOrder: (payload: {
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    simulatedOnlineOutcome: 'success' | 'failed';
  }) => void;
  onBackToCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  products,
  currentUser,
  onRequireLogin,
  onPlaceOrder,
  onBackToCart,
}) => {
  const [receiverName, setReceiverName] = useState(currentUser?.full_name || '');
  const [receiverPhone, setReceiverPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [simulatedOnlineOutcome, setSimulatedOnlineOutcome] = useState<'success' | 'failed'>('success');
  const [formError, setFormError] = useState<string | null>(null);

  const enrichedItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart, products]);

  const serverCalculatedTotal = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.subtotal, 0),
    [enrichedItems]
  );

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
          <Lock className="w-10 h-10 text-blue-600 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">
            Vui lòng đăng nhập để tiến hành đặt hàng
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Theo quy trình bảo mật đơn hàng (Mục 4.8), hệ thống yêu cầu xác thực tài khoản người dùng trước khi khởi tạo giao dịch PDO Transaction.
          </p>
          <button
            type="button"
            onClick={onRequireLogin}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Đăng nhập hoặc Đăng ký ngay
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (receiverName.trim().length < 2) {
      setFormError('Vui lòng nhập họ tên người nhận hợp lệ.');
      return;
    }
    if (!/^0[0-9]{9,10}$/.test(receiverPhone.trim())) {
      setFormError('Số điện thoại người nhận phải bắt đầu bằng số 0 và gồm 10–11 chữ số.');
      return;
    }
    if (shippingAddress.trim().length < 10) {
      setFormError('Vui lòng nhập địa chỉ giao hàng chi tiết (tối thiểu 10 ký tự).');
      return;
    }

    onPlaceOrder({
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      simulatedOnlineOutcome,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Thanh Toán & Xác Nhận Đặt Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thực thi trong một giao dịch nguyên tử <code className="font-mono">PDO::beginTransaction()</code> — đọc lại giá bán và trừ tồn kho trực tiếp từ CSDL.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToCart}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Quay lại giỏ hàng
        </button>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Receiver Info & Simulated Payment Method */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4">
              1. Thông tin người nhận hàng
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Số điện thoại liên hệ (10–11 chữ số) *
                </label>
                <input
                  type="tel"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono-tabular focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-3">
              2. Phương thức thanh toán giả lập (Mục 4.8)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Lưu ý học thuật: Đây là luồng thanh toán mô phỏng phục vụ đồ án môn học, <strong>không phải giao dịch tài chính thật</strong>.
            </p>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Đơn hàng khởi tạo ở trạng thái <code className="font-mono">pending</code>, trạng thái thanh toán <code className="font-mono">unpaid</code>. Khách kiểm tra laptop trước khi thanh toán.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'online_sim'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'online_sim'}
                  onChange={() => setPaymentMethod('online_sim')}
                  className="mt-1 text-blue-600"
                />
                <div className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    Thanh toán trực tuyến giả lập (Online Gateway Simulator)
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Mô phỏng cổng thanh toán trực tuyến để kiểm thử cả hai nhánh: Giao dịch Thành công (Commit) và Giao dịch Thất bại (Rollback).
                  </span>

                  {paymentMethod === 'online_sim' && (
                    <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                      <span className="block text-xs font-semibold text-slate-800">
                        Chọn kết quả mô phỏng cổng thanh toán:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSimulatedOnlineOutcome('success')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                            simulatedOnlineOutcome === 'success'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Mô phỏng Thành công (Commit &amp; Trừ kho)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimulatedOnlineOutcome('failed')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                            simulatedOnlineOutcome === 'failed'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Mô phỏng Thất bại (Rollback &amp; Giữ nguyên kho)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Details & Server Price Verification */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
            Chi Tiết Sản Phẩm Đặt Mua
          </h2>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {enrichedItems.map(({ product, quantity, subtotal }) => (
              <div key={product.id} className="py-3 flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500 font-mono-tabular">
                    SL: {quantity} × {formatVND(product.price)}
                  </p>
                </div>
                <span className="font-bold text-slate-900 font-mono-tabular shrink-0">
                  {formatVND(subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">
                Tổng tiền tính tại máy chủ:
              </span>
              <span className="text-2xl font-bold text-red-600 font-mono-tabular">
                {formatVND(serverCalculatedTotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Bảo mật: Tổng tiền được tính lại ở phía máy chủ từ bảng <code className="font-mono">products</code>, bác bỏ mọi giá trị tổng tiền gửi từ trình duyệt.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Xác nhận đặt hàng ({formatVND(serverCalculatedTotal)})
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 6. ACCOUNT, AUTH & USER ORDER HISTORY VIEW (Trang Tài Khoản & Lịch Sử Đơn Hàng)
// ============================================================================
interface AccountViewProps {
  currentUser: User | null;
  users: User[];
  orders: Order[];
  lastCreatedOrderId: number | null;
  onLogin: (username: string, passwordPlain: string) => { ok: boolean; message: string };
  onRegister: (payload: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    passwordPlain: string;
    confirmPassword: string;
  }) => { ok: boolean; message: string };
  onLogout: () => void;
  onQuickSwitchUser: (username: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  orders,
  lastCreatedOrderId,
  onLogin,
  onRegister,
  onLogout,
  onQuickSwitchUser,
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter((o) => o.user_id === currentUser.id)
      .sort((a, b) => b.id - a.id);
  }, [currentUser, orders]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onLogin(loginUsername, loginPassword);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onRegister({
      username: regUsername,
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      passwordPlain: regPassword,
      confirmPassword: regConfirm,
    });
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const statusLabels: Record<Order['status'], string> = {
    pending: 'Chờ xác nhận (pending)',
    confirmed: 'Đã xác nhận (confirmed)',
    shipping: 'Đang giao hàng (shipping)',
    completed: 'Đã hoàn tất (completed)',
    cancelled: 'Đã hủy (cancelled)',
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
          {/* Mode Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setFeedback(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-md cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đăng nhập tài khoản
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setFeedback(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-md cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đăng ký tài khoản mới
              </button>
            </div>

            {/* Quick Demo Credentials */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Đăng nhập nhanh mẫu:</span>
              <button
                type="button"
                onClick={() => onQuickSwitchUser('nguyenvanan')}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-md hover:bg-blue-100 cursor-pointer"
              >
                User (nguyenvanan)
              </button>
              <button
                type="button"
                onClick={() => onQuickSwitchUser('admin')}
                className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 cursor-pointer"
              >
                Admin (admin)
              </button>
            </div>
          </div>

          {feedback && (
            <div
              className={`mt-5 p-4 rounded-lg text-sm flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{feedback.text}</span>
            </div>
          )}

          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Nhập admin hoặc nguyenvanan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Admin@123 hoặc User@123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername("admin' OR '1'='1");
                    setLoginPassword('123456');
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Điền thử chuỗi SQL Injection
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên đăng nhập (4–30 ký tự, không trùng) *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="sinhvien_cntt"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Họ và tên đầy đủ *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Phạm Minh Tuấn"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mật khẩu (tối thiểu 6 ký tự) *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  required
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sinhvien@university.edu.vn"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0909123456"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Địa chỉ mặc định
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Đăng ký tài khoản (Băm mật khẩu bằng password_hash)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {lastCreatedOrderId && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Đặt hàng thành công! Đơn hàng <strong className="font-mono-tabular">#{lastCreatedOrderId}</strong> đã được ghi nhận bằng PDO Transaction và trừ kho chính xác.
            </span>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Hồ sơ tài khoản đã xác thực Session
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentUser.full_name}
          </h1>
          <p className="text-xs text-slate-600 font-mono-tabular">
            Username: {currentUser.username} · Vai trò: {currentUser.role.toUpperCase()} · Email: {currentUser.email || 'Chưa cập nhật'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono truncate max-w-xl">
            Bcrypt Hash trong CSDL: {currentUser.password_hash}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất &amp; Hủy Session</span>
          </button>
        </div>
      </div>

      {/* User Order History */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lịch Sử Đơn Hàng Của Tôi ({myOrders.length} đơn)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chỉ hiển thị các đơn hàng có <code className="font-mono">user_id = {currentUser.id}</code>. Đơn giá lưu cố định tại thời điểm đặt mua.
            </p>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Tài khoản của bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Ngày đặt</th>
                  <th className="py-3 px-4">Người nhận</th>
                  <th className="py-3 px-4">Thanh toán</th>
                  <th className="py-3 px-4">Trạng thái đơn</th>
                  <th className="py-3 px-4 text-right">Tổng tiền</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {myOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold font-mono-tabular text-slate-900">
                      #{order.id}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-mono-tabular">
                      {formatDateTimeVN(order.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">{order.receiver_name}</span>
                      <span className="block text-slate-500 font-mono-tabular">{order.receiver_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {order.payment_method === 'cod' ? 'COD' : 'Online Giả lập'} ·{' '}
                      <span
                        className={
                          order.payment_status === 'paid'
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                      {statusLabels[order.status]}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-red-600 font-mono-tabular">
                      {formatVND(order.total_price)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail View Section */}
      {selectedOrder && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Chi Tiết Đơn Hàng #{selectedOrder.id}
              </h3>
              <p className="text-xs text-slate-500">
                Địa chỉ giao: {selectedOrder.shipping_address}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Đóng chi tiết ✕
            </button>
          </div>

          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-2">Sản phẩm tại thời điểm mua (order_details)</th>
                <th className="py-2 text-right">Đơn giá lịch sử</th>
                <th className="py-2 text-right">Số lượng</th>
                <th className="py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedOrder.details.map((d) => (
                <tr key={d.id}>
                  <td className="py-2.5 font-medium text-slate-900">{d.product_name}</td>
                  <td className="py-2.5 text-right font-mono-tabular">{formatVND(d.unit_price)}</td>
                  <td className="py-2.5 text-right font-mono-tabular">{d.quantity}</td>
                  <td className="py-2.5 text-right font-bold font-mono-tabular text-slate-900">
                    {formatVND(d.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
