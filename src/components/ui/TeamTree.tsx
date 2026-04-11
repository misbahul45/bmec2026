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

const TeamTree: React.FC<{ team: Team }> = ({ team }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ketua = team.members.find((m) => m.role === "KETUA");
  const anggota = team.members.filter((m) => m.role === "ANGGOTA");

  /**
   * DRAW CONNECTION LINES
   */
  const drawLines = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ketuaEl = container.querySelector(
      ".ketua-node"
    ) as HTMLElement;

    const anggotaEls = container.querySelectorAll(
      ".anggota-node"
    );

    if (!ketuaEl) return;

    const kRect = ketuaEl.getBoundingClientRect();

    const startX = kRect.left + kRect.width / 2 - rect.left;
    const startY = kRect.bottom - rect.top;

    anggotaEls.forEach((el) => {
      const aRect = el.getBoundingClientRect();

      const endX = aRect.left + aRect.width / 2 - rect.left;
      const endY = aRect.top - rect.top;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);

      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  };

  /**
   * GSAP ANIMATION
   */
  useEffect(() => {
    gsap.from(".team-node", {
      opacity: 0,
      y: -40,
      scale: 0.8,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.from(".anggota-node", {
      opacity: 0,
      y: 60,
      scale: 0.8,
      stagger: 0.15,
      delay: 0.4,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    setTimeout(drawLines, 700);
    window.addEventListener("resize", drawLines);

    return () => window.removeEventListener("resize", drawLines);
  }, [team]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-12 flex flex-col items-center bg-accent rounded-2xl overflow-hidden"
    >
      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* TEAM ROOT */}
      <div className="team-node bg-white rounded-xl shadow-lg px-6 py-4 text-center mb-10">
        <div className="text-sm text-gray-500">TEAM</div>
        <div className="font-bold text-lg">{team.name}</div>
      </div>

      {/* KETUA */}
      {ketua && (
        <div className="ketua-node team-node bg-white rounded-xl shadow-lg px-6 py-4 text-center mb-14">
          <div className="text-xs text-primary font-semibold">
            👑 KETUA
          </div>
          <div className="font-semibold">{ketua.name}</div>
          <div className="text-xs text-gray-500">
            {ketua.studentId}
          </div>
        </div>
      )}

      {/* ANGGOTA */}
      <div className="flex gap-8 flex-wrap justify-center">
        {anggota.map((m) => (
          <div
            key={m.id}
            className="anggota-node bg-white rounded-xl shadow-lg px-5 py-4 text-center w-40"
          >
            <div className="text-xs text-gray-400">
              ANGGOTA
            </div>
            <div className="font-medium">{m.name}</div>
            <div className="text-xs text-gray-500">
              {m.studentId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTree;