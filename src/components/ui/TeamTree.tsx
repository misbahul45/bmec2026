import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Member = {
  id: string;
  name: string;
  studentId: string;
  role: "KETUA" | "ANGGOTA";
};

type Team = {
  name: string;
  members: Member[];
};

const NodeCard: React.FC<{
  className?: string;
  topLabel: React.ReactNode;
  name: string;
  sub?: string;
  glow?: boolean;
}> = ({ className = "", topLabel, name, sub, glow }) => (
  <div
    className={`relative flex flex-col items-center gap-1 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl border backdrop-blur-sm
      bg-background/60 border-border/60 shadow-lg transition-all duration-300
      hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-xl hover:border-primary/40
      ${glow ? "ring-1 ring-primary/30" : ""}
      ${className}`}
  >
    {glow && (
      <span className="absolute -inset-px rounded-2xl bg-primary/5 pointer-events-none" />
    )}
    <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-primary/80">
      {topLabel}
    </span>
    <span className="font-semibold text-xs sm:text-sm text-foreground leading-tight text-center">
      {name}
    </span>
    {sub && (
      <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
        {sub}
      </span>
    )}
  </div>
);

const TeamTree: React.FC<{ team: Team }> = ({ team }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ketua = team.members.find((m) => m.role === "KETUA");
  const anggota = team.members.filter((m) => m.role === "ANGGOTA");

  const drawLines = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const teamEl = container.querySelector(".team-node") as HTMLElement;
    const ketuaEl = container.querySelector(".ketua-node") as HTMLElement;
    const anggotaEls = container.querySelectorAll(".anggota-node");

    const mid = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - rect.left,
        top: r.top - rect.top,
        bottom: r.bottom - rect.top,
        cx: r.left + r.width / 2 - rect.left,
      };
    };

    const drawCurve = (
      x1: number, y1: number,
      x2: number, y2: number,
      color: string
    ) => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, color + "cc");
      grad.addColorStop(1, color + "44");
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1, (y1 + y2) / 2, x2, (y1 + y2) / 2, x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (teamEl && ketuaEl) {
      const t = mid(teamEl);
      const k = mid(ketuaEl);
      drawCurve(t.x, t.bottom, k.x, k.top, "#6366f1");
    }

    if (ketuaEl && anggotaEls.length > 0) {
      const k = mid(ketuaEl);
      anggotaEls.forEach((el) => {
        const a = mid(el as HTMLElement);
        drawCurve(k.x, k.bottom, a.x, a.top, "#818cf8");
      });
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".team-node", {
        opacity: 0,
        y: -30,
        scale: 0.85,
        duration: 0.55,
      })
        .from(
          ".ketua-node",
          { opacity: 0, y: -20, scale: 0.85, duration: 0.5 },
          "-=0.2"
        )
        .from(
          ".anggota-node",
          {
            opacity: 0,
            y: 30,
            scale: 0.85,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.15"
        );
    }, containerRef);

    const redraw = () => requestAnimationFrame(() => requestAnimationFrame(drawLines));

    const ro = new ResizeObserver(redraw);
    ro.observe(containerRef.current!);
    window.addEventListener("resize", redraw);
    redraw();

    return () => {
      ctx.revert();
      ro.disconnect();
      window.removeEventListener("resize", redraw);
    };
  }, [team]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-10 sm:py-14 flex flex-col items-center gap-8 sm:gap-10
        bg-muted/30 border border-border/50 rounded-2xl overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="relative z-10 team-node">
        <NodeCard
          topLabel="Team"
          name={team.name}
          glow
        />
      </div>

      {ketua && (
        <div className="relative z-10 ketua-node">
          <NodeCard
            topLabel={<>👑 Ketua</>}
            name={ketua.name}
            sub={ketua.studentId}
            glow
          />
        </div>
      )}

      {anggota.length > 0 && (
        <div className="relative z-10 flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-8 w-full">
          {anggota.map((m) => (
            <div key={m.id} className="anggota-node w-[calc(50%-6px)] sm:w-64 md:w-72">
              <NodeCard
                topLabel="Anggota"
                name={m.name}
                sub={m.studentId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamTree;