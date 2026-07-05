import { useState, useCallback } from "react";
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
} from "lucide-react";

const DARK_SLATE = "#2F4F4F";
const MINT = "#11CAA0";
const OFF_WHITE = "#F9FBFB";

const fuelingData = [
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
  { date: "2026-06-19", label: "Jun 19", liters: 23.02, cost: 46000, dist: 0, segEff: 0, cumEff: 12.43 },
];

const syncedFiles = [
  { name: "2025-09 주행기록.xlsx", date: "2025-10-01", rows: 28, status: "synced" },
  { name: "2025-10 주행기록.xlsx", date: "2025-11-01", rows: 32, status: "synced" },
  { name: "2025-11 주행기록.xlsx", date: "2025-12-01", rows: 30, status: "synced" },
  { name: "2025-12 주행기록.xlsx", date: "2026-01-02", rows: 18, status: "synced" },
  { name: "2026-01 주행기록.xlsx", date: "2026-02-01", rows: 22, status: "synced" },
  { name: "2026-02 주행기록.xlsx", date: "2026-03-01", rows: 20, status: "synced" },
  { name: "2026-03 주행기록.xlsx", date: "2026-04-01", rows: 35, status: "synced" },
  { name: "2026-04 주행기록.xlsx", date: "2026-05-01", rows: 38, status: "synced" },
  { name: "2026-05 주행기록.xlsx", date: "2026-06-01", rows: 35, status: "synced" },
];

const totalDist = fuelingData.slice(1, -1).reduce((s, d) => s + d.dist, 0);
const totalCost = fuelingData.reduce((s, d) => s + d.cost, 0);
const totalLiters = fuelingData.reduce((s, d) => s + d.liters, 0);
const cumulativeEff = 12.43;
const latestSegEff = fuelingData[fuelingData.length - 3].segEff; // 8.40 recent valid
const prevCumEff = fuelingData[fuelingData.length - 2].cumEff; // 13.10 peak

const chartData = fuelingData
  .filter((d) => d.cumEff > 0)
  .map((d, i) => ({
    key: `cd-${i}`,
    label: d.label,
    cumEff: d.cumEff,
    segEff: d.segEff > 0 ? d.segEff : null,
  }));

const segBarData = fuelingData
  .filter((d) => d.segEff > 0)
  .slice(-12)
  .map((d, i) => ({ key: `sb-${i}`, label: d.label, segEff: d.segEff }));

type Tab = "dashboard" | "logs" | "stats" | "export";

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "₩";
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 shadow-xl text-xs"
      style={{ background: DARK_SLATE, color: OFF_WHITE, fontFamily: "'JetBrains Mono', monospace", minWidth: 140 }}
    >
      <div className="mb-1.5 font-semibold" style={{ color: MINT }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: "#A8C4C4" }}>{p.name === "cumEff" ? "Cumulative" : "Segment"}</span>
          <span className="font-bold" style={{ color: p.name === "cumEff" ? MINT : "#F59E0B" }}>
            {p.value?.toFixed(2)} km/L
          </span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 shadow-xl text-xs"
      style={{ background: DARK_SLATE, color: OFF_WHITE, fontFamily: "'JetBrains Mono', monospace", minWidth: 130 }}
    >
      <div className="mb-1 font-semibold" style={{ color: MINT }}>{label}</div>
      <div className="flex justify-between gap-3">
        <span style={{ color: "#A8C4C4" }}>Segment</span>
        <span className="font-bold" style={{ color: "#F59E0B" }}>{payload[0]?.value?.toFixed(2)} km/L</span>
      </div>
    </div>
  );
}

function DashboardScreen() {
  const effDelta = cumulativeEff - 12.03;
  const isUp = effDelta > 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between" style={{ background: DARK_SLATE }}>
        <div>
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
            Vehicle Ledger
          </p>
          <h1 className="text-lg font-bold text-white mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
            My EV · 현대 아이오닉
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80" style={{ background: "rgba(255,255,255,0.08)" }}>
            <Bell size={16} color="rgba(255,255,255,0.7)" />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: MINT, color: "#0A2020", fontFamily: "'Outfit', sans-serif" }}>
            KJ
          </div>
        </div>
      </div>

      {/* Hero KPI Card */}
      <div className="mx-4 -mt-1 rounded-2xl shadow-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3535 0%, #2F4F4F 60%, #1e4040 100%)" }}>
        <div className="px-5 pt-5 pb-4">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
            Cumulative Fuel Efficiency
          </p>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold" style={{ fontSize: 52, lineHeight: 1, color: MINT, fontFamily: "'JetBrains Mono', monospace" }}>
                  12.43
                </span>
                <span className="text-lg font-medium" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
                  km/L
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: isUp ? "rgba(17,202,160,0.18)" : "rgba(232,69,90,0.18)" }}>
                  {isUp ? <ArrowUpRight size={12} color={MINT} /> : <ArrowDownRight size={12} color="#E8455A" />}
                  <span className="text-xs font-semibold" style={{ color: isUp ? MINT : "#E8455A", fontFamily: "'JetBrains Mono', monospace" }}>
                    {isUp ? "+" : ""}{effDelta.toFixed(2)} km/L
                  </span>
                </div>
                <span className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>vs. 3 mo. avg</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>Latest Segment</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="font-bold" style={{ fontSize: 26, lineHeight: 1, color: "#F59E0B", fontFamily: "'JetBrains Mono', monospace" }}>
                  {latestSegEff.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>km/L</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>Jun 05 segment</p>
            </div>
          </div>
        </div>
        {/* Mini trend indicator */}
        <div className="px-5 pb-4 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: MINT }} />
              <span className="text-xs" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>Cumulative trend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
              <span className="text-xs" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>Segment efficiency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4" style={{ border: "1px solid #D0E0E0" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
              Efficiency Trend
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>Sep 2025 – Jun 2026</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#EBF2F2" }}>
            <TrendingUp size={12} color={DARK_SLATE} />
            <span className="text-xs font-semibold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>All Time</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBF2F2" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}
              interval={4}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}
              domain={[10, 17]}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={12.43} stroke={MINT} strokeDasharray="4 4" strokeOpacity={0.4} />
            <Line
              key="line-cumEff"
              type="monotone"
              dataKey="cumEff"
              name="cumEff"
              stroke={MINT}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: MINT, strokeWidth: 0 }}
            />
            <Line
              key="line-segEff"
              type="monotone"
              dataKey="segEff"
              name="segEff"
              stroke="#F59E0B"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 3"
              activeDot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Grid */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Distance", value: totalDist.toLocaleString(), unit: "km", icon: Route, color: "#2F4F4F" },
          { label: "Total Cost", value: (totalCost / 10000).toFixed(1) + "만", unit: "₩", icon: DollarSign, color: "#E8455A" },
          { label: "Total Fuel", value: totalLiters.toFixed(1), unit: "L", icon: Droplets, color: MINT },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-3 shadow-sm flex flex-col"
            style={{ border: "1px solid #D0E0E0" }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: item.color + "18" }}>
              <item.icon size={14} color={item.color} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold leading-none" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value}
              </span>
              <span className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
                {item.unit}
              </span>
            </div>
            <p className="text-xs mt-1 leading-tight" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Logs */}
      <div className="mx-4 mb-6 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #EBF2F2" }}>
          <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>Recent Fueling</h3>
          <button className="text-xs font-semibold" style={{ color: MINT, fontFamily: "'Outfit', sans-serif" }}>View All</button>
        </div>
        {fuelingData.slice(-4).reverse().map((d, i) => (
          <div
            key={d.date}
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: i < 3 ? "1px solid #EBF2F2" : "none" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EBF2F2" }}>
                <Fuel size={14} color={DARK_SLATE} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>{d.date}</p>
                <p className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}>{d.liters.toFixed(2)} L</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>
                {formatKRW(d.cost)}
              </p>
              {d.segEff > 0 && (
                <p className="text-xs" style={{ color: d.segEff >= 12 ? MINT : "#F59E0B", fontFamily: "'JetBrains Mono', monospace" }}>
                  {d.segEff.toFixed(2)} km/L
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogsScreen() {
  const [date, setDate] = useState("2026-07-05");
  const [price, setPrice] = useState("");
  const [liters, setLiters] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const computed = liters && price ? (parseFloat(price) / parseFloat(liters)).toFixed(0) : "";

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 pt-6 pb-4" style={{ background: DARK_SLATE }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
          Log Management
        </p>
        <h1 className="text-lg font-bold text-white mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Record &amp; Import
        </h1>
      </div>

      {/* Fueling Entry Form */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #EBF2F2" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: MINT + "20" }}>
              <Fuel size={14} color={MINT} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
              New Fueling Entry
            </h3>
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          {/* Date */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
              Date
            </label>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#EBF2F2" }}>
              <Calendar size={14} color={DARK_SLATE} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm flex-1 outline-none"
                style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>

          {/* Price + Liters row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
                Total Price (₩)
              </label>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#EBF2F2" }}>
                <input
                  type="number"
                  placeholder="55,000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-transparent text-sm flex-1 outline-none w-full"
                  style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
                Amount (L)
              </label>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#EBF2F2" }}>
                <input
                  type="number"
                  placeholder="31.45"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  className="bg-transparent text-sm flex-1 outline-none w-full"
                  style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            </div>
          </div>

          {/* Unit price computed */}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
              Unit Price (₩/L) <span style={{ color: MINT }}>· auto-calculated</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#EBF2F2", opacity: 0.85 }}>
              <input
                type="text"
                placeholder="1,749"
                value={computed || unitPrice}
                readOnly={!!computed}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="bg-transparent text-sm flex-1 outline-none"
                style={{ color: computed ? MINT : DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>

          <button
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 active:scale-[0.98] mt-1"
            style={{ background: DARK_SLATE, color: "white", fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={15} />
              Add Fueling Record
            </div>
          </button>
        </div>
      </div>

      {/* Excel Import Zone */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #EBF2F2" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: DARK_SLATE + "15" }}>
              <FileSpreadsheet size={14} color={DARK_SLATE} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
              Monthly Driving Logs
            </h3>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragging ? MINT : "#D0E0E0"}`,
              background: dragging ? MINT + "08" : "#F9FBFB",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: dragging ? MINT + "20" : "#EBF2F2" }}>
              <Upload size={18} color={dragging ? MINT : DARK_SLATE} />
            </div>
            <p className="text-sm font-semibold text-center" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
              Drag &amp; Drop .xlsx file
            </p>
            <p className="text-xs text-center" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
              or tap to browse files
            </p>
            <button
              className="mt-2 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: MINT, color: "#0A2020", fontFamily: "'Outfit', sans-serif" }}
            >
              Import .xlsx
            </button>
          </div>

          {/* Synced files list */}
          <div className="mt-4">
            <p className="text-xs font-semibold mb-2" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
              Successfully Synced ({syncedFiles.length} files)
            </p>
            <div className="flex flex-col gap-2">
              {syncedFiles.map((f) => (
                <div key={f.name} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: "#F9FBFB", border: "1px solid #EBF2F2" }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} color={MINT} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>{f.name}</p>
                      <p className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}>{f.rows} rows · {f.date}</p>
                    </div>
                  </div>
                  <ChevronRight size={13} color="#A8C4C4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatisticsScreen() {
  const [view, setView] = useState<"chart" | "table">("chart");
  const best = fuelingData.reduce((a, b) => (b.segEff > a.segEff ? b : a));
  const worst = fuelingData.filter((d) => d.segEff > 0).reduce((a, b) => (b.segEff < a.segEff ? b : a));

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 pt-6 pb-4" style={{ background: DARK_SLATE }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
          Statistics
        </p>
        <h1 className="text-lg font-bold text-white mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Efficiency Analysis
        </h1>
      </div>

      {/* Toggle */}
      <div className="mx-4 mt-4 flex gap-1 p-1 rounded-xl" style={{ background: "#EBF2F2" }}>
        {(["chart", "table"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={{
              background: view === v ? DARK_SLATE : "transparent",
              color: view === v ? "white" : "#5A7A7A",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {v === "chart" ? "Chart View" : "Table View"}
          </button>
        ))}
      </div>

      {/* Highlight cards */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid #D0E0E0" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={13} color={MINT} />
            <span className="text-xs font-semibold" style={{ color: MINT, fontFamily: "'Outfit', sans-serif" }}>Best Segment</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>
              {best.segEff.toFixed(2)}
            </span>
            <span className="text-sm" style={{ color: "#5A7A7A" }}>km/L</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>{best.date}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid #D0E0E0" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={13} color="#E8455A" />
            <span className="text-xs font-semibold" style={{ color: "#E8455A", fontFamily: "'Outfit', sans-serif" }}>Low Segment</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>
              {worst.segEff.toFixed(2)}
            </span>
            <span className="text-sm" style={{ color: "#5A7A7A" }}>km/L</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>{worst.date}</p>
        </div>
      </div>

      {view === "chart" ? (
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4" style={{ border: "1px solid #D0E0E0" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
                Segment Efficiency
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>Last 12 fill-ups</p>
            </div>
            <div className="flex items-baseline gap-1 px-2 py-1 rounded-lg" style={{ background: "#EBF2F2" }}>
              <span className="text-xs font-bold" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>avg</span>
              <span className="text-sm font-bold" style={{ color: MINT, fontFamily: "'JetBrains Mono', monospace" }}>12.43</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={segBarData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBF2F2" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 8, fill: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}
                domain={[8, 18]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<BarTooltip />} />
              <ReferenceLine y={12.43} stroke={MINT} strokeDasharray="4 4" strokeOpacity={0.5} />
              <Bar
                key="bar-segEff"
                dataKey="segEff"
                radius={[4, 4, 0, 0]}
                fill="#2F4F4F"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
          {/* Table header */}
          <div className="grid grid-cols-5 px-3 py-2" style={{ background: DARK_SLATE }}>
            {["Date", "Liters", "Cost", "Seg.", "Cum."].map((h) => (
              <div key={h} className="text-center">
                <span className="text-xs font-semibold" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>{h}</span>
              </div>
            ))}
          </div>
          {fuelingData.slice(1).map((d, i) => (
            <div
              key={d.date}
              className="grid grid-cols-5 px-3 py-2.5 items-center"
              style={{ background: i % 2 === 0 ? "white" : "#F9FBFB", borderBottom: "1px solid #EBF2F2" }}
            >
              <span className="text-center text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>
                {d.label}
              </span>
              <span className="text-center text-xs font-medium" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace" }}>
                {d.liters.toFixed(1)}L
              </span>
              <span className="text-center text-xs" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {(d.cost / 1000).toFixed(0)}K
              </span>
              <span
                className="text-center text-xs font-semibold"
                style={{
                  color: d.segEff >= 12.43 ? MINT : d.segEff > 0 ? "#F59E0B" : "#A8C4C4",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {d.segEff > 0 ? d.segEff.toFixed(1) : "—"}
              </span>
              <span
                className="text-center text-xs font-bold"
                style={{
                  color: d.cumEff >= 12.43 ? MINT : d.cumEff > 0 ? DARK_SLATE : "#A8C4C4",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {d.cumEff > 0 ? d.cumEff.toFixed(2) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportScreen() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 1800);
  };

  const preview = [
    { col: "주유일자", type: "DATE", example: "2026-06-05" },
    { col: "주유량(L)", type: "FLOAT", example: "32.03" },
    { col: "주유금액(원)", type: "INTEGER", example: "64,000" },
    { col: "구간주행거리(km)", type: "FLOAT", example: "269.0" },
    { col: "구간연비(km/L)", type: "FLOAT", example: "8.40" },
    { col: "누적연비(km/L)", type: "FLOAT", example: "12.87" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 pt-6 pb-4" style={{ background: DARK_SLATE }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>
          Data Sync &amp; Backup
        </p>
        <h1 className="text-lg font-bold text-white mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Export &amp; Sync
        </h1>
      </div>

      {/* Status banner */}
      <div className="mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: MINT + "18", border: `1px solid ${MINT}40` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: MINT + "30" }}>
          <Database size={16} color={MINT} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>Master Database Ready</p>
          <p className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace" }}>
            24 records · 9 driving files · updated today
          </p>
        </div>
      </div>

      {/* Export Button — primary CTA */}
      <div className="mx-4 mt-4">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] shadow-lg disabled:opacity-70"
          style={{
            background: exported ? MINT : DARK_SLATE,
            color: exported ? "#0A2020" : "white",
            fontFamily: "'Outfit', sans-serif",
            boxShadow: `0 8px 24px ${DARK_SLATE}40`,
          }}
        >
          <div className="flex items-center justify-center gap-3">
            {exporting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : exported ? (
              <CheckCircle2 size={18} />
            ) : (
              <FileSpreadsheet size={18} />
            )}
            {exporting
              ? "Generating Excel..."
              : exported
              ? "Export Complete!"
              : "Export Integrated Master Database"}
          </div>
          {!exporting && !exported && (
            <p className="text-xs font-normal mt-1 opacity-70">
              integrated_car_management_db.xlsx
            </p>
          )}
        </button>
      </div>

      {/* Cloud Sync button */}
      <div className="mx-4 mt-3">
        <button
          className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "#EBF2F2", color: DARK_SLATE, fontFamily: "'Outfit', sans-serif", border: "1px solid #D0E0E0" }}
        >
          <div className="flex items-center justify-center gap-2">
            <CloudUpload size={16} color={DARK_SLATE} />
            Sync to Cloud Backup
          </div>
        </button>
      </div>

      {/* Schema Preview */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #EBF2F2" }}>
          <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>
            Export Schema Preview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
            Sheet: 연비 분석 대시보드
          </p>
        </div>
        <div>
          {/* Header */}
          <div className="grid grid-cols-3 px-4 py-2" style={{ background: DARK_SLATE }}>
            {["Column", "Type", "Sample"].map((h) => (
              <span key={h} className="text-xs font-semibold" style={{ color: "#7EC8B0", fontFamily: "'Outfit', sans-serif" }}>{h}</span>
            ))}
          </div>
          {preview.map((row, i) => (
            <div
              key={row.col}
              className="grid grid-cols-3 px-4 py-2.5 items-center"
              style={{ background: i % 2 === 0 ? "white" : "#F9FBFB", borderBottom: i < preview.length - 1 ? "1px solid #EBF2F2" : "none" }}
            >
              <span className="text-xs font-medium" style={{ color: DARK_SLATE, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {row.col}
              </span>
              <span className="text-xs" style={{ color: MINT, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {row.type}
              </span>
              <span className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                {row.example}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="mx-4 mt-4 flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: "#EBF2F2" }}>
        <Shield size={16} color={DARK_SLATE} className="mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-relaxed" style={{ color: "#5A7A7A", fontFamily: "'Outfit', sans-serif" }}>
          All data is stored locally on your device. Exports are generated on-device with no third-party transmission. Your driving and fueling records remain entirely private.
        </p>
      </div>

      {/* Sheets list */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #D0E0E0" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #EBF2F2" }}>
          <h3 className="text-sm font-bold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>Included Sheets</h3>
        </div>
        {[
          { name: "연비 분석 대시보드", desc: "24 rows — segment & cumulative analysis", icon: BarChart2 },
          { name: "주유 기록", desc: "24 fueling records with costs", icon: Fuel },
          { name: "통합 주행 기록", desc: "258 driving sessions merged", icon: Route },
        ].map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: i < 2 ? "1px solid #EBF2F2" : "none" }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EBF2F2" }}>
              <s.icon size={14} color={DARK_SLATE} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: DARK_SLATE, fontFamily: "'Outfit', sans-serif" }}>{s.name}</p>
              <p className="text-xs" style={{ color: "#5A7A7A", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{s.desc}</p>
            </div>
            <Download size={13} color="#A8C4C4" />
          </div>
        ))}
      </div>
    </div>
  );
}

const tabs = [
  { id: "dashboard" as Tab, label: "Home", icon: Home },
  { id: "logs" as Tab, label: "Logs", icon: ClipboardList },
  { id: "stats" as Tab, label: "Stats", icon: BarChart2 },
  { id: "export" as Tab, label: "Sync", icon: CloudUpload },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "#1A2A2A", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          background: OFF_WHITE,
          borderRadius: 44,
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 pt-3 pb-2 flex-shrink-0"
          style={{ background: DARK_SLATE }}
        >
          <span className="text-xs font-semibold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>9:41</span>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 rounded-full"
            style={{ background: "#111" }}
          />
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[3, 3, 3, 3].map((_, i) => (
                <div key={i} className="w-0.5 rounded-full" style={{ height: 3 + i * 1.5, background: i < 3 ? "white" : "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
            <span className="text-xs text-white ml-1">100%</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden" style={{ background: OFF_WHITE }}>
          {activeTab === "dashboard" && <DashboardScreen />}
          {activeTab === "logs" && <LogsScreen />}
          {activeTab === "stats" && <StatisticsScreen />}
          {activeTab === "export" && <ExportScreen />}
        </div>

        {/* Bottom Nav */}
        <div
          className="flex-shrink-0 flex items-center justify-around px-4 pt-2 pb-6"
          style={{
            background: "white",
            borderTop: "1px solid #D0E0E0",
            boxShadow: "0 -4px 20px rgba(47,79,79,0.08)",
          }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
                style={{ minWidth: 56 }}
              >
                <div
                  className="w-10 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: active ? DARK_SLATE : "transparent" }}
                >
                  <tab.icon size={18} color={active ? MINT : "#A8C4C4"} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-xs font-semibold transition-colors"
                  style={{ color: active ? DARK_SLATE : "#A8C4C4", fontFamily: "'Outfit', sans-serif" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
