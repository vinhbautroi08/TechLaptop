import React, { useState, useMemo } from 'react';
import {
  FileCode2,
  BookOpen,
  Presentation,
  CheckSquare,
  Users,
  Copy,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Database,
} from 'lucide-react';
import { PHP_SOURCE_FILES } from '../data/phpSourceCode';
import { EXTRA_PHP_SOURCE_FILES } from '../data/phpMoreFiles';
import {
  ACADEMIC_REPORT_CHAPTERS,
  PRESENTATION_SLIDES,
  TEST_CASES_MATRIX,
  TEAM_WORK_BREAKDOWN,
  DEMO_SCRIPT_STEPS,
} from '../data/academicDeliverables';

export const DeliverablesHub: React.FC = () => {
  const allPhpFiles = useMemo(
    () => [...PHP_SOURCE_FILES, ...EXTRA_PHP_SOURCE_FILES],
    []
  );

  const [hubTab, setHubTab] = useState<
    'source' | 'report' | 'slides' | 'testing' | 'demo_team'
  >('source');
  const [selectedFilePath, setSelectedFilePath] = useState<string>(allPhpFiles[0].path);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    ACADEMIC_REPORT_CHAPTERS[0].id
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentFile =
    allPhpFiles.find((f) => f.path === selectedFilePath) || allPhpFiles[0];
  const currentChapter =
    ACADEMIC_REPORT_CHAPTERS.find((c) => c.id === selectedChapterId) ||
    ACADEMIC_REPORT_CHAPTERS[0];
  const currentSlide = PRESENTATION_SLIDES[activeSlideIndex] || PRESENTATION_SLIDES[0];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\//g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullBundleMarkdown = () => {
    const sourceSection = allPhpFiles
      .map(
        (f) =>
          `## TỆP: laptop-store/${f.path}\nMô tả: ${f.description}\n\n\`\`\`${f.language}\n${f.code}\n\`\`\`\n`
      )
      .join('\n---\n\n');

    const reportSection = ACADEMIC_REPORT_CHAPTERS.map(
      (ch) =>
        `# ${ch.title}\n\n${ch.sections
          .map(
            (s) =>
              `## ${s.heading}\n\n${s.content}${
                s.mermaidCode ? `\n\n\`\`\`mermaid\n${s.mermaidCode}\n\`\`\`` : ''
              }${s.codeSnippet ? `\n\n\`\`\`php\n${s.codeSnippet}\n\`\`\`` : ''}`
          )
          .join('\n\n')}`
    ).join('\n\n---\n\n');

    const bundle = `# TRỌN BỘ HỒ SƠ ĐỒ ÁN: ĐỀ TÀI 4 — WEBSITE BÁN LAPTOP NÂNG CAO (TECHLAPTOP)\n\n${sourceSection}\n\n====================================================================\n\n${reportSection}`;
    handleDownloadFile('TechLaptop_TronBo_MaNguon_PHP_MySQL_Va_BaoCao.md', bundle);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Trung Tâm Bàn Giao Đồ Án Môn Học (Mục 9 – Mục 13)
          </p>
          <h1 className="text-2xl font-bold mt-0.5">
            Mã Nguồn PHP 8.1 / MySQL 8.0, Báo Cáo 7 Chương, 12 Slide &amp; Kiểm Thử
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Toàn bộ tệp mã nguồn PHP thuần (PDO, Session, CSRF, finfo), kịch bản <code className="font-mono">database.sql</code> và tài liệu báo cáo để sao chép hoặc tải về chạy trên XAMPP.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadFullBundleMarkdown}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Tải trọn bộ Code PHP/SQL &amp; Báo cáo (.MD)</span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl">
        {[
          { id: 'source', label: `1. Mã nguồn PHP & database.sql (${allPhpFiles.length} tệp)` },
          { id: 'report', label: '2. Báo cáo Đồ án (7 Chương + Mermaid)' },
          { id: 'slides', label: '3. Slide Thuyết trình (12 Slide + Lời nói)' },
          { id: 'testing', label: `4. Bảng Kiểm thử (${TEST_CASES_MATRIX.length} Test Cases)` },
          { id: 'demo_team', label: '5. Kịch bản Demo 7 Phút & Phân công Nhóm 4' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setHubTab(tab.id as typeof hubTab)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              hubTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          1. PHP 8.1 & MYSQL SOURCE CODE EXPLORER
         ===================================================================== */}
      {hubTab === 'source' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left File Tree */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              Cấu trúc thư mục laptop-store/
            </div>
            <div className="divide-y divide-slate-100">
              {allPhpFiles.map((file) => {
                const isSelected = file.path === currentFile.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-4 py-3 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/90 text-blue-800 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-mono truncate">
                        laptop-store/{file.path}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {file.title.split('—')[1] || file.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 shrink-0">
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Code Viewer */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-mono">
                  laptop-store/{currentFile.path}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentFile.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyText(currentFile.code, currentFile.path)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === currentFile.path ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép code</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(currentFile.path, currentFile.code)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp</span>
                </button>
              </div>
            </div>

            <pre className="p-5 bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed max-h-[640px]">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. 7-CHAPTER ACADEMIC REPORT VIEWER
         ===================================================================== */}
      {hubTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter Selector */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              Mục lục Báo cáo Đồ án (7 Chương)
            </div>
            <div className="divide-y divide-slate-100">
              {ACADEMIC_REPORT_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                    ch.id === currentChapter.id
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{ch.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {ch.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Content */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {currentChapter.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {currentChapter.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    currentChapter.sections
                      .map((s) => `${s.heading}\n\n${s.content}`)
                      .join('\n\n'),
                    currentChapter.id
                  )
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg shrink-0 cursor-pointer"
              >
                {copiedId === currentChapter.id ? 'Đã chép chương này' : 'Sao chép sang Word'}
              </button>
            </div>

            <div className="space-y-6">
              {currentChapter.sections.map((sec) => (
                <div key={sec.heading} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {sec.heading}
                  </h3>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </div>

                  {sec.mermaidCode && (
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
                        <span>{sec.diagramTitle || 'Sơ đồ hệ thống (Mermaid)'}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(sec.mermaidCode!, sec.heading)}
                          className="text-xs underline cursor-pointer"
                        >
                          Sao chép mã Mermaid
                        </button>
                      </div>
                      <pre className="text-xs font-mono overflow-x-auto text-emerald-300">
                        <code>{sec.mermaidCode}</code>
                      </pre>
                    </div>
                  )}

                  {sec.codeSnippet && (
                    <div className="bg-slate-950 text-slate-100 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-blue-400">
                        {sec.codeSnippetTitle}
                      </p>
                      <pre className="text-xs font-mono overflow-x-auto">
                        <code>{sec.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. 12-SLIDE PRESENTATION DECK & SPEAKER NOTES
         ===================================================================== */}
      {hubTab === 'slides' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Slide Visual Canvas */}
            <div className="lg:col-span-8 bg-slate-900 text-white rounded-xl p-8 flex flex-col justify-between min-h-[420px] border border-slate-800">
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-blue-400 font-mono-tabular">
                  <span>TECHLAPTOP — BẢO VỆ ĐỒ ÁN MÔN HỌC</span>
                  <span>
                    SLIDE {currentSlide.slideNumber} / {PRESENTATION_SLIDES.length}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {currentSlide.title}
                  </h2>
                  <p className="text-sm text-blue-300 mt-1.5 font-medium">
                    {currentSlide.subtitle}
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  {currentSlide.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm sm:text-base text-slate-200"
                    >
                      <span className="font-mono text-blue-400 font-bold">
                        0{i + 1}.
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  <strong>Gợi ý hình minh họa trên Slide:</strong>{' '}
                  {currentSlide.visualSuggestion}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    ← Slide trước
                  </button>
                  <button
                    type="button"
                    disabled={activeSlideIndex === PRESENTATION_SLIDES.length - 1}
                    onClick={() =>
                      setActiveSlideIndex((i) =>
                        Math.min(PRESENTATION_SLIDES.length - 1, i + 1)
                      )
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Slide tiếp →
                  </button>
                </div>
              </div>
            </div>

            {/* Speaker Notes Panel */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Lời thuyết trình gợi ý (Speaker Notes)
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Slide {currentSlide.slideNumber}: {currentSlide.title}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  &ldquo;{currentSlide.speakerNotes}&rdquo;
                </p>
              </div>

              {/* Quick Slide Jump Grid */}
              <div className="pt-4 border-t border-slate-200">
                <span className="block text-xs font-medium text-slate-500 mb-2">
                  Chuyển nhanh tới Slide:
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {PRESENTATION_SLIDES.map((s, idx) => (
                    <button
                      key={s.slideNumber}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`py-1.5 text-xs font-bold font-mono-tabular rounded cursor-pointer ${
                        idx === activeSlideIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {s.slideNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. FUNCTIONAL & SECURITY TEST MATRIX
         ===================================================================== */}
      {hubTab === 'testing' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bảng Kiểm Thử Chức Năng &amp; Bảo Mật (Chương 6 — {TEST_CASES_MATRIX.length} Kịch Bản)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bao gồm kiểm thử Đăng nhập, Phân quyền RBAC, CRUD, Tìm kiếm, Giỏ hàng, Đặt hàng Transaction, Upload ảnh và chống SQL Injection / XSS / CSRF.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-3">Mã KT</th>
                  <th className="py-3 px-3">Phân hệ</th>
                  <th className="py-3 px-3">Tình huống &amp; Dữ liệu đầu vào</th>
                  <th className="py-3 px-3">Các bước thực hiện</th>
                  <th className="py-3 px-3">Kết quả mong đợi</th>
                  <th className="py-3 px-3">Kết quả thực tế</th>
                  <th className="py-3 px-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEST_CASES_MATRIX.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/70 align-top">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {tc.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {tc.module}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{tc.scenario}</p>
                      <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                        Input: {tc.inputData}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{tc.steps}</td>
                    <td className="py-3 px-3 text-slate-700">{tc.expectedResult}</td>
                    <td className="py-3 px-3 text-slate-700">{tc.actualResult}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                      <span className="text-emerald-700">{tc.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. 7-MINUTE DEMO SCRIPT & 4-MEMBER TEAM WORK BREAKDOWN
         ===================================================================== */}
      {hubTab === 'demo_team' && (
        <div className="space-y-8">
          {/* 7-Minute Demo Script */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Kịch Bản Trình Diễn Demo Bảo Vệ Đồ Án (5 – 7 Phút)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lộ trình demo mạch lạc giúp giảng viên quan sát đầy đủ luồng mua sắm User, luồng quản trị Admin và cơ chế bảo mật.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {DEMO_SCRIPT_STEPS.map((step) => (
                <div
                  key={step.phaseTitle}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-tabular">
                      <span className="font-bold text-blue-700">{step.minuteRange}</span>
                      <span className="text-slate-500 font-semibold">{step.actor}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.phaseTitle}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                      {step.actions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[11px] text-slate-600 italic pt-3 border-t border-slate-200">
                    &ldquo;{step.talkingPoints}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Member Team Work Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Bảng Phân Chia Công Việc Nhóm 4 Thành Viên (Mục 11)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Phân bổ đồng đều khối lượng phân tích CSDL, giao diện sản phẩm, nghiệp vụ giỏ hàng/checkout và quản trị Admin/bảo mật.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEAM_WORK_BREAKDOWN.map((member) => (
                <div
                  key={member.memberNumber}
                  className="border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <h3 className="text-base font-bold text-slate-900">
                    {member.roleTitle}
                  </h3>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      Nhiệm vụ phụ trách:
                    </span>
                    <ul className="mt-1 space-y-1 text-xs text-slate-700 list-disc pl-4">
                      {member.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">Tệp mã nguồn chính:</span>
                    <span className="font-mono text-blue-700 font-medium">
                      {member.filesOwned.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
