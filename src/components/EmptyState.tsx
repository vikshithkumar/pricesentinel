import React from "react";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`border border-[#e2e8f0] border-dashed rounded-[16px] p-10 bg-[#ffffff] flex flex-col items-center justify-center text-center font-inter ${className}`}
    >
      <span className="material-symbols-outlined text-[48px] text-[#6b7280] mb-2 select-none">
        {icon}
      </span>
      <h3 className="font-inter text-[18px] text-[#020520] font-semibold">
        {title}
      </h3>
      {description && (
        <p className="font-inter text-[14px] text-[#6b7280] mt-1 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 bg-[#fcfcfc] border border-[#145aff] text-[#145aff] font-inter font-medium text-[13px] py-2 px-6 rounded-full inline-flex items-center gap-1.5 hover:bg-[#f0f4fe] transition-colors duration-150 shadow-sm"
        >
          {action.icon && (
            <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
          )}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

