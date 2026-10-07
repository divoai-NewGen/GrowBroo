"use client";

import React, { useState } from "react";
import ContactModal from "./ContactModal";
import { CheckCircleIcon, ArrowRightIcon } from "./Icons";

const options = [
  { id: "web", name: "Web App / Next.js", baseWeeks: 3, baseCost: 12 },
  { id: "ui", name: "UI/UX & Design System", baseWeeks: 2, baseCost: 8 },
  { id: "cloud", name: "Cloud & API Architecture", baseWeeks: 2, baseCost: 10 },
  { id: "brand", name: "Brand Identity", baseWeeks: 1.5, baseCost: 6 },
  { id: "ecom", name: "Headless E-commerce", baseWeeks: 3.5, baseCost: 15 },
  { id: "ai", name: "AI & Workflow Automation", baseWeeks: 2, baseCost: 9 },
];

export default function ServiceEstimator() {
  const [selected, setSelected] = useState<string[]>(["web", "ui"]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        setSelected(selected.filter((item) => item !== id));
      }
    } else {
      setSelected([...selected, id]);
    }
  };

  const totalWeeks = selected.reduce((sum, id) => {
    const item = options.find((opt) => opt.id === id);
    return sum + (item ? item.baseWeeks : 0);
  }, 0);

  const totalCost = selected.reduce((sum, id) => {
    const item = options.find((opt) => opt.id === id);
    return sum + (item ? item.baseCost : 0);
  }, 0);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8E7D8] shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E9F8E9] text-[#006B21] border border-[#D8E7D8]">
            Interactive Scope Planner
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#050505] mt-2 tracking-tight">
            Estimate your sprint timeline &amp; scope
          </h3>
          <p className="text-xs sm:text-sm text-[#4D5C52] mt-1">
            Select the digital modules your venture requires to see instant timeline projections.
          </p>
        </div>

        {/* Multi-Select Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {options.map((opt) => {
            const isChecked = selected.includes(opt.id);
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between ${
                  isChecked
                    ? "bg-[#E9F8E9] border-[#006B21] shadow-xs ring-1 ring-[#006B21]/20"
                    : "bg-white border-[#D8E7D8] hover:border-[#006B21]/40"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#050505]">{opt.name}</div>
                  <div className="text-[10px] text-[#4D5C52] mt-0.5">
                    ~{opt.baseWeeks} wks turnaround
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isChecked ? "bg-[#006B21] text-white" : "border border-[#D8E7D8]"
                  }`}
                >
                  {isChecked && <CheckCircleIcon size={14} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Projection Outcome Banner in Dark Forest */}
        <div className="bg-[#10251A] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#39E900]">
                Estimated Delivery
              </span>
              <div className="text-2xl font-black text-white">
                {Math.ceil(totalWeeks)} - {Math.ceil(totalWeeks * 1.2)} Weeks
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-white/20" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#39E900]">
                Investment Range
              </span>
              <div className="text-2xl font-black text-white">
                ${totalCost}k - ${Math.round(totalCost * 1.35)}k
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#39E900] text-[#050505] font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-95"
          >
            <span>Lock In Scope</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
