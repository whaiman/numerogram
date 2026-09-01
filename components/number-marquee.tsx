"use client";

const POPULAR_NUMBERS = ["42", "13", "PI", "666", "100", "1984", "0"];

export function NumberMarquee() {
  return (
    <div
      className="w-full max-w-2xl mx-auto overflow-hidden relative py-4 flex"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div className="flex whitespace-nowrap animate-scroll w-max hover:[animation-play-state:paused]">
        {[...POPULAR_NUMBERS, ...POPULAR_NUMBERS].map((num, i) => (
          <span
            key={i}
            className="mx-8 text-3xl font-black text-zinc-800 hover:text-emerald-400 transition-colors cursor-default select-none"
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}
