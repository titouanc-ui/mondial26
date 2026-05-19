"use client";

import { useEffect, useState } from "react";

const KICKOFF = new Date("2026-06-11T20:00:00-04:00").getTime();

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeParts(): Parts {
  const diff = KICKOFF - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(computeParts());
    const id = setInterval(() => setParts(computeParts()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-20 sm:h-24 rounded-xl"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (parts.done) {
    return (
      <div className="rounded-xl border border-accent-red/40 bg-accent-red/10 px-4 py-6 text-center">
        <p className="text-sm uppercase tracking-wider text-text-muted">
          C'est parti !
        </p>
        <p className="mt-1 text-2xl font-bold text-accent-red">
          Le Mondial 2026 est en cours
        </p>
      </div>
    );
  }

  const cells: { value: number; label: string }[] = [
    { value: parts.days, label: "Jours" },
    { value: parts.hours, label: "Heures" },
    { value: parts.minutes, label: "Minutes" },
    { value: parts.seconds, label: "Secondes" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-border bg-bg-card/80 backdrop-blur-sm px-2 py-3 sm:py-4 text-center"
        >
          <div className="font-mono tabular text-2xl sm:text-4xl font-bold text-text">
            {c.value.toString().padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-text-dim">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
