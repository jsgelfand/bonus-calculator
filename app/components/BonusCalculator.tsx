"use client";

import { useState, useRef, useEffect } from "react";
import GoldFireworks from "./GoldFireworks";

const tiers = [
  { label: "Below Threshold", min: 0,        max: 124499,  bonusAtCeiling: 0 },
  { label: "Tier 1",          min: 124500,   max: 187499,  bonusAtCeiling: 1875 },
  { label: "Tier 2",          min: 187500,   max: 249999,  bonusAtCeiling: 4167 },
  { label: "Tier 3",          min: 250000,   max: 312499,  bonusAtCeiling: 7813 },
  { label: "Tier 4",          min: 312500,   max: 374999,  bonusAtCeiling: 11250 },
  { label: "Tier 5",          min: 375000,   max: Infinity,   bonusAtCeiling: 12500 },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });

function getTier(gp: number) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (gp >= tiers[i].min) return tiers[i];
  }
  return tiers[0];
}

function calcBonus(gp: number) {
  const tier = getTier(gp);
  if (tier.bonusAtCeiling === 0) return 0;
  
  const tierIndex = tiers.indexOf(tier);
  
  // For Tier 1, start at $1 and interpolate to ceiling
  if (tierIndex === 1) {
    const tierRange = tier.max - tier.min;
    const positionInTier = Math.min((gp - tier.min) / tierRange, 1);
    // Start at $1, interpolate to $1,875
    return 1 + (positionInTier * (tier.bonusAtCeiling - 1));
  }
  
  // For other tiers, interpolate between previous tier's ceiling bonus and current tier's ceiling bonus
  const tierRange = tier.max === Infinity ? 1 : tier.max - tier.min;
  const positionInTier = tier.max === Infinity ? 1 : Math.min((gp - tier.min) / tierRange, 1);
  const prevTierBonus = tiers[tierIndex - 1].bonusAtCeiling;
  const bonusRange = tier.bonusAtCeiling - prevTierBonus;
  return prevTierBonus + (positionInTier * bonusRange);
}

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
        className="h-[50px] w-auto mb-3"
      />
      <h2 className="text-xl font-bold mb-1 text-black text-center">Quarterly Bonus Program</h2>

      <p className="text-slate-400 text-xs italic mb-6 text-center">
        Bonus rate is applied to total GP based on tier achieved.
      </p>

      {/* Tier Table */}
      <h3 className="text-sm font-semibold mb-2 text-center text-black">Bonus Tiers</h3>
      <div className="overflow-x-auto mb-8 rounded-lg shadow w-full">
        <table className="w-full border-collapse text-xs table-fixed">
          <thead>
            <tr className="bg-slate-800 text-white">
              {["GP Range", "Bonus at Ceiling"].map((h) => (
                <th key={h} className="w-1/2 px-3 py-2 text-center font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => {
              const isTop = t.max === Infinity;
              const isZeroTier = t.bonusAtCeiling === 0;
              const greenIntensity = isZeroTier ? 0 : i / (tiers.length - 1);
              const bgColor = isZeroTier ? "#f1f5f9" : `rgba(34, 197, 94, ${greenIntensity * 0.35})`;
              return (
                <tr key={i} style={{ background: bgColor }}>
                  <td className="w-1/2 px-3 py-2 text-center text-black">
                    {isTop ? `${fmt(t.min)}+` : `${fmt(t.min)} – ${fmt(t.max)}`}
                  </td>
                  <td className="w-1/2 px-3 py-2 text-center font-bold text-black">{fmt(t.bonusAtCeiling)}</td>
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
                ? "No bonus — below $125K threshold"
                : `${activeTier.label} → ${fmt(bonus)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
