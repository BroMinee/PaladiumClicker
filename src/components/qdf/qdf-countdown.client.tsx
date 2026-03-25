"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function parseCountdown(seconds: number) {
  return {
    d: Math.floor(seconds / 86400),
    h: Math.floor((seconds % 86400) / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: seconds % 60,
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative bg-card border border-gray-800 rounded-lg px-4 py-3 min-w-[64px] text-center overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <span className="text-3xl font-black font-mono text-primary tabular-nums select-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-semibold text-secondary-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-2xl font-black text-primary/30 py-3 leading-9 select-none animate-pulse">
        :
      </span>
    </div>
  );
}

/**
 * CountDown with animation
 */
export function QdfCountdown({ endTimestamp }: { endTimestamp: number }) {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, endTimestamp - Math.floor(Date.now() / 1000))
  );

  const [display, setDisplay] = useState({ d: 99, h: 99, m: 99, s: 99 });
  const introRef = useRef(false);
  const introCompleteRef = useRef(false);

  useEffect(() => {
    if (introRef.current) {
      return;
    }
    introRef.current = true;

    const actual = parseCountdown(remaining);
    const targetAfter3s = parseCountdown(Math.max(0, remaining - Math.round(3.2)));
    // Yes the time starts at 99 obviously :)
    const pD = { v: 99 };
    const pH = { v: 99 };
    const pM = { v: 99 };
    const pS = { v: 99 };

    if (actual.d > 0) {
      gsap.to(pD, {
        v: actual.d, duration: 0.7, ease: "power3.out",
        onUpdate: () => setDisplay(prev => ({ ...prev, d: Math.round(pD.v) })),
      });
    } else {
      setDisplay(prev => ({ ...prev, d: 0 }));
    }

    gsap.to(pH, {
      v: actual.h, duration: 1.5, ease: "power3.out",
      onUpdate: () => setDisplay(prev => ({ ...prev, h: Math.round(pH.v) })),
    });

    gsap.to(pM, {
      v: actual.m, duration: 2.3, ease: "power3.out",
      onUpdate: () => setDisplay(prev => ({ ...prev, m: Math.round(pM.v) })),
    });

    gsap.to(pS, {
      v: targetAfter3s.s, duration: 3.2, ease: "power3.out",
      onUpdate: () => setDisplay(prev => ({ ...prev, s: Math.round(pS.v) })),
      onComplete: () => {
        introCompleteRef.current = true;
        setDisplay(parseCountdown(Math.max(0, remaining - Math.round(3.2))));
      },
    });
  }, [remaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = Math.max(0, endTimestamp - Math.floor(Date.now() / 1000));
      setRemaining(next);
      if (introCompleteRef.current) {
        setDisplay(parseCountdown(next));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTimestamp]);

  // eslint-disable-next-line react-hooks/refs
  if (remaining === 0 && introRef.current) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <p className="text-[10px] font-semibold text-secondary-foreground uppercase tracking-widest">
          Prochaine QDF
        </p>
        <p className="text-lg font-bold text-yellow-500 animate-pulse">
          Bientôt disponible...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-semibold text-secondary-foreground uppercase tracking-widest">
        Prochaine QDF dans
      </p>
      <div className="flex items-start gap-2">
        {display.d > 0 && (
          <>
            <TimeUnit value={display.d} label="jours" />
            <Separator />
          </>
        )}
        <TimeUnit value={display.h} label="heures" />
        <Separator />
        <TimeUnit value={display.m} label="minutes" />
        <Separator />
        <TimeUnit value={display.s} label="secondes" />
      </div>
    </div>
  );
}
