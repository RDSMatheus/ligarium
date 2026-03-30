import { useEffect, useState } from "react";

function CountDown({
  bothReady,
  onStart,
}: {
  bothReady: boolean;
  onStart: () => void;
}) {
  const [count, setCount] = useState(5);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!bothReady) {
      setCount(5);
      setStarted(false);
      return;
    }
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          setStarted(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [bothReady]);

  useEffect(() => {
    if (count === 0) onStart();
  }, [count]);

  if (!bothReady) return null;

  return (
    <div
      className="flex flex-col items-center gap-2.5 w-full mt-[18px] px-5 py-3.5 rounded-lg border-[1.5px] border-[rgba(95,212,74,0.4)] bg-[rgba(10,24,10,0.85)] animate-[fadeInUp_0.4s_ease]"
      style={{
        boxShadow:
          "0 0 30px rgba(95,212,74,0.12), inset 0 1px 0 rgba(95,212,74,0.1)",
      }}
    >
      {started ? (
        <p
          className="font-display text-base tracking-[0.1em] text-[#5FD44A] animate-[iconPulse_0.5s_ease-in-out_infinite_alternate]"
          style={{ textShadow: "0 0 20px rgba(95,212,74,0.9)" }}
        >
          Que a batalha comece!
        </p>
      ) : (
        <>
          {/* Label */}
          <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-[#5FD44A] opacity-80">
            Batalha começa em
          </p>

          {/* Número */}
          <p
            key={count}
            className="font-display font-bold text-[52px] leading-none text-[#5FD44A] animate-[countPop_1s_ease-in-out]"
            style={{
              textShadow:
                "0 0 30px rgba(95,212,74,0.9), 0 0 60px rgba(95,212,74,0.5)",
            }}
          >
            {count}
          </p>

          {/* Barra de progresso */}
          <div className="w-full h-1 rounded-full bg-[rgba(95,212,74,0.12)] overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-[900ms] linear"
              style={{
                width: `${(count / 5) * 100}%`,
                background:
                  "linear-gradient(to right, rgba(95,212,74,0.6), #5FD44A)",
                boxShadow: "0 0 6px rgba(95,212,74,0.5)",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CountDown;
