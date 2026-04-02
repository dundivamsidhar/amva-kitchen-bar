"use client";

import { useState, useEffect, useRef } from "react";
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
  ClipboardList,
  Phone,
  Mail,
  Building2,
  Pencil,
  Check,
  X,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  LogIn,
  History,
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

interface AttendanceRecord {
  id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
}

interface LeaveRequest {
  id: string;
  leave_type: "sick" | "casual" | "annual" | "other";
  from_date: string;
  to_date: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STAFF_SESSION_KEY = "amva_staff_id";

const DEPARTMENTS = ["Kitchen", "Bar", "Front of House", "Management", "Housekeeping", "Accounts", "Delivery", "Other"];

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (emp: Employee) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Sign-in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign-up state
  const [suFullName, setSuFullName] = useState("");
  const [suEmpCode, setSuEmpCode] = useState("");
  const [suRole, setSuRole] = useState("");
  const [suDept, setSuDept] = useState(DEPARTMENTS[0]);
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suJoining, setSuJoining] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(m: "signin" | "signup") {
    setMode(m);
    setError("");
  }

  async function handleSignIn(e: React.FormEvent) {
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

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!suFullName.trim()) { setError("Full name is required."); return; }
    if (!suEmpCode.trim()) { setError("Employee code is required."); return; }
    if (!suRole.trim()) { setError("Role / job title is required."); return; }
    if (!suEmail.trim()) { setError("Email is required."); return; }
    if (!suPassword) { setError("Password is required."); return; }
    if (suPassword.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    // Check for duplicate employee code
    const { data: existing } = await (supabase as any)
      .from("employees")
      .select("id")
      .eq("employee_code", suEmpCode.trim().toUpperCase())
      .single();

    if (existing) {
      setError("That employee code is already taken. Please contact your manager.");
      setLoading(false);
      return;
    }

    const newEmployee = {
      full_name: suFullName.trim(),
      employee_code: suEmpCode.trim().toUpperCase(),
      role: suRole.trim(),
      department: suDept,
      email: suEmail.trim().toLowerCase(),
      password: suPassword,
      phone: suPhone.trim() || null,
      joining_date: suJoining || null,
      is_active: true,
    };

    const { data, error: insertErr } = await (supabase as any)
      .from("employees")
      .insert([newEmployee])
      .select()
      .single();

    if (insertErr || !data) {
      setError("Could not create account. Email may already be registered.");
      setLoading(false);
      return;
    }

    localStorage.setItem(STAFF_SESSION_KEY, data.id);
    onLogin(data as Employee);
    setLoading(false);
  }

  const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 py-3 px-4 outline-none focus:border-brand-gold transition-colors";
  const labelCls = "text-white/40 text-xs font-bold tracking-widest uppercase";

  return (
    <div className="min-h-screen bg-[#0d0a04] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
            <User className="w-7 h-7 text-brand-gold" />
          </div>
          <div className="text-center">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-1">AmVa Kitchen & Bar</p>
            <h1 className="font-display text-2xl font-bold text-white">Staff Portal</h1>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex border border-white/10 mb-6">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors ${
                mode === m
                  ? "bg-brand-gold text-brand-black"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@amvakitchen.in" autoFocus className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className={inputCls} />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <p className="text-white/20 text-xs text-center">Forgot your password? Contact your manager.</p>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Full Name *</label>
              <input type="text" value={suFullName} onChange={(e) => setSuFullName(e.target.value)}
                placeholder="Rahul Sharma" autoFocus className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Emp. Code *</label>
                <input type="text" value={suEmpCode} onChange={(e) => setSuEmpCode(e.target.value)}
                  placeholder="EMP001" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Department *</label>
                <select value={suDept} onChange={(e) => setSuDept(e.target.value)}
                  className={inputCls + " appearance-none"}>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Role / Job Title *</label>
              <input type="text" value={suRole} onChange={(e) => setSuRole(e.target.value)}
                placeholder="Head Chef, Bartender, Waiter…" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Email *</label>
              <input type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)}
                placeholder="you@amvakitchen.in" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Password *</label>
              <input type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)}
                placeholder="Min. 6 characters" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Phone</label>
                <input type="tel" value={suPhone} onChange={(e) => setSuPhone(e.target.value)}
                  placeholder="+91 98765…" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Joining Date</label>
                <input type="date" value={suJoining} onChange={(e) => setSuJoining(e.target.value)}
                  className={inputCls + " [color-scheme:dark]"} />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
              {loading ? "Creating account…" : "Create Account"}
            </button>
            <p className="text-white/20 text-xs text-center">Already have an account?{" "}
              <button type="button" onClick={() => switchMode("signin")} className="text-brand-gold hover:underline">Sign in</button>
            </p>
          </form>
        )}
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

// ─── Time Clock Widget ────────────────────────────────────────────────────────

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TimeClock({ employeeId }: { employeeId: string }) {
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await (supabase as any)
        .from("attendance")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("date", today)
        .order("clock_in", { ascending: false })
        .limit(1)
        .single();
      setRecord(data ?? null);
      setLoading(false);
    }
    load();
  }, [employeeId]);

  useEffect(() => {
    if (record && !record.clock_out) {
      const start = new Date(record.clock_in).getTime();
      timerRef.current = setInterval(() => setElapsed(Date.now() - start), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (record?.clock_in && record?.clock_out) {
        setElapsed(new Date(record.clock_out).getTime() - new Date(record.clock_in).getTime());
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [record]);

  async function clockIn() {
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await (supabase as any)
      .from("attendance")
      .insert([{ employee_id: employeeId, date: today }])
      .select()
      .single();
    if (data) setRecord(data as AttendanceRecord);
    setBusy(false);
  }

  async function clockOut() {
    if (!record) return;
    setBusy(true);
    const now = new Date().toISOString();
    const { data } = await (supabase as any)
      .from("attendance")
      .update({ clock_out: now })
      .eq("id", record.id)
      .select()
      .single();
    if (data) setRecord(data as AttendanceRecord);
    setBusy(false);
  }

  const isClockedIn = !!record && !record.clock_out;
  const isClockedOut = !!record && !!record.clock_out;

  return (
    <div className={`border p-5 flex flex-col gap-4 ${isClockedIn ? "border-green-500/30 bg-green-500/5" : isClockedOut ? "border-white/10 bg-white/[0.02]" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${isClockedIn ? "text-green-400" : "text-white/40"}`} />
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Time Clock</p>
        </div>
        {isClockedIn && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            On Shift
          </span>
        )}
        {isClockedOut && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1">Shift Ended</span>
        )}
      </div>

      {loading ? (
        <div className="h-10 bg-white/5 animate-pulse" />
      ) : (
        <>
          {(isClockedIn || isClockedOut) && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">Clock In</p>
                <p className="text-white font-semibold text-sm">
                  {new Date(record!.clock_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>
              {isClockedOut && (
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">Clock Out</p>
                  <p className="text-white font-semibold text-sm">
                    {new Date(record!.clock_out!).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">{isClockedIn ? "Duration" : "Total"}</p>
                <p className={`font-display text-lg font-bold ${isClockedIn ? "text-green-400" : "text-white"}`}>
                  {fmt(elapsed)}
                </p>
              </div>
            </div>
          )}

          {!record && (
            <p className="text-white/30 text-sm">You haven&apos;t clocked in today.</p>
          )}

          <div className="flex gap-3">
            {!record && (
              <button onClick={clockIn} disabled={busy}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-widest uppercase transition-colors disabled:opacity-50">
                <LogIn className="w-4 h-4" /> {busy ? "Clocking in…" : "Clock In"}
              </button>
            )}
            {isClockedIn && (
              <button onClick={clockOut} disabled={busy}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-xs tracking-widest uppercase transition-colors disabled:opacity-50">
                <LogOut className="w-4 h-4" /> {busy ? "Clocking out…" : "Clock Out"}
              </button>
            )}
            {isClockedOut && (
              <p className="text-white/30 text-xs text-center w-full py-2">
                Shift complete. See you next time!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function StaffDashboard({ employee: initialEmployee, onLogout }: { employee: Employee; onLogout: () => void }) {
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"updates" | "payslips" | "leave" | "attendance" | "profile">("updates");

  // Leave form state
  const [leaveType, setLeaveType] = useState<LeaveRequest["leave_type"]>("casual");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveMsg, setLeaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  // Profile edit state
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneVal, setPhoneVal] = useState(employee.phone ?? "");
  const [phoneSaving, setPhoneSaving] = useState(false);

  useEffect(() => {
    async function loadAll() {
      const [{ data: slips }, { data: upds }, { data: lvs }, { data: att }] = await Promise.all([
        (supabase as any).from("payslips").select("*").eq("employee_id", employee.id)
          .order("year", { ascending: false }).order("month", { ascending: false }),
        (supabase as any).from("company_updates").select("*")
          .order("is_pinned", { ascending: false }).order("posted_at", { ascending: false }),
        (supabase as any).from("leave_requests").select("*").eq("employee_id", employee.id)
          .order("created_at", { ascending: false }),
        (supabase as any).from("attendance").select("*").eq("employee_id", employee.id)
          .order("date", { ascending: false }).limit(30),
      ]);
      if (slips) setPayslips(slips as Payslip[]);
      if (upds) setUpdates(upds as CompanyUpdate[]);
      if (lvs) setLeaves(lvs as LeaveRequest[]);
      if (att) setAttendanceHistory(att as AttendanceRecord[]);
      setLoading(false);
    }
    loadAll();
  }, [employee.id]);

  async function submitLeave(e: React.FormEvent) {
    e.preventDefault();
    setLeaveMsg(null);
    if (!leaveFrom || !leaveTo) { setLeaveMsg({ ok: false, text: "Please select both dates." }); return; }
    if (leaveTo < leaveFrom) { setLeaveMsg({ ok: false, text: "End date must be after start date." }); return; }
    setLeaveSubmitting(true);
    const { data, error } = await (supabase as any).from("leave_requests").insert([{
      employee_id: employee.id,
      leave_type: leaveType,
      from_date: leaveFrom,
      to_date: leaveTo,
      reason: leaveReason.trim() || null,
    }]).select().single();
    if (error || !data) {
      setLeaveMsg({ ok: false, text: "Failed to submit. Please try again." });
    } else {
      setLeaves((prev) => [data as LeaveRequest, ...prev]);
      setLeaveMsg({ ok: true, text: "Leave request submitted successfully." });
      setLeaveFrom(""); setLeaveTo(""); setLeaveReason(""); setLeaveType("casual");
      setShowLeaveForm(false);
    }
    setLeaveSubmitting(false);
  }

  async function savePhone() {
    setPhoneSaving(true);
    const { error } = await (supabase as any).from("employees").update({ phone: phoneVal.trim() || null }).eq("id", employee.id);
    if (!error) {
      setEmployee((e) => ({ ...e, phone: phoneVal.trim() || null }));
      setEditingPhone(false);
    }
    setPhoneSaving(false);
  }

  const latestSlip = payslips[0];
  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;

  const LEAVE_LABEL: Record<LeaveRequest["leave_type"], string> = {
    sick: "Sick Leave", casual: "Casual Leave", annual: "Annual Leave", other: "Other",
  };
  const STATUS_STYLE: Record<LeaveRequest["status"], string> = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    approved: "text-green-400 bg-green-400/10 border-green-400/20",
    rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  const STATUS_ICON = { pending: Clock, approved: CheckCircle2, rejected: XCircle };

  const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 py-2.5 px-3 outline-none focus:border-brand-gold transition-colors text-sm";

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
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 px-3 py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Time Clock */}
        <TimeClock employeeId={employee.id} />

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
        <div className="flex flex-wrap border-b border-white/10 gap-x-1">
          {([
            { id: "updates", label: "Updates", icon: Megaphone },
            { id: "payslips", label: "Payslips", icon: FileText },
            { id: "leave", label: "Leave", icon: ClipboardList, badge: pendingLeaves },
            { id: "attendance", label: "Attendance", icon: History },
            { id: "profile", label: "Profile", icon: User },
          ] as const).map(({ id, label, icon: Icon, ...rest }) => {
            const badge = "badge" in rest ? (rest as { badge: number }).badge : 0;
            return (
            <button
              key={id}
              onClick={() => setTab(id as typeof tab)}
              className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                tab === id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-white/30 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {badge ? (
                <span className="w-4 h-4 bg-yellow-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </button>
          );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white/5 animate-pulse" />)}
          </div>
        ) : tab === "updates" ? (
          /* ── Company Updates ── */
          <div className="flex flex-col gap-4">
            {updates.length === 0 && (
              <p className="text-white/30 text-sm py-8 text-center">No updates posted yet.</p>
            )}
            {updates.map((u) => (
              <div key={u.id} className={`border p-5 flex flex-col gap-3 ${u.is_pinned ? "border-brand-gold/30 bg-brand-gold/5" : "border-white/10 bg-white/[0.02]"}`}>
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

        ) : tab === "payslips" ? (
          /* ── My Payslips ── */
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

        ) : tab === "leave" ? (
          /* ── Leave Requests ── */
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Leave Requests</p>
              <button
                onClick={() => { setShowLeaveForm((v) => !v); setLeaveMsg(null); }}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold border border-brand-gold/30 hover:border-brand-gold/60 px-3 py-2 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {showLeaveForm ? "Cancel" : "Apply Leave"}
              </button>
            </div>

            {showLeaveForm && (
              <form onSubmit={submitLeave} className="border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-4">
                <p className="text-white font-semibold text-sm">New Leave Application</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Leave Type</label>
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveRequest["leave_type"])}
                      className={inputCls + " appearance-none"}>
                      <option value="casual">Casual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="annual">Annual Leave</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] font-bold tracking-widest uppercase">From</label>
                    <input type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)}
                      className={inputCls + " [color-scheme:dark]"} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] font-bold tracking-widest uppercase">To</label>
                  <input type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)}
                    className={inputCls + " [color-scheme:dark]"} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Reason (optional)</label>
                  <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)}
                    rows={3} placeholder="Brief reason for leave…"
                    className={inputCls + " resize-none"} />
                </div>
                {leaveMsg && (
                  <p className={`text-xs ${leaveMsg.ok ? "text-green-400" : "text-red-400"}`}>{leaveMsg.text}</p>
                )}
                <button type="submit" disabled={leaveSubmitting}
                  className="w-full py-2.5 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-xs hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
                  {leaveSubmitting ? "Submitting…" : "Submit Request"}
                </button>
              </form>
            )}

            {leaves.length === 0 ? (
              <p className="text-white/30 text-sm py-6 text-center">No leave requests yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {leaves.map((l) => {
                  const StatusIcon = STATUS_ICON[l.status];
                  const days = Math.round((new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) / 86400000) + 1;
                  return (
                    <div key={l.id} className="border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold text-sm">{LEAVE_LABEL[l.leave_type]}</p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {new Date(l.from_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            {" – "}
                            {new Date(l.to_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}{days} day{days !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border px-2 py-1 ${STATUS_STYLE[l.status]}`}>
                          <StatusIcon className="w-3 h-3" /> {l.status}
                        </span>
                      </div>
                      {l.reason && <p className="text-white/40 text-xs border-l-2 border-white/10 pl-3">{l.reason}</p>}
                      {l.admin_note && (
                        <p className="text-white/50 text-xs border-l-2 border-brand-gold/40 pl-3">
                          <span className="text-brand-gold/70">Manager note:</span> {l.admin_note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        ) : tab === "attendance" ? (
          /* ── Attendance History ── */
          <div className="flex flex-col gap-4">
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Attendance History (Last 30 Days)</p>
            {attendanceHistory.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">No attendance records yet.</p>
            ) : (
              <div className="border border-white/10 divide-y divide-white/5">
                {/* Header */}
                <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
                  <span>Date</span><span>Clock In</span><span>Clock Out</span><span>Duration</span>
                </div>
                {attendanceHistory.map((a) => {
                  const inMs = new Date(a.clock_in).getTime();
                  const outMs = a.clock_out ? new Date(a.clock_out).getTime() : null;
                  const durMs = outMs ? outMs - inMs : null;
                  const isToday = a.date === new Date().toISOString().slice(0, 10);
                  return (
                    <div key={a.id} className={`grid grid-cols-4 px-4 py-3 text-sm items-center ${isToday ? "bg-brand-gold/5" : ""}`}>
                      <span className={`font-medium ${isToday ? "text-brand-gold" : "text-white"}`}>
                        {isToday ? "Today" : new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-white/70">
                        {new Date(a.clock_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </span>
                      <span className={a.clock_out ? "text-white/70" : "text-yellow-400 text-xs font-bold uppercase tracking-wide"}>
                        {a.clock_out
                          ? new Date(a.clock_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
                          : "Active"}
                      </span>
                      <span className={durMs ? "text-white/70" : "text-white/30"}>
                        {durMs ? fmt(durMs) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        ) : (
          /* ── Profile ── */
          <div className="flex flex-col gap-4">
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase">My Profile</p>
            <div className="border border-white/10 bg-white/[0.02] divide-y divide-white/5">
              {[
                { icon: User, label: "Full Name", value: employee.full_name },
                { icon: Building2, label: "Department", value: employee.department },
                { icon: BadgeCheck, label: "Role", value: employee.role },
                { icon: CalendarDays, label: "Employee Code", value: employee.employee_code },
                { icon: Mail, label: "Email", value: employee.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-4">
                  <Icon className="w-4 h-4 text-brand-gold/60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">{label}</p>
                    <p className="text-white text-sm mt-0.5 truncate">{value}</p>
                  </div>
                </div>
              ))}

              {/* Phone — editable */}
              <div className="flex items-center gap-4 px-5 py-4">
                <Phone className="w-4 h-4 text-brand-gold/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Phone</p>
                  {editingPhone ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="tel" value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)}
                        placeholder="+91 98765 43210" autoFocus
                        className="flex-1 bg-white/5 border border-brand-gold/40 text-white py-1.5 px-2 text-sm outline-none" />
                      <button onClick={savePhone} disabled={phoneSaving}
                        className="text-green-400 hover:text-green-300 transition-colors p-1">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingPhone(false); setPhoneVal(employee.phone ?? ""); }}
                        className="text-white/30 hover:text-white/60 transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-white text-sm">{employee.phone || <span className="text-white/30">Not set</span>}</p>
                      <button onClick={() => setEditingPhone(true)}
                        className="text-white/20 hover:text-brand-gold transition-colors p-1">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {employee.joining_date && (
                <div className="flex items-center gap-4 px-5 py-4">
                  <CalendarDays className="w-4 h-4 text-brand-gold/60 shrink-0" />
                  <div>
                    <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Joining Date</p>
                    <p className="text-white text-sm mt-0.5">
                      {new Date(employee.joining_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
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
