"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  LogOut,
  FileText,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Pin,
  IndianRupee,
  CalendarDays,
  BadgeCheck,
  TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  full_name: string;
  role: string;
  department: string;
  employee_code: string;
  email: string;
  phone: string | null;
  joining_date: string | null;
}

interface Payslip {
  id: string;
  month: number;
  year: number;
  basic_pay: number;
  hra: number;
  allowances: number;
  pf_deduction: number;
  tax_deduction: number;
  other_deductions: number;
  net_pay: number;
  notes: string | null;
  created_at: string;
}

interface CompanyUpdate {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  posted_at: string;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STAFF_SESSION_KEY = "amva_staff_id";

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (emp: Employee) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    const { data, error: dbErr } = await (supabase as any)
      .from("employees")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .eq("password", password)
      .eq("is_active", true)
      .single();

    if (dbErr || !data) {
      setError("Invalid email or password. Please contact your manager.");
      setLoading(false);
      return;
    }
    localStorage.setItem(STAFF_SESSION_KEY, data.id);
    onLogin(data as Employee);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0d0a04] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-gold" />
          </div>
          <div className="text-center">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-1">AmVa Kitchen & Bar</p>
            <h1 className="font-display text-2xl font-bold text-white">Staff Portal</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to view your payslips & updates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-xs font-bold tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@amvakitchen.in"
              autoFocus
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 py-3 px-4 outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-xs font-bold tracking-widest uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 py-3 px-4 outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-white/20 text-xs text-center mt-6">
          Forgot your password? Contact your manager.
        </p>
      </div>
    </div>
  );
}

// ─── Payslip Card ─────────────────────────────────────────────────────────────

function PayslipCard({ slip }: { slip: Payslip }) {
  const [open, setOpen] = useState(false);
  const grossPay = slip.basic_pay + slip.hra + slip.allowances;
  const totalDeductions = slip.pf_deduction + slip.tax_deduction + slip.other_deductions;

  return (
    <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header row — click to expand */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-brand-gold shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">
              {MONTH_NAMES[slip.month - 1]} {slip.year}
            </p>
            <p className="text-white/30 text-xs mt-0.5">Payslip</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-brand-gold font-bold font-display text-lg">
              ₹{slip.net_pay.toLocaleString("en-IN")}
            </p>
            <p className="text-white/30 text-[10px]">Net Pay</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 flex flex-col gap-4">
          {/* Earnings */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Earnings</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Basic Pay", value: slip.basic_pay },
                { label: "House Rent Allowance (HRA)", value: slip.hra },
                { label: "Other Allowances", value: slip.allowances },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/60">{label}</span>
                  <span className="text-white font-medium">₹{value.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-1">
                <span className="text-white font-semibold">Gross Pay</span>
                <span className="text-white font-bold">₹{grossPay.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Deductions</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Provident Fund (PF)", value: slip.pf_deduction },
                { label: "Income Tax (TDS)", value: slip.tax_deduction },
                { label: "Other Deductions", value: slip.other_deductions },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/60">{label}</span>
                  <span className="text-red-400/80">− ₹{value.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-1">
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" /> Total Deductions
                </span>
                <span className="text-red-400 font-bold">− ₹{totalDeductions.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-brand-gold/10 border border-brand-gold/30 px-4 py-3 flex justify-between items-center">
            <span className="text-brand-gold font-bold text-sm tracking-wider uppercase">Net Pay</span>
            <span className="text-brand-gold font-display text-2xl font-bold">
              ₹{slip.net_pay.toLocaleString("en-IN")}
            </span>
          </div>

          {slip.notes && (
            <p className="text-white/40 text-xs border-l-2 border-brand-gold/30 pl-3">{slip.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function StaffDashboard({ employee, onLogout }: { employee: Employee; onLogout: () => void }) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"updates" | "payslips">("updates");

  useEffect(() => {
    async function fetch() {
      const [{ data: slips }, { data: upds }] = await Promise.all([
        (supabase as any)
          .from("payslips")
          .select("*")
          .eq("employee_id", employee.id)
          .order("year", { ascending: false })
          .order("month", { ascending: false }),
        (supabase as any)
          .from("company_updates")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("posted_at", { ascending: false }),
      ]);
      if (slips) setPayslips(slips as Payslip[]);
      if (upds) setUpdates(upds as CompanyUpdate[]);
      setLoading(false);
    }
    fetch();
  }, [employee.id]);

  const latestSlip = payslips[0];

  return (
    <div className="min-h-screen bg-[#0d0a04]">
      {/* Top bar */}
      <div className="bg-brand-dark/80 border-b border-white/5 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0">
              <span className="text-brand-gold font-bold text-sm">
                {employee.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{employee.full_name}</p>
              <p className="text-white/40 text-xs">{employee.role} · {employee.employee_code}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Welcome + summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 border border-white/10 bg-white/[0.02] p-5">
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">Welcome back</p>
            <h2 className="font-display text-2xl font-bold text-white">{employee.full_name.split(" ")[0]} 👋</h2>
            <p className="text-white/40 text-sm mt-1">{employee.department} · {employee.role}</p>
            {employee.joining_date && (
              <div className="flex items-center gap-1.5 text-white/30 text-xs mt-3">
                <CalendarDays className="w-3.5 h-3.5" />
                Joined {new Date(employee.joining_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </div>
          <div className="border border-brand-gold/20 bg-brand-gold/5 p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4 text-brand-gold" />
              <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Latest Pay</p>
            </div>
            {latestSlip ? (
              <>
                <p className="font-display text-3xl font-bold text-brand-gold">
                  ₹{latestSlip.net_pay.toLocaleString("en-IN")}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  {MONTH_NAMES[latestSlip.month - 1]} {latestSlip.year}
                </p>
              </>
            ) : (
              <p className="text-white/30 text-sm">No payslips yet</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {([
            { id: "updates", label: "Company Updates", icon: Megaphone },
            { id: "payslips", label: "My Payslips", icon: FileText },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                tab === id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-white/30 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white/5 animate-pulse" />)}
          </div>
        ) : tab === "updates" ? (
          <div className="flex flex-col gap-4">
            {updates.length === 0 && (
              <p className="text-white/30 text-sm py-8 text-center">No updates posted yet.</p>
            )}
            {updates.map((u) => (
              <div
                key={u.id}
                className={`border p-5 flex flex-col gap-3 ${
                  u.is_pinned
                    ? "border-brand-gold/30 bg-brand-gold/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white font-bold text-base leading-snug">{u.title}</h3>
                  {u.is_pinned && (
                    <span className="flex items-center gap-1 text-brand-gold text-[10px] font-bold tracking-widest uppercase shrink-0 bg-brand-gold/10 px-2 py-1">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{u.content}</p>
                <p className="text-white/25 text-xs">
                  {new Date(u.posted_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {payslips.length === 0 && (
              <p className="text-white/30 text-sm py-8 text-center">No payslips available yet.</p>
            )}
            <div className="flex items-center gap-2 mb-1">
              <BadgeCheck className="w-4 h-4 text-green-400" />
              <p className="text-white/40 text-xs">Click a payslip to see the full breakdown</p>
            </div>
            {payslips.map((slip) => (
              <PayslipCard key={slip.id} slip={slip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem(STAFF_SESSION_KEY);
    if (savedId) {
      (supabase as any)
        .from("employees")
        .select("*")
        .eq("id", savedId)
        .eq("is_active", true)
        .single()
        .then(({ data }: { data: Employee | null }) => {
          if (data) setEmployee(data);
          setChecked(true);
        });
    } else {
      setChecked(true);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem(STAFF_SESSION_KEY);
    setEmployee(null);
  }

  if (!checked) return null;
  if (!employee) return <LoginScreen onLogin={setEmployee} />;
  return <StaffDashboard employee={employee} onLogout={handleLogout} />;
}
