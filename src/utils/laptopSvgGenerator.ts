// Công cụ định dạng tiền tệ VND và tạo hình ảnh Studio SVG độ phân giải cao cho từng mẫu laptop

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}

export function formatDateTimeVN(isoOrSqlDate: string): string {
  const d = new Date(isoOrSqlDate.replace(' ', 'T'));
  if (isNaN(d.getTime())) return isoOrSqlDate;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export type LaptopVisualTheme =
  | 'ultrabook-silver'
  | 'macbook-midnight'
  | 'gaming-rog'
  | 'gaming-legion'
  | 'creator-oled'
  | 'business-slate';

export function createLaptopStudioSvg(
  brand: string,
  modelShort: string,
  specBadge: string,
  theme: LaptopVisualTheme
): string {
  const palettes: Record<
    LaptopVisualTheme,
    {
      bgTop: string;
      bgBottom: string;
      chassisLight: string;
      chassisDark: string;
      screenTop: string;
      screenBottom: string;
      accent: string;
      glow: string;
      keyLight: string;
    }
  > = {
    'ultrabook-silver': {
      bgTop: '#F8FAFC',
      bgBottom: '#E2E8F0',
      chassisLight: '#E2E8F0',
      chassisDark: '#94A3B8',
      screenTop: '#0F172A',
      screenBottom: '#1E3A8A',
      accent: '#38BDF8',
      glow: '#2563EB',
      keyLight: '#CBD5E1',
    },
    'macbook-midnight': {
      bgTop: '#F1F5F9',
      bgBottom: '#CBD5E1',
      chassisLight: '#334155',
      chassisDark: '#0F172A',
      screenTop: '#090D16',
      screenBottom: '#1E293B',
      accent: '#60A5FA',
      glow: '#3B82F6',
      keyLight: '#475569',
    },
    'gaming-rog': {
      bgTop: '#0F172A',
      bgBottom: '#1E293B',
      chassisLight: '#334155',
      chassisDark: '#090D16',
      screenTop: '#111827',
      screenBottom: '#1E1B4B',
      accent: '#EF4444',
      glow: '#3B82F6',
      keyLight: '#EF4444',
    },
    'gaming-legion': {
      bgTop: '#1E293B',
      bgBottom: '#0F172A',
      chassisLight: '#475569',
      chassisDark: '#1E293B',
      screenTop: '#0F172A',
      screenBottom: '#172554',
      accent: '#38BDF8',
      glow: '#0284C7',
      keyLight: '#38BDF8',
    },
    'creator-oled': {
      bgTop: '#F8FAFC',
      bgBottom: '#E2E8F0',
      chassisLight: '#475569',
      chassisDark: '#1E293B',
      screenTop: '#1E1B4B',
      screenBottom: '#0F172A',
      accent: '#F59E0B',
      glow: '#2563EB',
      keyLight: '#94A3B8',
    },
    'business-slate': {
      bgTop: '#F8FAFC',
      bgBottom: '#F1F5F9',
      chassisLight: '#CBD5E1',
      chassisDark: '#64748B',
      screenTop: '#0F172A',
      screenBottom: '#1E3A8A',
      accent: '#2563EB',
      glow: '#1D4ED8',
      keyLight: '#94A3B8',
    },
  };

  const p = palettes[theme];
  const isDarkStudio = theme === 'gaming-rog' || theme === 'gaming-legion';
  const textColor = isDarkStudio ? '#F8FAFC' : '#0F172A';
  const subTextColor = isDarkStudio ? '#94A3B8' : '#475569';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.bgTop}"/>
        <stop offset="100%" stop-color="${p.bgBottom}"/>
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.screenTop}"/>
        <stop offset="55%" stop-color="${p.screenBottom}"/>
        <stop offset="100%" stop-color="#090D16"/>
      </linearGradient>
      <linearGradient id="chassisGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${p.chassisDark}"/>
        <stop offset="20%" stop-color="${p.chassisLight}"/>
        <stop offset="80%" stop-color="${p.chassisLight}"/>
        <stop offset="100%" stop-color="${p.chassisDark}"/>
      </linearGradient>
      <radialGradient id="ambientGlow" cx="50%" cy="45%" r="45%">
        <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.26"/>
        <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
      </radialGradient>
      <filter id="dropShadow" x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#020617" flood-opacity="0.28"/>
      </filter>
    </defs>

    <!-- Studio Backdrop -->
    <rect width="800" height="600" fill="url(#bgGrad)"/>
    <circle cx="400" cy="270" r="290" fill="url(#ambientGlow)"/>

    <!-- Studio Pedestal Line -->
    <line x1="60" y1="490" x2="740" y2="490" stroke="${subTextColor}" stroke-opacity="0.18" stroke-width="1.5"/>

    <!-- Top Brand & Spec Header in Studio Frame -->
    <text x="56" y="58" font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="700" fill="${textColor}" opacity="0.85" letter-spacing="1.5">${brand.toUpperCase()}</text>
    <text x="744" y="58" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" font-weight="600" fill="${subTextColor}">${specBadge}</text>

    <!-- Laptop Assembly with Shadow -->
    <g filter="url(#dropShadow)">
      <!-- Outer Display Lid / Bezel -->
      <rect x="175" y="105" width="450" height="295" rx="14" fill="#090D16" stroke="${p.chassisLight}" stroke-width="2.5"/>
      <!-- Camera Notch / Bezel Sensor -->
      <rect x="372" y="106" width="56" height="8" rx="3" fill="#020617"/>
      <circle cx="400" cy="110" r="2" fill="#38BDF8"/>

      <!-- Active Display Screen -->
      <rect x="187" y="118" width="426" height="266" rx="6" fill="url(#screenGrad)"/>

      <!-- Screen Geometric Art / Wallpaper -->
      <circle cx="490" cy="210" r="95" fill="${p.accent}" opacity="0.18"/>
      <circle cx="320" cy="275" r="115" fill="${p.glow}" opacity="0.22"/>
      <path d="M187 320 Q330 220 440 285 T613 225 L613 384 L187 384 Z" fill="${p.accent}" opacity="0.16"/>
      <path d="M187 350 Q360 270 490 315 T613 275 L613 384 L187 384 Z" fill="#FFFFFF" opacity="0.06"/>

      <!-- Screen Spec Overlay -->
      <text x="215" y="162" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="${p.accent}" letter-spacing="1">TECHLAPTOP CERTIFIED HARDWARE</text>
      <text x="215" y="196" font-family="Be Vietnam Pro, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">${modelShort}</text>
      <text x="215" y="222" font-family="JetBrains Mono, monospace" font-size="12" fill="#CBD5E1">${specBadge}</text>

      <!-- Glossy Screen Reflection Diagonal -->
      <polygon points="187,118 355,118 245,384 187,384" fill="#FFFFFF" opacity="0.04"/>

      <!-- Hinge Mechanism -->
      <rect x="255" y="398" width="290" height="7" rx="2" fill="#0F172A"/>

      <!-- Perspective Keyboard Deck / Base -->
      <polygon points="175,404 625,404 695,462 105,462" fill="url(#chassisGrad)" stroke="${p.chassisDark}" stroke-width="1"/>

      <!-- Keyboard Recessed Well -->
      <polygon points="192,411 608,411 642,442 158,442" fill="#0F172A" stroke="${p.keyLight}" stroke-opacity="0.45" stroke-width="1"/>

      <!-- Precision Keycap Rows -->
      <line x1="184" y1="418" x2="616" y2="418" stroke="${p.keyLight}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="14 4"/>
      <line x1="176" y1="425" x2="624" y2="425" stroke="${p.keyLight}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="15 4"/>
      <line x1="168" y1="432" x2="632" y2="432" stroke="${p.keyLight}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="16 4"/>
      <line x1="162" y1="438" x2="638" y2="438" stroke="${p.keyLight}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="22 5"/>

      <!-- Precision Glass Trackpad -->
      <polygon points="348,445 452,445 462,459 338,459" fill="${p.chassisDark}" fill-opacity="0.35" stroke="${p.chassisDark}" stroke-width="0.8"/>

      <!-- Front Lip Base & Thumb Notch -->
      <rect x="105" y="462" width="590" height="12" rx="5" fill="url(#chassisGrad)"/>
      <rect x="362" y="462" width="76" height="5" rx="2.5" fill="#1E293B"/>
    </g>

    <!-- Bottom Caption -->
    <text x="400" y="542" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="600" fill="${textColor}" opacity="0.75">Chính hãng 100% · Bảo hành 24 tháng · Đổi mới 30 ngày</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
