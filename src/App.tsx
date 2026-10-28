import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  Product,
  User,
  Order,
  CartItem,
  ProductFilterState,
  PaymentMethod,
  OrderStatus,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
} from './data/initialDatabase';
import { Navbar, ActivePage } from './components/Navbar';
import {
  HomeView,
  ProductCatalogView,
  ProductDetailView,
  CartView,
  CheckoutView,
  AccountView,
} from './components/StorefrontViews';
import { AdminWorkspace } from './components/AdminWorkspace';
import { DeliverablesHub } from './components/DeliverablesHub';

const STORAGE_KEYS = {
  PRODUCTS: 'techlaptop_db_products_v1',
  USERS: 'techlaptop_db_users_v1',
  ORDERS: 'techlaptop_db_orders_v1',
  CART: 'techlaptop_session_cart_v1',
  CURRENT_USER: 'techlaptop_session_user_v1',
};

const DEFAULT_FILTERS: ProductFilterState = {
  keyword: '',
  cpu: '',
  ram: '',
  ssd: '',
  priceRange: 'all',
  inStockOnly: false,
  sortBy: 'newest',
  page: 1,
};

export default function App() {
  // Relational Database State (products, users, orders)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Session State (cart & currentUser)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [{ productId: 1, quantity: 1 }];
    } catch {
      return [{ productId: 1, quantity: 1 }];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Mặc định đăng nhập sẵn nguyenvanan để tiện trải nghiệm
    } catch {
      return INITIAL_USERS[1];
    }
  });

  // Navigation & View State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_FILTERS);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<number | null>(null);
  const [flashMessage, setFlashMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {
      // Ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  const showFlash = (type: 'success' | 'error', text: string) => {
    setFlashMessage({ type, text });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // ============================================================================
  // NAVIGATION & FILTER HANDLERS
  // ============================================================================
  const handleNavigate = (page: ActivePage) => {
    setFlashMessage(null);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetail = (productId: number) => {
    setSelectedProductId(productId);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearchFromHero = (keyword: string, cpuFilter?: string) => {
    setFilters({
      ...DEFAULT_FILTERS,
      keyword,
      cpu: cpuFilter || '',
      page: 1,
    });
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // SESSION CART HANDLERS (Requirement 4.7: Validate stock from DB)
  // ============================================================================
  const handleAddToCart = (productId: number, qty: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.is_active !== 1) {
      showFlash('error', 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.');
      return;
    }
    if (qty <= 0) {
      showFlash('error', 'Số lượng sản phẩm thêm vào giỏ phải lớn hơn 0.');
      return;
    }

    const existing = cart.find((c) => c.productId === productId);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + qty;

    if (nextQty > product.stock) {
      showFlash(
        'error',
        `Không thể thêm vượt quá tồn kho! Mẫu "${product.name}" chỉ còn tối đa ${product.stock} máy trong kho.`
      );
      return;
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((c) =>
          c.productId === productId ? { ...c, quantity: nextQty } : c
        );
      }
      return [...prev, { productId, quantity: qty }];
    });

    showFlash(
      'success',
      `Đã thêm ${qty} chiếc "${product.name}" vào giỏ hàng Session.`
    );
  };

  const handleUpdateCartQty = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQty > product.stock) {
      showFlash(
        'error',
        `Số lượng yêu cầu (${newQty}) vượt quá số lượng tồn kho thực tế (${product.stock} máy) của "${product.name}".`
      );
      return;
    }

    setCart((prev) =>
      prev.map((c) => (c.productId === productId ? { ...c, quantity: newQty } : c))
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    showFlash('success', 'Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  // ============================================================================
  // AUTH & SESSION HANDLERS (Requirement 4.3 & 4.4)
  // ============================================================================
  const handleQuickSwitchUser = (username: string) => {
    const target = users.find((u) => u.username === username);
    if (target) {
      setCurrentUser(target);
      showFlash(
        'success',
        `Đã chuyển phiên làm việc (session_regenerate_id) sang tài khoản "${target.username}" (Vai trò: ${target.role.toUpperCase()}).`
      );
    }
  };

  const handleLogin = (
    username: string,
    passwordPlain: string
  ): { ok: boolean; message: string } => {
    const cleanUsername = username.trim();
    const user = users.find((u) => u.username === cleanUsername);

    // Block SQL injection or wrong credentials
    if (!user) {
      return {
        ok: false,
        message:
          'Tên đăng nhập hoặc mật khẩu không chính xác (Truy vấn PDO Prepared Statement đã chặn mọi chuỗi SQL Injection).',
      };
    }

    // Verify default demo passwords or newly registered user password
    const isAdminPassOk = user.username === 'admin' && passwordPlain === 'Admin@123';
    const isUserPassOk = user.role === 'user' && passwordPlain.length >= 6;

    if (!isAdminPassOk && !isUserPassOk) {
      return {
        ok: false,
        message:
          'Mật khẩu không khớp khi kiểm tra bằng password_verify(). Gợi ý demo: Admin@123 hoặc User@123.',
      };
    }

    setCurrentUser(user);
    return {
      ok: true,
      message: `Đăng nhập thành công! Đã gọi session_regenerate_id(true) cho tài khoản ${user.full_name}.`,
    };
  };

  const handleRegister = (payload: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    passwordPlain: string;
    confirmPassword: string;
  }): { ok: boolean; message: string } => {
    const uname = payload.username.trim();
    if (!/^[a-zA-Z0-9_]{4,30}$/.test(uname)) {
      return {
        ok: false,
        message:
          'Tên đăng nhập phải từ 4–30 ký tự và chỉ chứa chữ cái, chữ số hoặc dấu gạch dưới.',
      };
    }
    if (users.some((u) => u.username.toLowerCase() === uname.toLowerCase())) {
      return {
        ok: false,
        message: 'Tên đăng nhập này đã tồn tại trong CSDL. Vui lòng chọn tên khác.',
      };
    }
    if (payload.passwordPlain.length < 6) {
      return {
        ok: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
      };
    }
    if (payload.passwordPlain !== payload.confirmPassword) {
      return {
        ok: false,
        message: 'Mật khẩu xác nhận không khớp.',
      };
    }

    const simulatedBcryptHash = `$2y$10$${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}O0rOQ5byMi.Ye4oKoEa3Ro9llC`;

    const newUser: User = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      username: uname,
      password_hash: simulatedBcryptHash,
      role: 'user', // Không bao giờ cho phép tự đăng ký tài khoản Admin
      full_name: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return {
      ok: true,
      message: `Đăng ký tài khoản "${uname}" thành công! Mật khẩu đã được băm bằng password_hash().`,
    };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLastCreatedOrderId(null);
    showFlash('success', 'Đã đăng xuất và hủy Session thành công.');
  };

  // ============================================================================
  // SIMULATED CHECKOUT & PDO TRANSACTION ENGINE (Requirement 4.8)
  // ============================================================================
  const handlePlaceOrder = (payload: {
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    simulatedOnlineOutcome: 'success' | 'failed';
  }) => {
    if (!currentUser) {
      setActivePage('account');
      return;
    }

    if (cart.length === 0) {
      showFlash('error', 'Giỏ hàng rỗng, không thể tạo đơn hàng.');
      return;
    }

    // Check simulated online failure -> Rollback without touching stock or clearing cart
    if (
      payload.paymentMethod === 'online_sim' &&
      payload.simulatedOnlineOutcome === 'failed'
    ) {
      showFlash(
        'error',
        '[MÔ PHỎNG THANH TOÁN THẤT BẠI — PDO ROLLBACK] Giao dịch trực tuyến giả lập bị từ chối. Hệ thống đã gọi $pdo->rollBack(), giữ nguyên số lượng tồn kho và giỏ hàng.'
      );
      return;
    }

    // Re-read products from DB state & verify stock atomically
    let serverTotal = 0;
    const nextOrderId = Math.max(1000, ...orders.map((o) => o.id)) + 1;
    const orderDetails: Order['details'] = [];

    for (const item of cart) {
      const dbProduct = products.find((p) => p.id === item.productId);
      if (!dbProduct || dbProduct.is_active !== 1) {
        showFlash(
          'error',
          'Một sản phẩm trong giỏ hàng không tồn tại hoặc đã ngừng kinh doanh (Transaction Rollback).'
        );
        return;
      }
      if (dbProduct.stock < item.quantity) {
        showFlash(
          'error',
          `Sản phẩm "${dbProduct.name}" chỉ còn ${dbProduct.stock} máy trong kho (bạn đặt ${item.quantity}). Đã thực hiện Rollback.`
        );
        return;
      }

      const lineSubtotal = dbProduct.price * item.quantity;
      serverTotal += lineSubtotal;
      orderDetails.push({
        id: orderDetails.length + 1,
        order_id: nextOrderId,
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        unit_price: dbProduct.price,
        quantity: item.quantity,
        subtotal: lineSubtotal,
      });
    }

    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newOrder: Order = {
      id: nextOrderId,
      user_id: currentUser.id,
      total_price: serverTotal,
      status: payload.paymentMethod === 'online_sim' ? 'confirmed' : 'pending',
      payment_method: payload.paymentMethod,
      payment_status: payload.paymentMethod === 'online_sim' ? 'paid' : 'unpaid',
      receiver_name: payload.receiverName,
      receiver_phone: payload.receiverPhone,
      shipping_address: payload.shippingAddress,
      created_at: nowStr,
      updated_at: nowStr,
      details: orderDetails,
    };

    // Deduct stock atomically
    setProducts((prev) =>
      prev.map((p) => {
        const cartLine = cart.find((c) => c.productId === p.id);
        if (!cartLine) return p;
        return {
          ...p,
          stock: Math.max(0, p.stock - cartLine.quantity),
          updated_at: nowStr,
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setLastCreatedOrderId(nextOrderId);
    setActivePage('account');
    showFlash(
      'success',
      `[PDO COMMIT THÀNH CÔNG] Đã tạo đơn hàng #${nextOrderId}, lưu chi tiết giá bán lịch sử và trừ tồn kho chính xác!`
    );
  };

  // ============================================================================
  // ADMIN CRUD & ORDER MANAGEMENT HANDLERS (Requirements 4.5, 4.9, 4.10)
  // ============================================================================
  const handleSaveProduct = (
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
    editId?: number
  ): { ok: boolean; message: string } => {
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (editId !== undefined) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                ...productData,
                updated_at: nowStr,
              }
            : p
        )
      );
      return {
        ok: true,
        message: `Đã cập nhật thông tin laptop #${editId} ("${productData.name}"). Giá trong các đơn hàng lịch sử cũ vẫn được giữ nguyên độc lập.`,
      };
    }

    const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const newProduct: Product = {
      ...productData,
      id: nextId,
      created_at: nowStr,
      updated_at: nowStr,
    };

    setProducts((prev) => [newProduct, ...prev]);
    return {
      ok: true,
      message: `Đã thêm mới laptop "${newProduct.name}" (Mã #${nextId}) vào CSDL.`,
    };
  };

  const handleDeleteOrDeactivateProduct = (
    productId: number
  ): { ok: boolean; message: string } => {
    // Check if product is referenced in historical order_details
    const usedInOrdersCount = orders.filter((o) =>
      o.details.some((d) => d.product_id === productId)
    ).length;

    if (usedInOrdersCount > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, is_active: 0 } : p))
      );
      return {
        ok: true,
        message: `Bảo toàn khóa ngoại (ON DELETE RESTRICT): Sản phẩm #${productId} đã xuất hiện trong ${usedInOrdersCount} đơn hàng lịch sử nên được chuyển sang trạng thái "Ngừng kinh doanh (is_active = 0)" thay vì xóa vật lý.`,
      };
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    return {
      ok: true,
      message: `Sản phẩm #${productId} chưa phát sinh đơn hàng nào nên đã được xóa vật lý khỏi bảng products.`,
    };
  };

  const handleToggleProductActive = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, is_active: p.is_active === 1 ? 0 : 1 } : p
      )
    );
  };

  const handleUpdateOrderStatus = (
    orderId: number,
    newStatus: OrderStatus
  ): { ok: boolean; message: string } => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { ok: false, message: 'Không tìm thấy đơn hàng.' };
    }

    if (
      targetOrder.status === 'completed' ||
      targetOrder.status === 'cancelled'
    ) {
      return {
        ok: false,
        message: `Đơn hàng #${orderId} đã ở trạng thái kết thúc (${targetOrder.status}), không thể chuyển ngược trạng thái.`,
      };
    }

    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // If cancelled, restore stock to products
    if (newStatus === 'cancelled') {
      setProducts((prev) =>
        prev.map((p) => {
          const detailLine = targetOrder.details.find(
            (d) => d.product_id === p.id
          );
          if (!detailLine) return p;
          return {
            ...p,
            stock: p.stock + detailLine.quantity,
            updated_at: nowStr,
          };
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              payment_status:
                newStatus === 'completed'
                  ? 'paid'
                  : newStatus === 'cancelled' && o.payment_status === 'unpaid'
                  ? 'failed'
                  : o.payment_status,
              updated_at: nowStr,
            }
          : o
      )
    );

    if (newStatus === 'completed') {
      return {
        ok: true,
        message: `Đơn hàng #${orderId} đã chuyển sang "completed" (Đã hoàn tất). Giá trị đơn hàng đã được cộng vào Tổng doanh thu thực tế trên Dashboard!`,
      };
    }

    if (newStatus === 'cancelled') {
      return {
        ok: true,
        message: `Đơn hàng #${orderId} đã chuyển sang "cancelled". Hệ thống đã tự động hoàn lại số lượng tồn kho cho các sản phẩm trong đơn!`,
      };
    }

    return {
      ok: true,
      message: `Đã cập nhật trạng thái đơn hàng #${orderId} sang "${newStatus}".`,
    };
  };

  const handleResetDemoDatabase = () => {
    setProducts(INITIAL_PRODUCTS);
    setUsers(INITIAL_USERS);
    setOrders(INITIAL_ORDERS);
    setCart([{ productId: 1, quantity: 1 }]);
    setCurrentUser(INITIAL_USERS[1]);
    setFilters(DEFAULT_FILTERS);
    showFlash(
      'success',
      'Đã khôi phục toàn bộ cơ sở dữ liệu mẫu (15 laptop, 4 tài khoản, 8 đơn hàng) về trạng thái ban đầu.'
    );
  };

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top 3-Zone Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        currentUser={currentUser}
      />

      {/* Global Flash Message Banner */}
      {flashMessage && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-4">
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-4 ${
              flashMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {flashMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{flashMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFlashMessage(null)}
              className="text-xs font-semibold underline shrink-0 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            products={products}
            onViewDetail={handleViewProductDetail}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onQuickSearch={handleQuickSearchFromHero}
            currentUser={currentUser}
            onQuickSwitchUser={handleQuickSwitchUser}
          />
        )}

        {activePage === 'products' && (
          <ProductCatalogView
            products={products}
            filters={filters}
            onUpdateFilters={(partial) =>
              setFilters((prev) => ({ ...prev, ...partial }))
            }
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            onViewDetail={handleViewProductDetail}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            onBackToCatalog={() => handleNavigate('products')}
            onAddToCart={handleAddToCart}
            onSelectInvalidIdDemo={() => setSelectedProductId(9999)}
          />
        )}

        {activePage === 'cart' && (
          <CartView
            cart={cart}
            products={products}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onContinueShopping={() => handleNavigate('products')}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutView
            cart={cart}
            products={products}
            currentUser={currentUser}
            onRequireLogin={() => handleNavigate('account')}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => handleNavigate('cart')}
          />
        )}

        {activePage === 'account' && (
          <AccountView
            currentUser={currentUser}
            users={users}
            orders={orders}
            lastCreatedOrderId={lastCreatedOrderId}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onQuickSwitchUser={handleQuickSwitchUser}
          />
        )}

        {activePage === 'admin' && (
          <AdminWorkspace
            currentUser={currentUser}
            products={products}
            orders={orders}
            users={users}
            onSwitchToAdminDemo={() => handleQuickSwitchUser('admin')}
            onSaveProduct={handleSaveProduct}
            onDeleteOrDeactivateProduct={handleDeleteOrDeactivateProduct}
            onToggleProductActive={handleToggleProductActive}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activePage === 'deliverables' && <DeliverablesHub />}
      </main>

      {/* Clean Storefront & Academic Project Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2.5">
            <p className="text-base font-bold text-white">
              TechLaptop — Laptop Chính Hãng
            </p>
            <p className="leading-relaxed">
              Đề tài 4 — Website bán laptop nâng cao. Đồ án môn học ngành Công nghệ thông tin xây dựng với PHP 8.1+, MySQL 8.0 (PDO), Bootstrap 5 &amp; Chart.js.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider">
              Điều hướng cửa hàng
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="hover:text-white cursor-pointer"
                >
                  Trang chủ TechLaptop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('products')}
                  className="hover:text-white cursor-pointer"
                >
                  Danh sách &amp; Bộ lọc Laptop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('cart')}
                  className="hover:text-white cursor-pointer"
                >
                  Giỏ hàng ({cartCount} sản phẩm)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('account')}
                  className="hover:text-white cursor-pointer"
                >
                  Tài khoản &amp; Lịch sử đơn hàng
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider">
              Phân hệ Quản trị &amp; Đồ án
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('admin')}
                  className="hover:text-white cursor-pointer"
                >
                  Bảng điều khiển Admin &amp; Doanh thu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('deliverables')}
                  className="hover:text-white cursor-pointer"
                >
                  Mã nguồn PHP 8.1 &amp; database.sql
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigate('deliverables')}
                  className="hover:text-white cursor-pointer"
                >
                  Báo cáo 7 Chương, 12 Slide &amp; Kiểm thử
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="font-semibold text-white uppercase tracking-wider">
              Thông tin liên hệ &amp; Khôi phục dữ liệu mẫu
            </p>
            <p>Địa chỉ: 268 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh</p>
            <p>Hotline hỗ trợ kỹ thuật: 1900 6868 (08:00 – 21:00)</p>
            <button
              type="button"
              onClick={handleResetDemoDatabase}
              className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục CSDL mẫu ban đầu</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
