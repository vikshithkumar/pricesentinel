import React from "react";
import { recommendedActions } from "../mockData";

export const RecommendedActions: React.FC = () => {
  return (
    <div className="bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md rounded-[24px] border border-bone-light dark:border-white/10 p-6 shadow-sm dark:shadow-glass transition-colors duration-200">
      <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium mb-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-[4px] bg-vapor dark:bg-white/5 border border-bone-light dark:border-white/10 flex items-center justify-center text-carbon dark:text-bone">
          <span className="material-symbols-outlined text-[15px]">bolt</span>
        </div>
        Recommended Actions
      </h3>

      <div className="flex flex-col gap-3">
        {recommendedActions.map((action, idx) => (
          <button
            key={idx}
            className="w-full bg-vapor dark:bg-white/[0.03] hover:bg-[#e4e4e7] dark:hover:bg-white/[0.08] border border-bone-light dark:border-white/10 hover:border-mist dark:hover:border-white/20 transition-all duration-150 rounded-[16px] p-4 flex items-center justify-between group text-left"
          >
            <div>
              <div className="text-[14px] font-geist font-medium text-ink-black dark:text-bone">{action.title}</div>
              <div className="text-[13px] font-dm-sans text-steel dark:text-ash mt-1">{action.description}</div>
              {action.hasActionLink && (
                <div className="mt-2.5">
                  <span
                    className="text-[12px] font-dm-sans text-signal-blue dark:text-white underline underline-offset-4 decoration-signal-blue/30 dark:decoration-white/30 hover:decoration-signal-blue dark:hover:decoration-white transition-colors cursor-pointer font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    View Health Status
                  </span>
                </div>
              )}
            </div>
            <span className="material-symbols-outlined text-[18px] text-steel dark:text-ash group-hover:text-carbon dark:group-hover:text-white transition-colors ml-2 shrink-0">
              arrow_forward
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};



