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
      className={`border border-bone-light dark:border-white/10 border-dashed rounded-[24px] p-12 bg-white/90 dark:bg-[#161616]/60 backdrop-blur-md flex flex-col items-center justify-center text-center font-dm-sans shadow-sm dark:shadow-glass transition-colors duration-200 ${className}`}
    >
      <span className="material-symbols-outlined text-[48px] text-steel dark:text-slate mb-3 select-none">
        {icon}
      </span>
      <h3 className="font-geist text-[18px] text-ink-black dark:text-bone font-medium">
        {title}
      </h3>
      {description && (
        <p className="font-dm-sans text-[14px] text-steel dark:text-ash mt-1 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 bg-signal-blue hover:bg-deep-dusk text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-dm-sans font-medium text-[13px] py-2.5 px-6 rounded-full inline-flex items-center gap-2 transition-all shadow-sm"
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



