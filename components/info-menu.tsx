"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Coffee } from "lucide-react";

export function InfoMenu({
  demoTitle,
  demoText,
  supportTitle,
  supportText,
  supportButton,
  coffeeUrl,
  triggerLabel,
}: {
  demoTitle: string;
  demoText: string;
  supportTitle: string;
  supportText: string;
  supportButton: string;
  coffeeUrl: string;
  triggerLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide text-blue-400 hover:bg-blue-500/20 transition"
      >
        <Info size={14} />
        Demo
      </button>

      {isOpen && (
        <div
          role="dialog"
          className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-4"
        >
          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-1">
              {demoTitle}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{demoText}</p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-bold text-zinc-100 mb-1">
              {supportTitle}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              {supportText}
            </p>
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold text-sm transition"
            >
              <Coffee size={16} />
              {supportButton}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
