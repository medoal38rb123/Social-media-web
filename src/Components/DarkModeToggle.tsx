import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getInitialDark() {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === "dark";
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useDarkMode() {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return [dark, setDark] as const;
}

const cloud =
  "absolute rounded-full bg-white transition duration-[600ms] motion-reduce:transition-none " +
  "group-aria-checked:translate-y-[14px] group-aria-checked:opacity-0";

const star =
  "absolute rounded-full bg-white opacity-0 -translate-y-[5px] transition duration-[600ms] " +
  "motion-reduce:transition-none group-aria-checked:translate-y-0 group-aria-checked:opacity-100";

export default function DarkModeToggle({ className = "" }) {
  const [dark, setDark] = useDarkMode();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={() => setDark((d) => !d)}
      className={
        "group relative h-7 w-14.5 shrink-0 cursor-pointer overflow-hidden rounded-full border-0 p-0 " +
        "bg-[#8EC5F2] dark:bg-[#1D2552] " +
        "shadow-[inset_0_0_0_1px_#6FAEE3,inset_0_2px_5px_rgba(0,0,0,.18)] " +
        "dark:shadow-[inset_0_0_0_1px_#2B3570,inset_0_2px_5px_rgba(0,0,0,.18)] " +
        "transition-[background,box-shadow] duration-500 motion-reduce:transition-none " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 " +
        "focus-visible:outline-current " +
        className
      }
    >
      {/* Clouds (day) */}
      <span className={`${cloud} bottom-1.5 right-1.5 h-1.25 w-3.75 opacity-95`} />
      <span className={`${cloud} bottom-2.5 right-4 h-1 w-2.5 opacity-70`} />

      {/* Stars (night) */}
      <span className={`${star} left-2 top-1.75 size-[1.5px]`} />
      <span className={`${star} left-4 top-4.25 size-px delay-75`} />
      <span className={`${star} left-6 top-2 size-px delay-150`} />
      <span className={`${star} left-8 top-4.5 size-[1.5px] delay-200`} />

      {/* Sun / moon */}
      <span
        className={
          "absolute left-0.75 top-0.75 size-5.5 rounded-full bg-[#FFC83D] " +
          "shadow-[0_0_0_2px_rgba(255,200,61,.28),0_1px_3px_rgba(0,0,0,.25)] " +
          "transition-[transform,background,box-shadow] duration-550 " +
          "ease-[cubic-bezier(.5,-.3,.25,1.3)] motion-reduce:transition-none " +
          "group-aria-checked:translate-x-7.5 group-aria-checked:bg-[#ECEAE0] " +
          "group-aria-checked:shadow-[0_0_0_2px_rgba(236,234,224,.14),0_1px_3px_rgba(0,0,0,.4)]"
        }
      >
        {/* Craters */}
        <span className="absolute inset-0 opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-aria-checked:opacity-100">
          <i className="absolute left-1 top-1.25 size-1.5 rounded-full bg-[#CFCBBB]" />
          <i className="absolute left-3 top-2.5 size-1 rounded-full bg-[#CFCBBB]" />
          <i className="absolute left-1.75 top-3.75 size-0.5 rounded-full bg-[#CFCBBB]" />
        </span>
      </span>
    </button>
  );
}