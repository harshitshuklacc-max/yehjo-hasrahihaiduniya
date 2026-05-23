"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice } from "@/lib/utils";

export default function AdminFeesPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<
    { id: string; user: { name: string }; feeRecord?: { totalFees: number; paidFees: number } }[]
  >([]);
  const [selected, setSelected] = useState("");
  const [payment, setPayment] = useState({ amount: "", method: "Cash" });

  useEffect(() => {
    fetch("/api/admin/students").then((r) => r.json()).then(setStudents);
  }, []);

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !payment.amount) return;
    const res = await fetch(`/api/admin/fees/${selected}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: { amount: Number(payment.amount), method: payment.method },
      }),
    });
    toast(res.ok ? "Payment recorded" : "Failed", res.ok ? "success" : "error");
    if (res.ok) {
      fetch("/api/admin/students").then((r) => r.json()).then(setStudents);
      setPayment({ amount: "", method: "Cash" });
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fee Management</h2>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ssa-muted border-b border-white/10">
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Paid</th>
              <th className="p-4 text-left">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const f = s.feeRecord;
              const rem = (f?.totalFees ?? 0) - (f?.paidFees ?? 0);
              return (
                <tr key={s.id} className="border-b border-white/5">
                  <td className="p-4">{s.user.name}</td>
                  <td className="p-4">{formatPrice(f?.totalFees ?? 0)}</td>
                  <td className="p-4">{formatPrice(f?.paidFees ?? 0)}</td>
                  <td className="p-4 text-ssa-accent">{formatPrice(rem)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form onSubmit={recordPayment} className="glass rounded-2xl p-6 grid gap-4 sm:grid-cols-3 max-w-2xl">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} required>
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.user.name}</option>
          ))}
        </select>
        <input type="number" placeholder="Payment amount" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} required />
        <button type="submit" className="btn-primary">Record Payment</button>
      </form>
    </div>
  );
}
