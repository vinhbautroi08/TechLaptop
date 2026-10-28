export type UserRole = 'admin' | 'user';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export type PaymentMethod = 'cod' | 'online_sim';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'Văn phòng & Sinh viên' | 'Ultrabook & Đồ họa' | 'Gaming & Workstation';
  cpu: string;
  ram: string;
  ssd: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  is_active: number; // 1 = Đang kinh doanh, 0 = Ngừng kinh doanh
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  details: OrderDetail[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface ProductFilterState {
  keyword: string;
  cpu: string;
  ram: string;
  ssd: string;
  priceRange: 'all' | 'under15' | '15to25' | '25to35' | 'above35';
  inStockOnly: boolean;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  page: number;
}

export interface PhpSourceFile {
  path: string;
  folder: 'root' | 'config' | 'includes' | 'actions' | 'admin' | 'assets' | 'sql';
  title: string;
  description: string;
  language: 'php' | 'sql' | 'css' | 'javascript' | 'markdown';
  code: string;
}

export interface ReportChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    diagramTitle?: string;
    mermaidCode?: string;
    codeSnippetTitle?: string;
    codeSnippet?: string;
  }[];
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  visualSuggestion: string;
  speakerNotes: string;
}

export interface TestCaseItem {
  id: string;
  module: string;
  scenario: string;
  inputData: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'SECURITY_VERIFIED';
}

export interface TeamMemberRole {
  memberNumber: number;
  roleTitle: string;
  responsibilities: string[];
  deliverables: string[];
  filesOwned: string[];
}

export interface DemoScriptStep {
  minuteRange: string;
  phaseTitle: string;
  actor: 'Khách / User' | 'Admin' | 'Hệ thống';
  actions: string[];
  talkingPoints: string;
}
