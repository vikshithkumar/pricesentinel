// Date & Time Utility - Dynamic Live Date/Time Engine for PriceSentinel

export const getGreeting = (name: string = "Sarah"): string => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
};

export const getFormattedCurrentDate = (format?: string): string => {
  const now = new Date();
  if (format === "DD/MM/YYYY") {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${now.getFullYear()}`;
  } else if (format === "YYYY-MM-DD") {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }
  return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getFormattedCurrentTime = (includeSeconds = false): string => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined
  });
};

export const getRelativeTime = (offsetMinutes: number): string => {
  if (offsetMinutes <= 0) return "Just now";
  if (offsetMinutes === 1) return "1 min ago";
  if (offsetMinutes < 60) return `${offsetMinutes} mins ago`;
  const hours = Math.floor(offsetMinutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export const getRelativeDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getRelativeDateTimeString = (daysAgo: number, timeStr = "10:42 AM"): string => {
  if (daysAgo === 0) return `Today, ${getFormattedCurrentTime()}`;
  if (daysAgo === 1) return `Yesterday, ${timeStr}`;
  return `${getRelativeDateString(daysAgo)}, ${timeStr}`;
};
