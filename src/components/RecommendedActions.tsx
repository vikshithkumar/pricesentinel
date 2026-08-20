import React from "react";
import { recommendedActions } from "../mockData";

export const RecommendedActions: React.FC = () => {
  return (
    <div className="bg-[#ffffff] rounded-[16px] border border-[#e2e8f0] shadow-[rgba(0,0,0,0.1)_0px_0px_4px_-2px] p-4">
      <h3 className="font-inter text-[16px] text-[#020520] font-semibold mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-[#145aff]">bolt</span>
        Recommended Actions
      </h3>

      <div className="flex flex-col gap-2">
        {recommendedActions.map((action, idx) => (
          <button
            key={idx}
            className="w-full bg-[#f1f5f9] hover:bg-[#f0f4fe] border border-[#e2e8f0] hover:border-[#145aff]/30 transition-colors duration-150 rounded-[12px] p-3 flex items-center justify-between group text-left"
          >
            <div>
              <div className="text-[13px] font-inter font-semibold text-[#020520]">{action.title}</div>
              <div className="text-[12px] font-inter text-[#374151] mt-0.5">{action.description}</div>
              {action.hasActionLink && (
                <div className="mt-2">
                  <span
                    className="text-[11px] font-inter text-[#145aff] font-semibold hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    View Health Status
                  </span>
                </div>
              )}
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#6b7280] group-hover:text-[#145aff] transition-colors">
              arrow_forward
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

