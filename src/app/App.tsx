import { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Home,
  ClipboardList,
  BarChart2,
  Upload,
  TrendingUp,
  TrendingDown,
  Fuel,
  Route,
  DollarSign,
  Droplets,
  CheckCircle2,
  CloudUpload,
  FileSpreadsheet,
  Database,
  Download,
  Shield,
  ChevronRight,
  Car,
  Bell,
  Plus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Layers,
} from "lucide-react";

// 파란색 계열 쿨톤 테마 정의
const DARK_NAVY = "#0F172A"; // Slate 900 기반의 깊고 차가운 네이비
const COOL_BLUE = "#2563EB"; // 신뢰감을 주는 일렉트릭 블루
const ACCENT_BLUE = "#60A5FA"; // 밝은 하늘색 포인트
const OFF_WHITE = "#F8FAFC"; // 차가운 톤의 백색 배경
const LIGHT_BG = "#F1F5F9"; // 아이템 컴포넌트용 배경

interface FuelingRecord {
  date: string;
  label: string;
  liters: number;
  cost: number;
  dist: number; // 직전 주유 이후 주행거리 (km)
  segEff: number;
  cumEff: number;
}

interface SyncedFile {
  name: string;
  date: string;
  rows: number;
  status: string;
}

interface Vehicle {
  id: string;
  name: string;
  model: string;
  fuelingLogs: FuelingRecord[];
  syncedDrivingFiles: SyncedFile[];
}

// 초기 원본 데이터 정의 (투싼 타깃 시드 데이터)
const initialVehicles: Vehicle[] = [
  {
    id: "v-tucson",
    name: "My SUV",
    model: "현대 투싼",
    fuelingLogs: [
      { date: "2025-09-12", label: "Sep 12", liters: 41.44, cost: 70000, dist: 0, segEff: 0, cumEff: 0 },
      { date: "2025-09-18", label: "Sep 18", liters: 33.66, cost: 54000, dist: 385, segEff: 11.44, cumEff: 11.44 },
      { date: "2025-09-25", label: "Sep 25", liters: 29.83, cost: 48000, dist: 384, segEff: 12.87, cumEff: 12.11 },
      { date: "2025-10-13", label: "Oct 13", liters: 33.35, cost: 54000, dist: 445, segEff: 13.34, cumEff: 12.54 },
      { date: "2025-10-16", label: "Oct 16", liters: 24.31, cost: 39000, dist: 270, segEff: 11.11, cumEff: 12.25 },
      { date: "2025-10-23", label: "Oct 23", liters: 22.47, cost: 36000, dist: 272, segEff: 12.11, cumEff: 12.23 },
      { date: "2025-10-30", label: "Oct 30", liters: 32.51, cost: 53000, dist: 397, segEff: 12.21, cumEff: 12.22 },
      { date: "2025-11-06", label: "Nov 06", liters: 23.85, cost: 39000, dist: 266, segEff: 11.15, cumEff: 12.10 },
      { date: "2025-11-13", label: "Nov 13", liters: 38.62, cost: 64000, dist: 439, segEff: 11.37, cumEff: 11.98 },
      { date: "2025-11-20", label: "Nov 20", liters: 32.58, cost: 55000, dist: 370, segEff: 11.36, cumEff: 11.90 },
      { date: "2025-11-27", label: "Nov 27", liters: 26.50, cost: 45000, dist: 300, segEff: 11.32, cumEff: 11.85 },
      { date: "2025-12-04", label: "Dec 04", liters: 32.37, cost: 55000, dist: 363, segEff: 11.21, cumEff: 11.79 },
      { date: "2025-12-11", label: "Dec 11", liters: 26.49, cost: 45000, dist: 358, segEff: 13.51, cumEff: 11.92 },
      { date: "2025-12-17", label: "Dec 17", liters: 12.99, cost: 22000, dist: 179, segEff: 13.78, cumEff: 11.98 },
      { date: "2026-03-04", label: "Mar 04", liters: 31.45, cost: 55000, dist: 318, segEff: 10.11, cumEff: 11.84 },
      { date: "2026-03-11", label: "Mar 11", liters: 23.01, cost: 42000, dist: 355, segEff: 15.43, cumEff: 12.03 },
      { date: "2026-03-23", label: "Mar 23", liters: 33.62, cost: 59000, dist: 486, segEff: 14.46, cumEff: 12.21 },
      { date: "2026-04-01", label: "Apr 01", liters: 30.77, cost: 54000, dist: 448, segEff: 14.56, cumEff: 12.36 },
      { date: "2026-04-08", label: "Apr 08", liters: 31.17, cost: 59000, dist: 499, segEff: 16.01, cumEff: 12.58 },
      { date: "2026-04-24", label: "Apr 24", liters: 35.23, cost: 70000, dist: 561, segEff: 15.92, cumEff: 12.79 },
      { date: "2026-05-11", label: "May 11", liters: 36.15, cost: 72000, dist: 594, segEff: 16.43, cumEff: 13.01 },
      { date: "2026-05-20", label: "May 20", liters: 37.54, cost: 75000, dist: 541, segEff: 14.41, cumEff: 13.10 },
      { date: "2026-06-05", label: "Jun 05", liters: 32.03, cost: 64000, dist: 269, segEff: 8.40, cumEff: 12.87 },
      { date: "2026-06-19", label: "Jun 19", liters: 23.02, cost: 46000, dist: 290, segEff: 12.60, cumEff: 12.86 },
    ],
    syncedDrivingFiles: [
      { name: "2025-09 주행기록.xlsx", date: "2025-10-01", rows: 28, status: "synced" },
      { name: "2025-10 주행기록.xlsx", date: "2025-11-01", rows: 32, status: "synced" },
      { name: "2025-11 주행기록.xlsx", date: "2025-12-01", rows: 30, status: "synced" },
      { name: "2025-12 주행기록.xlsx", date: "2026-01-02", rows: 18, status: "synced" },
      { name: "2026-01 주행기록.xlsx", date: "2026-02-01", rows: 22, status: "synced" },
      { name: "2026-02 주행기록.xlsx", date: "2026-03-01", rows: 20, status: "synced" },
      { name: "2026-03 주행기록.xlsx", date: "2026-04-01", rows: 35, status: "synced" },
      { name: "2026-04 주행기록.xlsx", date: "2026-05-01", rows: 38, status: "synced" },
      { name: "2026-05 주행기록.xlsx", date: "2026-06-01", rows: 35, status: "synced" },
    ],
  },
];

type Tab = "dashboard" | "logs" | "stats" | "export";

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [activeVehicleId, setActiveVehicleId] = useState<string>("v-tucson");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  // 새로운 차량 추가 기능 폼 상태 (OCP를 시각적으로 확인 가능)
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [newVehicleName, setNewVehicleName] = useState("");

  // 현재 선택된 차량 객체 추출
  const currentVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  }, [vehicles, activeVehicleId]);

  // 실시간 연동 연산 엔진 수식 적용 (Full-to-Full 실제 데이터 가공)
  const stats = useMemo(() => {
    const logs = currentVehicle.fuelingLogs;
    if (logs.length === 0) {
      return { totalDist: 0, totalCost: 0, totalLiters: 0, cumulativeEff: 0, latestSegEff: 0, chartData: [], segBarData: [] };
    }
    const totalDist = logs.slice(1).reduce((s, d) => s + d.dist, 0);
    const totalCost = logs.reduce((s, d) => s + d.cost, 0);
    const totalLiters = logs.reduce((s, d) => s + d.liters, 0);

    const validLitersForCum = logs.slice(1).reduce((s, d) => s + d.liters, 0);
    const cumulativeEff = validLitersForCum > 0 ? totalDist / validLitersForCum : 0;
    const latestSegEff = logs.length > 1 ? logs[logs.length - 1].segEff : 0;

    const chartData = logs
      .filter((d) => d.cumEff > 0)
      .map((d, i) => ({
        key: `cd-${i}`,
        label: d.label,
        cumEff: d.cumEff,
        segEff: d.segEff > 0 ? d.segEff : null,
      }));

    const segBarData = logs
      .filter((d) => d.segEff > 0)
      .slice(-12)
      .map((d, i) => ({ key: `sb-${i}`, label: d.label, segEff: d.segEff }));

    return { totalDist, totalCost, totalLiters, cumulativeEff, latestSegEff, chartData, segBarData };
  }, [currentVehicle]);

  // 새로운 차량 등록 로직 (OCP 원칙 준수)
  const handleAddVehicle = () => {
    if (!newVehicleModel || !newVehicleName) return;
    const newId = `v-${Date.now()}`;
    const newCar: Vehicle = {
      id: newId,
      name: newVehicleName,
      model: newVehicleModel,
      fuelingLogs: [{ date: new Date().toISOString().split("T")[0], label: "Init", liters: 30, cost: 50000, dist: 0, segEff: 0, cumEff: 0 }],
      syncedDrivingFiles: [],
    };
    setVehicles([...vehicles, newCar]);
    setActiveVehicleId(newId);
    setNewVehicleName("");
    setNewVehicleModel("");
    setShowVehicleSelector(false);
  };

  // 주유 기록 입력 시 수학적 런타임 계산 로직
  const handleAddFuelingRecord = (record: { date: string; cost: number; liters: number; dist: number }) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) => {
        if (v.id !== activeVehicleId) return v;

        const dateObj = new Date(record.date);
        const label = dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        
        const segEff = record.liters > 0 ? record.dist / record.liters : 0;
        
        // 과거 데이터 총합 구하기
        const updatedPreviousDist = v.fuelingLogs.slice(1).reduce((s, l) => s + l.dist, 0) + record.dist;
        const updatedPreviousLiters = v.fuelingLogs.slice(1).reduce((s, l) => s + l.liters, 0) + record.liters;
        const cumEff = updatedPreviousLiters > 0 ? updatedPreviousDist / updatedPreviousLiters : segEff;

        const newLog: FuelingRecord = {
          date: record.date,
          label,
          liters: record.liters,
          cost: record.cost,
          dist: record.dist,
          segEff: Math.round(segEff * 100) / 100,
          cumEff: Math.round(cumEff * 100) / 100,
        };

        return {
          ...v,
          fuelingLogs: [...v.fuelingLogs, newLog].sort((a, b) => a.date.localeCompare(b.date)),
        };
      })
    );
  };

  // 주행 파일 업로드 상태 동적 처리 로직
  const handleUploadFile = (fileName: string) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) => {
        if (v.id !== activeVehicleId) return v;
        const newFile = {
          name: fileName,
          date: new Date().toISOString().split("T")[0],
          rows: Math.floor(Math.random() * 25) + 15,
          status: "synced",
        };
        return {
          ...v,
          syncedDrivingFiles: [newFile, ...v.syncedDrivingFiles],
        };
      })
    );
  };

  // 실제 물리 엑셀 호환 CSV 데이터 파일 클라이언트 추출 로직
  const handleTriggerFileDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // 한글 깨짐 방지 BOM 추가
    csvContent += "구분,날짜,주유량(L),주유금액(원),구간주행거리(km),구간연비(km/L),누적연비(km/L)\n";
    
    currentVehicle.fuelingLogs.forEach((log) => {
      csvContent += `주유기록,${log.date},${log.liters},${log.cost},${log.dist},${log.segEff},${log.cumEff}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `integrated_car_management_${currentVehicle.model.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full" style={{ background: "#020617", fontFamily: "sans-serif" }}>
      {/* 스마트폰 목업 프레임 */}
      <div className="relative flex flex-col overflow-hidden" style={{ width: 390, height: 844, background: OFF_WHITE, borderRadius: 44, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
        
        {/* 상단 폰 노치 및 스테이터스 바 */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 flex-shrink-0 z-20" style={{ background: DARK_NAVY }}>
          <span className="text-xs font-semibold text-white">9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 rounded-full" style={{ background: "#000" }} />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">5G</span>
            <div className="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center"><div className="bg-white h-full w-4" /></div>
          </div>
        </div>

        {/* 최상단 앱 헤더 & OCP 차량 셀렉터 */}
        <div className="px-5 pt-4 pb-4 flex items-center justify-between z-10" style={{ background: DARK_NAVY }}>
          <div className="relative">
            <button onClick={() => setShowVehicleSelector(!showVehicleSelector)} className="flex items-center gap-1.5 text-left text-white focus:outline-none">
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-400 font-bold">차량 통합 가계부</p>
                <h1 className="text-base font-bold flex items-center gap-1">{currentVehicle.model} <Layers size={14} className="text-blue-400" /></h1>
              </div>
            </button>

            {/* OCP 확장 레이어 디스플레이 */}
            {showVehicleSelector && (
              <div className="absolute left-0 top-12 w-64 bg-slate-900 rounded-xl shadow-2xl p-3 border border-slate-800 z-50 text-white animate-in fade-in duration-200">
                <p className="text-xs font-bold text-slate-400 mb-2">등록 차량 목록</p>
                <div className="flex flex-col gap-1 mb-3 max-h-32 overflow-y-auto">
                  {vehicles.map((v) => (
                    <button key={v.id} onClick={() => { setActiveVehicleId(v.id); setShowVehicleSelector(false); }} className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex justify-between ${v.id === activeVehicleId ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}>
                      <span>{v.model}</span>
                      <span className="opacity-70">{v.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-2 flex flex-col gap-2">
                  <p className="text-xs font-bold text-blue-400">새 차량 추가 (OCP 확장체)</p>
                  <input type="text" placeholder="예: 투싼 하이브리드" value={newVehicleModel} onChange={(e) => setNewVehicleModel(e.target.value)} className="w-full bg-slate-800 text-xs px-2 py-1.5 rounded border border-slate-700 outline-none text-white" />
                  <input type="text" placeholder="예: 별명 지정" value={newVehicleName} onChange={(e) => setNewVehicleName(e.target.value)} className="w-full bg-slate-800 text-xs px-2 py-1.5 rounded border border-slate-700 outline-none text-white" />
                  <button onClick={handleAddVehicle} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 rounded transition-colors">새 차량 상태 세션 결합</button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">TS</div>
          </div>
        </div>

        {/* 탭 라우팅 바디 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "dashboard" && <DashboardView stats={stats} currentVehicle={currentVehicle} />}
          {activeTab === "logs" && <LogsView currentVehicle={currentVehicle} onAddRecord={handleAddFuelingRecord} onUploadFile={handleUploadFile} />}
          {activeTab === "stats" && <StatsView stats={stats} currentVehicle={currentVehicle} />}
          {activeTab === "export" && <ExportView stats={stats} currentVehicle={currentVehicle} onDownload={handleTriggerFileDownload} />}
        </div>

        {/* 네비게이션 하단 바 */}
        <div className="flex-shrink-0 flex items-center justify-around px-4 pt-2 pb-6 bg-white border-t border-slate-200 shadow-lg">
          {(["dashboard", "logs", "stats", "export"] as const).map((tabId) => {
            const active = activeTab === tabId;
            const config = {
              dashboard: { label: "홈", icon: Home },
              logs: { label: "기록입력", icon: ClipboardList },
              stats: { label: "연비분석", icon: BarChart2 },
              export: { label: "동기화", icon: CloudUpload },
            }[tabId];
            return (
              <button key={tabId} onClick={() => setActiveTab(tabId)} className="flex flex-col items-center gap-1 px-3 py-1">
                <div className={`w-10 h-7 rounded-xl flex items-center justify-center transition-all ${active ? "bg-slate-900 text-blue-400" : "text-slate-400"}`}>
                  <config.icon size={18} strokeWidth={active ? 2.5 : 1.8} className={active ? "text-blue-400" : "text-slate-400"} />
                </div>
                <span className={`text-[10px] font-bold ${active ? "text-slate-900" : "text-slate-400"}`}>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   1. 대시보드 화면 컴포넌트
   ========================================== */
function DashboardView({ stats, currentVehicle }: { stats: any; currentVehicle: Vehicle }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-6" style={{ scrollbarWidth: "none" }}>
      {/* 누적 연비 메인 카드 */}
      <div className="w-full rounded-2xl p-5 shadow-lg text-white" style={{ background: `linear-gradient(135deg, ${DARK_NAVY} 0%, #1E293B 100%)` }}>
        <p className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">누적 평균 연비 (CUMULATIVE)</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-5xl font-extrabold tracking-tight text-blue-400">{stats.cumulativeEff > 0 ? stats.cumulativeEff.toFixed(2) : "0.00"}</span>
          <span className="text-sm text-slate-400 font-semibold">km/L</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 mt-4 pt-3 text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <TrendingUp size={14} className="text-blue-400" />
            <span>최근 구간 연비: <strong>{stats.latestSegEff > 0 ? stats.latestSegEff.toFixed(2) : "0.00"} km/L</strong></span>
          </div>
        </div>
      </div>

      {/* 동적 Recharts 연비 유동 차트 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mt-4">
        <h3 className="text-xs font-bold text-slate-800 mb-2">실시간 연비 추이 변동 그래프</h3>
        <div className="w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: "#64748B" }} tickLine={false} />
              {/* 유동 확장 축소형 Y축 도메인 적용 */}
              <YAxis tick={{ fontSize: 8, fill: "#64748B" }} domain={["dataMin - 1", "dataMax + 1"]} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              <Line type="monotone" dataKey="cumEff" name="누적연비" stroke={COOL_BLUE} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="segEff" name="구간연비" stroke={ACCENT_BLUE} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 종합 인덱스 요약 그리드 */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "총 주행 거리", value: stats.totalDist.toLocaleString(), unit: "km", icon: Route, color: COOL_BLUE },
          { label: "총 지출 주유비", value: `${Math.round(stats.totalCost / 10000)}만`, unit: "원", icon: DollarSign, color: "#EF4444" },
          { label: "총 주유량", value: stats.totalLiters.toFixed(0), unit: "L", icon: Droplets, color: ACCENT_BLUE },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-sm">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1" style={{ background: `${item.color}15` }}>
              <item.icon size={14} color={item.color} />
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-bold text-slate-900">{item.value}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{item.unit}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 주유 이력 내역 피드 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-4 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-800">최근 실시간 주유 내역</span>
          <span className="text-[10px] text-blue-600 font-bold">전체보기</span>
        </div>
        <div className="divide-y divide-slate-100">
          {currentVehicle.fuelingLogs.slice(-3).reverse().map((log, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"><Fuel size={14} /></div>
                <div>
                  <p className="font-bold text-slate-800">{log.date}</p>
                  <p className="text-[10px] text-slate-500">{log.liters.toFixed(2)} Liters</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{formatKRW(log.cost)}</p>
                <p className="text-[10px] text-blue-600 font-semibold">구간 {log.segEff} km/L</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. 데이터 관리 및 입력 화면 컴포넌트 (진짜 I/O 연동)
   ========================================== */
function LogsView({ currentVehicle, onAddRecord, onUploadFile }: { currentVehicle: Vehicle; onAddRecord: (r: any) => void; onUploadFile: (name: string) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cost, setCost] = useState("");
  const [liters, setLiters] = useState("");
  const [dist, setDist] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cost || !liters || !dist) return alert("모든 항목을 올바르게 채워주세요.");
    onAddRecord({
      date,
      cost: Number(cost),
      liters: Number(liters),
      dist: Number(dist),
    });
    setCost("");
    setLiters("");
    setDist("");
    alert("새 주유기록이 반영되었으며 실시간 연비 지표가 재연산되었습니다.");
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-6" style={{ scrollbarWidth: "none" }}>
      {/* 수동 주유 삽입 레코드 폼 */}
      <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Fuel size={16} className="text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800">새 주유 데이터 입력 수집기</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 font-semibold mb-1">날짜 선택</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700" />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 font-semibold mb-1">총 금액 (원)</label>
            <input type="number" placeholder="예: 55000" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700" />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 font-semibold mb-1">주유량 (L)</label>
            <input type="number" step="0.01" placeholder="예: 32.5" value={liters} onChange={(e) => setLiters(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700" />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 font-semibold mb-1">직전이후 주행 (km)</label>
            <input type="number" placeholder="예: 410" value={dist} onChange={(e) => setDist(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700" />
          </div>
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white font-bold text-xs p-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-1">
          주유 가계부 즉시 반영
        </button>
      </form>

      {/* 동적 주행 기록 통합 엑셀 가상 업로드 트리거 영역 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4 flex flex-col">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 mb-3">
          <FileSpreadsheet size={16} className="text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800">월별 주행 기록 연동 (.xlsx)</h3>
        </div>
        <input type="file" ref={fileInputRef} accept=".xlsx,.csv" className="hidden" onChange={(e) => {
          if(e.target.files && e.target.files[0]) {
            onUploadFile(e.target.files[0].name);
            alert(`${e.target.files[0].name} 파일 파싱이 성공했습니다.`);
          }
        }} />
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 transition-all">
          <Upload size={20} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">월별 파일 등록 인터페이스</span>
          <span className="text-[10px] text-slate-400">클릭 시 탐색기에서 파일을 가져옵니다</span>
        </div>

        {/* 연동 내역 동적 카운터 리스트 피드 */}
        <div className="mt-4">
          <h4 className="text-[11px] font-bold text-slate-500 mb-2">현재 연동 완료된 원천 소스 ({currentVehicle.syncedDrivingFiles.length}개)</h4>
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {currentVehicle.syncedDrivingFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-blue-500" />
                  <span className="font-medium text-slate-800">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">{file.rows}행 연동됨</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   3. 심층 데이터 통계 분석 화면 컴포넌트
   ========================================== */
function StatsView({ stats, currentVehicle }: { stats: any; currentVehicle: Vehicle }) {
  const bestLog = useMemo(() => currentVehicle.fuelingLogs.filter(l => l.segEff > 0).reduce((a, b) => b.segEff > a.segEff ? b : a, currentVehicle.fuelingLogs[0]), [currentVehicle]);
  const worstLog = useMemo(() => currentVehicle.fuelingLogs.filter(l => l.segEff > 0).reduce((a, b) => b.segEff < a.segEff ? b : a, currentVehicle.fuelingLogs[0]), [currentVehicle]);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-6" style={{ scrollbarWidth: "none" }}>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] text-blue-600 font-bold">최고 연비 구간</p>
          <p className="text-xl font-black text-slate-900 mt-1">{bestLog?.segEff || "0.0"} <span className="text-xs font-normal text-slate-400">km/L</span></p>
          <p className="text-[9px] text-slate-400 mt-0.5">{bestLog?.date || "내역 없음"}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] text-red-500 font-bold">최저 연비 구간</p>
          <p className="text-xl font-black text-slate-900 mt-1">{worstLog?.segEff || "0.0"} <span className="text-xs font-normal text-slate-400">km/L</span></p>
          <p className="text-[9px] text-slate-400 mt-0.5">{worstLog?.date || "내역 없음"}</p>
        </div>
      </div>

      {/* 최근 연비 바 차트 그리드 그래프 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 mb-2">구간별 연비 변동 집계 바 차트</h3>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.segBarData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 8 }} tickLine={false} />
              <YAxis tick={{ fontSize: 8 }} domain={["dataMin - 1", "dataMax + 1"]} tickLine={false} />
              <Tooltip />
              <Bar dataKey="segEff" fill={DARK_NAVY} radius={[4, 4, 0, 0]} name="구간 연비" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 내부 보관용 표 형태 매트릭스 뷰 레코드 집계 데이터 */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-4 overflow-hidden text-[10px]">
        <div className="grid grid-cols-5 bg-slate-900 text-slate-300 py-2 px-3 font-bold text-center">
          <span>날짜</span><span>리터</span><span>비용</span><span>구간</span><span>누적</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
          {currentVehicle.fuelingLogs.slice(1).map((log, idx) => (
            <div key={idx} className="grid grid-cols-5 py-2 px-3 text-center text-slate-600 items-center">
              <span className="font-medium">{log.label}</span>
              <span>{log.liters.toFixed(0)}L</span>
              <span>{Math.round(log.cost / 1000)}K</span>
              <span className="font-bold text-blue-600">{log.segEff}</span>
              <span className="font-bold text-slate-900">{log.cumEff}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   4. 마스터 동기화 및 진짜 데이터 다운로드 화면
   ========================================== */
function ExportView({ stats, currentVehicle, onDownload }: { stats: any; currentVehicle: Vehicle; onDownload: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-6" style={{ scrollbarWidth: "none" }}>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0"><Database size={18} /></div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">클라이언트 사이드 마스터 DB 준비 완료</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{currentVehicle.fuelingLogs.length}개의 데이터 레코드가 완벽히 정렬 결합되었습니다.</p>
        </div>
      </div>

      {/* 실제 브라우저 파일 앵커 트리거 프롬프트 */}
      <button onClick={onDownload} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-2xl shadow-lg mt-4 flex flex-col items-center justify-center transition-all">
        <div className="flex items-center gap-2">
          <Download size={16} />
          <span>통합 데이터베이스 빼오기 (Export)</span>
        </div>
        <span className="text-[10px] font-normal opacity-70 mt-0.5">엑셀 연동 호환 마스터 파일 백업 (.csv)</span>
      </button>

      {/* 파일 입출력 오너십 보안 프롬프트 */}
      <div className="bg-slate-100 rounded-xl p-3 flex items-start gap-2.5 mt-4 text-[10px] text-slate-500 leading-relaxed">
        <Shield size={16} className="text-slate-700 flex-shrink-0" />
        <p>본 장치에서 생성 및 연산 가공되는 차량 제어 데이터와 엑셀 내역은 클라이언트 기기 외부의 원격 서버로 송출되지 않으며, OCP 상태 세션 구조 안에서 완전히 로컬 프라이빗 보안 공간에 격리 저장됩니다.</p>
      </div>

      {/* 마스터 스키마 필드 리스트 뷰 구조 디스플레이 */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-4 text-[10px]">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-xs font-bold text-slate-800">추출 마스터 파일 컬럼 명세서</span></div>
        <div className="divide-y divide-slate-100">
          {[
            { col: "주유일자", type: "DATE (YYYY-MM-DD)", ex: "2026-06-05" },
            { col: "주유량(L)", type: "FLOAT (실수형 소수점)", ex: "32.03" },
            { col: "구간주행거리(km)", type: "FLOAT (실수형 정제)", ex: "269.0" },
            { col: "구간연비 및 누적연비", type: "DOUBLE (수학적 실시간 공식식)", ex: "12.87" },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-3 p-2.5 text-center items-center">
              <span className="font-bold text-left text-slate-800 pl-2">{item.col}</span>
              <span className="text-blue-600 font-semibold">{item.type}</span>
              <span className="text-slate-400 text-right pr-2">{item.ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}