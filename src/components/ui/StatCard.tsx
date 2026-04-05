import React, { useRef } from "react";
import gsap from "gsap";

const StatCard = ({
  number,
  label,
}: {
  number: string;
  label: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleEnter = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.to(cardRef.current, {
      scale: 1.06,
      boxShadow:
        "0 25px 60px rgba(0,0,0,0.25), 0 0 25px color-mix(in srgb, var(--primary) 40%, transparent)",
      borderColor: "color-mix(in srgb, var(--primary) 80%, white)",
      duration: 0.3,
      ease: "power3.out",
    });

    gsap.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 0.9,
        scale: 1.6,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  };

  const handleLeave = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      borderColor: "color-mix(in srgb, var(--primary) 60%, transparent)",
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative shadow-lg rounded-xl py-4 border-2 border-primary/40 bg-background/50 backdrop-blur-xl text-center overflow-hidden"
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl opacity-0"
      />

      <div
        className="relative text-2xl lg:text-3xl font-bold text-primary"
        style={{ transform: "translateZ(30px)" }}
      >
        {number}
      </div>

      <div
        className="relative text-xs text-muted-foreground mt-1"
        style={{ transform: "translateZ(20px)" }}
      >
        {label}
      </div>
    </div>
  );
};

export default StatCard;