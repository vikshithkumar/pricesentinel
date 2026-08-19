import React from "react";
import { recommendedActions } from "../mockData";

export const RecommendedActions: React.FC = () => {
  return (
    <div className="bg-canvas-white rounded-xl border border-hairline shadow-sm p-md">
      <h3 className="font-body-strong text-[16px] text-ink font-semibold mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
        Recommended Actions
      </h3>

      <div className="flex flex-col gap-2">
        {recommendedActions.map((action, idx) => (
          <button
            key={idx}
            className="w-full bg-surface-container-low hover:bg-surface-container border border-hairline hover:border-primary/30 transition-colors rounded-lg p-3 flex items-center justify-between group text-left"
          >
            <div>
              <div className="text-[13px] font-semibold text-ink">{action.title}</div>
              <div className="text-[11px] text-secondary mt-0.5">{action.description}</div>
              {action.hasActionLink && (
                <div className="mt-2">
                  <span
                    className="text-[11px] text-primary font-semibold hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    View Health Status
                  </span>
                </div>
              )}
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary transition-colors">
              arrow_forward
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
