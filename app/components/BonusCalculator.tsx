"use client";

import { useState, useRef, useEffect } from "react";
import GoldFireworks from "./GoldFireworks";

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
  const [fireworkTrigger, setFireworkTrigger] = useState(false);
  const prevBonusRef = useRef<number | null>(null);
  const gpNum = Number(gp.replace(/,/g, ""));
  const activeTier = gp ? getTier(gpNum) : null;
  const bonus = gp ? calcBonus(gpNum) : null;

  useEffect(() => {
    if (bonus !== null && bonus > 0 && prevBonusRef.current !== bonus) {
      setFireworkTrigger(true);
      const timeout = setTimeout(() => setFireworkTrigger(false), 100);
      return () => clearTimeout(timeout);
    }
    prevBonusRef.current = bonus;
  }, [bonus]);

  return (
    <div className="w-full max-w-md mx-auto px-3 py-6 font-sans flex flex-col items-center">
      <img
        src="/images/logo.png"
        alt="Mission logo"
        className="h-10 w-auto mb-3"
      />
      <h2 className="text-xl font-bold mb-1 text-black text-center">Annual Bonus Program</h2>

      <p className="text-slate-400 text-xs italic mb-6 text-center">
        Bonus rate is applied to total GP based on tier achieved.
      </p>

      {/* Tier Table */}
      <h3 className="text-sm font-semibold mb-2 text-center text-black">Bonus Tiers</h3>
      <div className="overflow-x-auto mb-8 rounded-lg shadow w-full">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white">
              {["GP Range", "Bonus at Ceiling"].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => {
              const isElite = t.max === Infinity;
              const ceilBonus  = t.rate > 0 ? fmt(Math.min(t.rate * (isElite ? 1500000 : t.max), 35000)) : "—";
              const greenIntensity = i / (tiers.length - 1);
              const bgColor = `rgba(34, 197, 94, ${greenIntensity * 0.35})`;
              return (
                <tr key={i} style={{ background: bgColor }} className={i === 0 ? "italic" : ""}>
                  <td className="px-3 py-2 text-center text-black">
                    {i === 0 ? "Below $500,000" : isElite ? "$1,500,000+" : `${fmt(t.min)} – ${fmt(t.max)}`}
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-black">{ceilBonus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Milestone Payouts */}
      <h3 className="text-sm font-semibold mb-2 text-center text-black">Milestone Payouts</h3>
      <div className="overflow-x-auto mb-8 rounded-lg shadow w-full">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-700 text-white">
              {["Gross Profit", "Bonus Earned"].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examples.map((e, i) => {
              const b = calcBonus(e);
              const greenIntensity = i / (examples.length - 1);
              const bgColor = `rgba(34, 197, 94, ${greenIntensity * 0.35})`;
              return (
                <tr key={i} style={{ background: bgColor }}>
                  <td className="px-3 py-2 text-center text-black">{fmt(e)}</td>
                  <td className="px-3 py-2 text-center font-bold" style={{ color: b === 0 ? "#dc2626" : "#15803d" }}>
                    {b === 0 ? "—" : fmt(b)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Calculator */}
      <div className="bg-green-50 border border-green-300 rounded-xl p-4 w-full relative overflow-hidden">
        <GoldFireworks trigger={fireworkTrigger} />
        <h3 className="text-sm font-semibold mb-3 text-center text-black">Bonus Calculator</h3>
        <div className="flex flex-col gap-3 items-center">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter GP (e.g. 875000)"
            value={gp}
            onChange={(e) => setGp(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-3 text-sm w-full text-center text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {activeTier && bonus !== null && (
            <div className="text-sm font-bold text-center leading-relaxed" style={{ color: bonus === 0 ? "#dc2626" : "#15803d" }}>
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
