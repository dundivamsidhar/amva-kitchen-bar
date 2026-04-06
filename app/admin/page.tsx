"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ShieldCheck,
  ChefHat,
  Star,
  UtensilsCrossed,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Users,
  Megaphone,
  Plus,
  Trash2,
  FileText,
  Pin,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

// ─── Staff Types ──────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  full_name: string;
  role: string;
  department: string;
  employee_code: string;
  email: string;
  password: string;
  phone: string | null;
  joining_date: string | null;
  is_active: boolean;
}

interface Payslip {
  id: string;
  employee_id: string;
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
}

interface CompanyUpdate {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  posted_at: string;
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Staff Tab ────────────────────────────────────────────────────────────────

function StaffTab() {
  const [subTab, setSubTab] = useState<"employees" | "payslips" | "updates">("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // ── New employee form ──
  const [newEmp, setNewEmp] = useState({ full_name: "", role: "", department: "Kitchen", employee_code: "", email: "", password: "", phone: "", joining_date: "" });
  const [savingEmp, setSavingEmp] = useState(false);
  const [empMsg, setEmpMsg] = useState("");

  // ── New update form ──
  const [newUpd, setNewUpd] = useState({ title: "", content: "", is_pinned: false });
  const [savingUpd, setSavingUpd] = useState(false);

  // ── Payslip form ──
  const [selEmpId, setSelEmpId] = useState("");
  const [payslip, setPayslip] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic_pay: 0, hra: 0, allowances: 0, pf_deduction: 0, tax_deduction: 0, other_deductions: 0, net_pay: 0, notes: "" });
  const [savingPay, setSavingPay] = useState(false);
  const [payMsg, setPayMsg] = useState("");

  const fetchAll = useCallback(async () => {
    const [{ data: emps }, { data: upds }] = await Promise.all([
      (supabase as any).from("employees").select("*").order("full_name"),
      (supabase as any).from("company_updates").select("*").order("is_pinned", { ascending: false }).order("posted_at", { ascending: false }),
    ]);
    if (emps) setEmployees(emps as Employee[]);
    if (upds) setUpdates(upds as CompanyUpdate[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-calculate net pay
  useEffect(() => {
    const gross = payslip.basic_pay + payslip.hra + payslip.allowances;
    const deductions = payslip.pf_deduction + payslip.tax_deduction + payslip.other_deductions;
    setPayslip((p) => ({ ...p, net_pay: gross - deductions }));
  }, [payslip.basic_pay, payslip.hra, payslip.allowances, payslip.pf_deduction, payslip.tax_deduction, payslip.other_deductions]);

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmp.full_name || !newEmp.email || !newEmp.password || !newEmp.employee_code || !newEmp.role) {
      setEmpMsg("Please fill in all required fields."); return;
    }
    setSavingEmp(true);
    const { error } = await (supabase as any).from("employees").insert({ ...newEmp, phone: newEmp.phone || null, joining_date: newEmp.joining_date || null });
    if (error) { setEmpMsg("Error: " + (error.message || "Could not add employee")); }
    else {
      setEmpMsg("Employee added successfully!");
      setNewEmp({ full_name: "", role: "", department: "Kitchen", employee_code: "", email: "", password: "", phone: "", joining_date: "" });
      fetchAll();
    }
    setSavingEmp(false);
    setTimeout(() => setEmpMsg(""), 4000);
  }

  async function toggleActive(emp: Employee) {
    await (supabase as any).from("employees").update({ is_active: !emp.is_active }).eq("id", emp.id);
    fetchAll();
  }

  async function deleteEmployee(id: string) {
    if (!confirm("Delete this employee? This removes all their payslips too.")) return;
    await (supabase as any).from("employees").delete().eq("id", id);
    fetchAll();
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newUpd.title || !newUpd.content) return;
    setSavingUpd(true);
    await (supabase as any).from("company_updates").insert(newUpd);
    setNewUpd({ title: "", content: "", is_pinned: false });
    fetchAll();
    setSavingUpd(false);
  }

  async function deleteUpdate(id: string) {
    await (supabase as any).from("company_updates").delete().eq("id", id);
    fetchAll();
  }

  async function togglePin(upd: CompanyUpdate) {
    await (supabase as any).from("company_updates").update({ is_pinned: !upd.is_pinned }).eq("id", upd.id);
    fetchAll();
  }

  async function addPayslip(e: React.FormEvent) {
    e.preventDefault();
    if (!selEmpId) { setPayMsg("Please select an employee."); return; }
    setSavingPay(true);
    const { error } = await (supabase as any).from("payslips").upsert({ employee_id: selEmpId, ...payslip, notes: payslip.notes || null }, { onConflict: "employee_id,month,year" });
    if (error) { setPayMsg("Error: " + (error.message || "Failed to save payslip")); }
    else {
      setPayMsg("Payslip saved successfully!");
      setPayslip({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic_pay: 0, hra: 0, allowances: 0, pf_deduction: 0, tax_deduction: 0, other_deductions: 0, net_pay: 0, notes: "" });
    }
    setSavingPay(false);
    setTimeout(() => setPayMsg(""), 4000);
  }

  const DEPTS = ["Kitchen", "Bar", "Service", "Management", "Housekeeping"];
  const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm py-2.5 px-3 outline-none focus:border-brand-gold transition-colors";
  const numInputCls = inputCls + " text-right";

  if (loading) return <div className="h-40 bg-white/5 animate-pulse mt-4" />;

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab bar */}
      <div className="flex gap-0 border-b border-white/10">
        {([
          { id: "employees", label: "Employees", icon: Users },
          { id: "payslips",  label: "Add Payslip", icon: FileText },
          { id: "updates",   label: "Company Updates", icon: Megaphone },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-widest uppercase border-b-2 -mb-px transition-colors ${
              subTab === id ? "border-brand-gold text-brand-gold" : "border-transparent text-white/30 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── Employees ── */}
      {subTab === "employees" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add form */}
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2"><Plus className="w-3.5 h-3.5" />Add Employee</h3>
            <form onSubmit={addEmployee} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="text-white/30 text-[10px] uppercase tracking-widest">Full Name *</label><input className={inputCls} value={newEmp.full_name} onChange={(e) => setNewEmp({ ...newEmp, full_name: e.target.value })} placeholder="e.g. Ravi Kumar" /></div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Employee Code *</label><input className={inputCls} value={newEmp.employee_code} onChange={(e) => setNewEmp({ ...newEmp, employee_code: e.target.value })} placeholder="AK001" /></div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Role *</label><input className={inputCls} value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })} placeholder="Chef, Waiter…" /></div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Department</label>
                  <select className={inputCls} value={newEmp.department} onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}>
                    {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Phone</label><input className={inputCls} value={newEmp.phone} onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })} placeholder="9876543210" /></div>
                <div className="col-span-2"><label className="text-white/30 text-[10px] uppercase tracking-widest">Email *</label><input type="email" className={inputCls} value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="ravi@amvakitchen.in" /></div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Password *</label><input className={inputCls} value={newEmp.password} onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })} placeholder="Set login password" /></div>
                <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Joining Date</label><input type="date" className={inputCls} value={newEmp.joining_date} onChange={(e) => setNewEmp({ ...newEmp, joining_date: e.target.value })} /></div>
              </div>
              {empMsg && <p className={`text-xs ${empMsg.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>{empMsg}</p>}
              <button type="submit" disabled={savingEmp} className="mt-1 py-2.5 bg-brand-gold text-brand-black font-bold text-xs tracking-widest uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
                {savingEmp ? "Adding…" : "Add Employee"}
              </button>
            </form>
          </div>

          {/* Employee list */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">{employees.length} Employees</h3>
            {employees.length === 0 && <p className="text-white/30 text-sm">No employees added yet.</p>}
            {employees.map((emp) => (
              <div key={emp.id} className={`border px-4 py-3 flex items-center justify-between gap-3 ${emp.is_active ? "border-white/10 bg-white/[0.02]" : "border-white/5 opacity-50"}`}>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{emp.full_name}</p>
                  <p className="text-white/40 text-xs">{emp.employee_code} · {emp.role} · {emp.department}</p>
                  <p className="text-white/25 text-xs">{emp.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(emp)} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border transition-colors ${emp.is_active ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-white/10 text-white/30 hover:border-white/30"}`}>
                    {emp.is_active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => deleteEmployee(emp.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Payslips ── */}
      {subTab === "payslips" && (
        <div className="max-w-2xl">
          <form onSubmit={addPayslip} className="border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Add / Update Payslip</h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3">
                <label className="text-white/30 text-[10px] uppercase tracking-widest">Employee *</label>
                <select className={inputCls} value={selEmpId} onChange={(e) => setSelEmpId(e.target.value)}>
                  <option value="">Select employee…</option>
                  {employees.filter((e) => e.is_active).map((e) => <option key={e.id} value={e.id}>{e.full_name} ({e.employee_code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 text-[10px] uppercase tracking-widest">Month</label>
                <select className={inputCls} value={payslip.month} onChange={(e) => setPayslip({ ...payslip, month: Number(e.target.value) })}>
                  {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 text-[10px] uppercase tracking-widest">Year</label>
                <input type="number" className={inputCls} value={payslip.year} onChange={(e) => setPayslip({ ...payslip, year: Number(e.target.value) })} />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Earnings (₹)</p>
              <div className="grid grid-cols-3 gap-3">
                {([["Basic Pay", "basic_pay"], ["HRA", "hra"], ["Allowances", "allowances"]] as const).map(([label, key]) => (
                  <div key={key}><label className="text-white/30 text-[10px] uppercase tracking-widest">{label}</label><input type="number" min="0" className={numInputCls} value={payslip[key]} onChange={(e) => setPayslip({ ...payslip, [key]: Number(e.target.value) })} /></div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Deductions (₹)</p>
              <div className="grid grid-cols-3 gap-3">
                {([["PF", "pf_deduction"], ["Tax (TDS)", "tax_deduction"], ["Other", "other_deductions"]] as const).map(([label, key]) => (
                  <div key={key}><label className="text-white/30 text-[10px] uppercase tracking-widest">{label}</label><input type="number" min="0" className={numInputCls} value={payslip[key]} onChange={(e) => setPayslip({ ...payslip, [key]: Number(e.target.value) })} /></div>
                ))}
              </div>
            </div>

            <div className="bg-brand-gold/10 border border-brand-gold/30 px-4 py-3 flex justify-between items-center">
              <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Net Pay</span>
              <span className="text-brand-gold font-display text-2xl font-bold">₹{payslip.net_pay.toLocaleString("en-IN")}</span>
            </div>

            <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Notes (optional)</label><input className={inputCls} value={payslip.notes} onChange={(e) => setPayslip({ ...payslip, notes: e.target.value })} placeholder="Bonus included, LOP applied…" /></div>

            {payMsg && <p className={`text-xs ${payMsg.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>{payMsg}</p>}
            <button type="submit" disabled={savingPay} className="py-2.5 bg-brand-gold text-brand-black font-bold text-xs tracking-widest uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
              {savingPay ? "Saving…" : "Save Payslip"}
            </button>
          </form>
        </div>
      )}

      {/* ── Updates ── */}
      {subTab === "updates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Post form */}
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2"><Plus className="w-3.5 h-3.5" />Post Update</h3>
            <form onSubmit={postUpdate} className="flex flex-col gap-3">
              <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Title *</label><input className={inputCls} value={newUpd.title} onChange={(e) => setNewUpd({ ...newUpd, title: e.target.value })} placeholder="e.g. New Schedule for March" /></div>
              <div><label className="text-white/30 text-[10px] uppercase tracking-widest">Message *</label><textarea rows={4} className={inputCls + " resize-none"} value={newUpd.content} onChange={(e) => setNewUpd({ ...newUpd, content: e.target.value })} placeholder="Write the update for all staff…" /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newUpd.is_pinned} onChange={(e) => setNewUpd({ ...newUpd, is_pinned: e.target.checked })} className="accent-brand-gold" />
                <span className="text-white/50 text-sm flex items-center gap-1"><Pin className="w-3.5 h-3.5 text-brand-gold" /> Pin this update</span>
              </label>
              <button type="submit" disabled={savingUpd} className="mt-1 py-2.5 bg-brand-gold text-brand-black font-bold text-xs tracking-widest uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50">
                {savingUpd ? "Posting…" : "Post Update"}
              </button>
            </form>
          </div>

          {/* Updates list */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-1">{updates.length} Updates</h3>
            {updates.length === 0 && <p className="text-white/30 text-sm">No updates posted yet.</p>}
            {updates.map((u) => (
              <div key={u.id} className={`border p-4 ${u.is_pinned ? "border-brand-gold/30 bg-brand-gold/5" : "border-white/10 bg-white/[0.02]"}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm leading-snug">{u.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => togglePin(u)} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border transition-colors ${u.is_pinned ? "border-brand-gold/40 text-brand-gold" : "border-white/10 text-white/30 hover:border-brand-gold/30"}`}>
                      <Pin className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteUpdate(u.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-white/50 text-xs line-clamp-2">{u.content}</p>
                <p className="text-white/25 text-[10px] mt-1">{new Date(u.posted_at).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  id: number;
  menu_item_name: string;
  menu_item_price: number;
  quantity: number;
  notes: string | null;
}

interface Order {
  id: string;
  table_number: number;
  customer_name: string | null;
  status: "new" | "acknowledged" | "preparing" | "ready" | "served" | "cancelled";
  notes: string | null;
  total: number;
  payment_method?: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  is_available: boolean;
  is_special_today: boolean;
  special_note: string | null;
}

interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-500/20 text-red-400 border border-red-500/30",
  acknowledged: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  preparing: "bg-blue-400/20 text-blue-400 border border-blue-400/30",
  ready: "bg-green-400/20 text-green-400 border border-green-400/30",
  served: "bg-white/10 text-white/40 border border-white/10",
  cancelled: "bg-white/5 text-white/20 border border-white/5",
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── PIN Screen ──────────────────────────────────────────────────────────────

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
    if (pin === correct) {
      sessionStorage.setItem("amva_admin", "1");
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0a04] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6 mb-10">
          <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-brand-gold" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-white/40 text-sm mt-1">Enter your PIN to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              maxLength={8}
              autoFocus
              className={`w-full bg-white/5 border ${
                error ? "border-red-500" : "border-white/10"
              } text-white text-center text-2xl tracking-[0.5em] py-4 px-6 outline-none focus:border-brand-gold transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPin((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center">Incorrect PIN. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-brand-gold text-brand-black font-bold tracking-widest uppercase text-sm hover:bg-brand-gold/90 transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Tab: Orders ─────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function changeStatus(orderId: string, status: string) {
    await (supabase as any).from("orders").update({ status }).eq("id", orderId);
    fetchOrders();
  }

  if (loading) {
    return (
      <div className="grid gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {orders.length === 0 && (
        <p className="text-white/30 text-center py-12">No orders yet.</p>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-white">
                Table {order.table_number}
              </span>
              {order.customer_name && (
                <span className="text-white/40 text-sm">· {order.customer_name}</span>
              )}
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${
                  STATUS_COLORS[order.status] || ""
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs">{formatTime(order.created_at)}</span>
              {order.payment_method && (
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-white/10 text-white/40">
                  {order.payment_method}
                </span>
              )}
              <span className="text-brand-gold font-bold">
                ₹{order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-wrap gap-2">
            {order.order_items.map((oi) => (
              <span
                key={oi.id}
                className="text-xs px-2 py-1 bg-white/5 text-white/60 border border-white/5"
              >
                {oi.quantity}× {oi.menu_item_name}
              </span>
            ))}
          </div>

          {/* Status change */}
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs">Change status:</span>
            <select
              value={order.status}
              onChange={(e) => changeStatus(order.id, e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 outline-none focus:border-brand-gold"
            >
              {["new", "acknowledged", "preparing", "ready", "served", "cancelled"].map(
                (s) => (
                  <option key={s} value={s} className="bg-[#1a1510]">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Today's Specials ────────────────────────────────────────────────────

function SpecialsTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data } = await (supabase as any)
        .from("menu_items")
        .select("id, name, description, price, category_id, is_available, is_special_today, special_note")
        .order("name");
      if (data) setItems(data as MenuItem[]);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleSpecial(item: MenuItem) {
    setSaving(item.id);
    const newVal = !item.is_special_today;
    await (supabase as any)
      .from("menu_items")
      .update({ is_special_today: newVal })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_special_today: newVal } : i))
    );
    setSaving(null);
  }

  async function saveNote(item: MenuItem, note: string) {
    setSaving(item.id);
    await (supabase as any)
      .from("menu_items")
      .update({ special_note: note || null })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, special_note: note || null } : i))
    );
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-white/30 text-sm mb-4">
        {items.filter((i) => i.is_special_today).length} item(s) marked as today&apos;s special
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border p-4 flex flex-col gap-3 transition-colors ${
              item.is_special_today
                ? "border-brand-gold/40 bg-brand-gold/5"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.name}</p>
                <p className="text-white/40 text-xs mt-0.5">₹{item.price}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => toggleSpecial(item)}
                disabled={saving === item.id}
                className={`relative w-11 h-6 flex-shrink-0 transition-colors rounded-full ${
                  item.is_special_today ? "bg-brand-gold" : "bg-white/10"
                } disabled:opacity-50`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    item.is_special_today ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {item.is_special_today && (
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-brand-gold flex-shrink-0" />
                <input
                  type="text"
                  defaultValue={item.special_note || ""}
                  placeholder="Chef's note (optional)"
                  onBlur={(e) => {
                    if (e.target.value !== (item.special_note || "")) {
                      saveNote(item, e.target.value);
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-2 py-1.5 outline-none focus:border-brand-gold placeholder:text-white/20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Menu ───────────────────────────────────────────────────────────────

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        (supabase as any).from("menu_categories").select("*").order("display_order"),
        (supabase as any)
          .from("menu_items")
          .select("id, name, price, category_id, is_available, is_special_today, special_note")
          .order("name"),
      ]);
      if (cats) setCategories(cats as MenuCategory[]);
      if (menuItems) setItems(menuItems as MenuItem[]);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleAvailable(item: MenuItem) {
    setSaving(item.id);
    const newVal = !item.is_available;
    await (supabase as any)
      .from("menu_items")
      .update({ is_available: newVal })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: newVal } : i))
    );
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category_id === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id}>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold mb-3 flex items-center gap-2">
              {cat.name}
              <span className="text-white/20 font-normal normal-case tracking-normal">
                ({catItems.length} items)
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className={`border px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                    item.is_available
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-white/5 bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => toggleAvailable(item)}
                    disabled={saving === item.id}
                    title={item.is_available ? "Mark unavailable" : "Mark available"}
                    className={`relative w-11 h-6 flex-shrink-0 transition-colors rounded-full ${
                      item.is_available ? "bg-green-500/70" : "bg-white/10"
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        item.is_available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Reservations Tab ─────────────────────────────────────────────────────────

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  guests: number;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: string;
}

function ReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    const query = (supabase as any).from("reservations").select("*").order("date", { ascending: true }).order("time", { ascending: true });
    const { data } = filter === "upcoming"
      ? await query.gte("date", new Date().toISOString().slice(0, 10))
      : await query;
    if (data) setReservations(data as Reservation[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/update-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to update reservation.");
      } else {
        toast.success(`Reservation ${status}.`);
        await fetchReservations();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const statusStyle: Record<string, string> = {
    pending:   "border-yellow-500/40 text-yellow-400 bg-yellow-500/5",
    confirmed: "border-green-500/40 text-green-400 bg-green-500/5",
    cancelled: "border-white/10 text-white/30 bg-white/[0.02]",
    seated:    "border-blue-400/40 text-blue-400 bg-blue-400/5",
  };

  if (loading) return <p className="text-white/30 text-sm py-12 text-center">Loading reservations…</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
          {reservations.length} {filter === "upcoming" ? "Upcoming" : "Total"} Reservation{reservations.length !== 1 ? "s" : ""}
        </p>
        <div className="flex border border-white/10">
          {(["upcoming", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                filter === f ? "bg-brand-gold text-brand-black" : "text-white/40 hover:text-white"
              }`}>
              {f === "upcoming" ? "Upcoming" : "All"}
            </button>
          ))}
        </div>
      </div>

      {reservations.length === 0 && (
        <p className="text-white/30 text-sm py-12 text-center">No reservations found.</p>
      )}

      <div className="flex flex-col gap-3">
        {reservations.map((r) => (
          <div key={r.id} className="border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-white font-semibold">{r.name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  <CalendarDays className="w-3 h-3 inline mr-1" />
                  {new Date(r.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  {" at "}{r.time}
                  {" · "}{r.guests} guest{r.guests !== 1 ? "s" : ""}
                </p>
                {(r.phone || r.email) && (
                  <p className="text-white/30 text-xs mt-0.5">{r.phone}{r.phone && r.email ? " · " : ""}{r.email}</p>
                )}
                {r.notes && <p className="text-yellow-400/70 text-xs mt-1">Note: {r.notes}</p>}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-1 ${statusStyle[r.status] ?? "border-white/10 text-white/30"}`}>
                {r.status}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              {r.status !== "confirmed" && r.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(r.id, "confirmed")}
                  disabled={updatingId === r.id}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {updatingId === r.id
                    ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                    : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Confirm
                </button>
              )}
              {r.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(r.id, "seated")}
                  disabled={updatingId === r.id}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {updatingId === r.id
                    ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                    : <Clock className="w-3.5 h-3.5" />}
                  Mark Seated
                </button>
              )}
              {r.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(r.id, "cancelled")}
                  disabled={updatingId === r.id}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {updatingId === r.id
                    ? <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-red-400 rounded-full animate-spin inline-block" />
                    : <XCircle className="w-3.5 h-3.5" />}
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const TABS = [
  { id: "orders",       label: "Orders",          icon: UtensilsCrossed },
  { id: "reservations", label: "Reservations",    icon: CalendarDays },
  { id: "specials",     label: "Today's Specials", icon: Star },
  { id: "menu",         label: "Menu",             icon: ChefHat },
  { id: "staff",        label: "Staff",            icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<TabId>("orders");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (sessionStorage.getItem("amva_admin") === "1") {
      setAuthed(true);
    }
    setChecked(true);
    document.body.classList.add("admin-portal");
    return () => { document.body.classList.remove("admin-portal"); };
  }, []);

  if (!checked) return null;
  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0d0a04]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-brand-gold border border-white/10 hover:border-brand-gold/40 px-4 py-2 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/kitchen"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-brand-gold border border-white/10 hover:border-brand-gold/40 px-4 py-2 transition-colors"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen
            </Link>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center border border-stone-300 dark:border-white/10 text-stone-500 dark:text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("amva_admin");
                setAuthed(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 mb-6 gap-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                tab === id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "orders"       && <OrdersTab />}
        {tab === "reservations" && <ReservationsTab />}
        {tab === "specials"     && <SpecialsTab />}
        {tab === "menu"         && <MenuTab />}
        {tab === "staff"        && <StaffTab />}
      </div>
    </div>
  );
}
