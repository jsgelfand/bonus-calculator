"use client";

import { useState } from "react";

const tiers = [
  { label: "Below Threshold", min: 0,        max: 499999,   rate: 0,        color: "#f8fafc", textColor: "#94a3b8" },
  { label: "Bronze",          min: 500000,   max: 749999,   rate: 0.00700,  color: "#fef3c7", textColor: "#000" },
  { label: "Silver",          min: 750000,   max: 999999,   rate: 0.01167,  color: "#e2e8f0", textColor: "#000" },
  { label: "Gold",            min: 1000000,  max: 1249999,  rate: 0.01750,  color: "#fef9c3", textColor: "#000" },
  { label: "Platinum",        min: 1250000,  max: 1499999,  rate: 0.02100,  color: "#e0f2fe", textColor: "#000" },
  { label: "Elite",           min: 1500000,  max: Infinity, rate: 0.02333,  color: "#f3e8ff", textColor: "#000" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pct = (r: number) => (r > 0 ? (r * 100).toFixed(3) + "%" : "—");

function getTier(gp: number) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (gp >= tiers[i].min) return tiers[i];
  }
  return tiers[0];
}

function calcBonus(gp: number) {
  const t = getTier(gp);
  return Math.min(t.rate * gp, 35000);
}

const examples = [499999, 500000, 750000, 1000000, 1250000, 1500000];

export default function BonusCalculator() {
  const [gp, setGp] = useState("");
  const gpNum = Number(gp.replace(/,/g, ""));
  const activeTier = gp ? getTier(gpNum) : null;
  const bonus = gp ? calcBonus(gpNum) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h2 className="text-2xl font-bold mb-1 text-black">Annual Bonus Program</h2>

      <p className="text-slate-400 text-xs italic mb-8">
        Bonus rate is applied to total GP based on tier achieved.
      </p>

      {/* Tier Table */}
      <h3 className="text-base font-semibold mb-3">Bonus Tiers</h3>
      <div className="overflow-x-auto mb-10 rounded-lg shadow">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              {["GP Range", "Bonus at Ceiling"].map((h) => (
                <th key={h} className="px-4 py-3 text-right font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => {
              const isElite = t.max === Infinity;
              const ceilBonus  = t.rate > 0 ? fmt(Math.min(t.rate * (isElite ? 1500000 : t.max), 35000)) : "—";
              return (
                <tr key={i} style={{ background: t.color, color: t.textColor }} className={i === 0 ? "italic" : ""}>
                  <td className="px-4 py-3 text-right">
                    {i === 0 ? "Below $500,000" : isElite ? "$1,500,000+" : `${fmt(t.min)} – ${fmt(t.max)}`}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{ceilBonus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Milestone Payouts */}
      <h3 className="text-base font-semibold mb-3">Milestone Payouts</h3>
      <div className="overflow-x-auto mb-10 rounded-lg shadow">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-700 text-white">
              {["Gross Profit", "Bonus Earned"].map((h) => (
                <th key={h} className="px-4 py-3 text-right font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examples.map((e, i) => {
              const b = calcBonus(e);
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-4 py-3 text-right">{fmt(e)}</td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: b === 0 ? "#dc2626" : "#15803d" }}>
                    {b === 0 ? "—" : fmt(b)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Calculator */}
      <div className="bg-green-50 border border-green-300 rounded-xl p-6">
        <h3 className="text-base font-semibold mb-4">💰 Bonus Calculator</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Enter GP (e.g. 875000)"
            value={gp}
            onChange={(e) => setGp(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {activeTier && bonus !== null && (
            <div className="text-base font-bold" style={{ color: bonus === 0 ? "#dc2626" : "#15803d" }}>
              {bonus === 0
                ? "No bonus — below $500K threshold"
                : `${activeTier.label} Tier (${pct(activeTier.rate)} × ${fmt(gpNum)}) → ${fmt(bonus)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
