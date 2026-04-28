import React, { useRef } from "react";
import gsap from "gsap";

const StatCard = ({
  number,
  label,
  icon: Icon,
}: {
  number: string;
  label: string;
  icon?: React.ElementType;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(cardRef.current, {
      rotateX: ((y / rect.height) - 0.5) * -10,
      rotateY: ((x / rect.width) - 0.5) * 10,
      transformPerspective: 800,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.04,
      duration: 0.3,
      ease: "power3.out",
    });
    gsap.fromTo(glowRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.5, duration: 0.5, ease: "power3.out" });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    gsap.to(glowRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden cursor-default"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <div ref={glowRef} className="absolute inset-0 bg-primary/15 blur-2xl opacity-0 pointer-events-none" />
      <div className="h-0.5 w-full bg-linear-to-r from-primary/60 via-primary to-primary/60" />

      <div className="relative p-4 flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-primary" />
          </div>
        )}
        <div>
          <p className="text-xl font-bold text-primary leading-none">{number}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
