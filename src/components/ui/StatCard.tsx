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

  const handleEnter = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.timeline()
      .to(cardRef.current, {
        scale: 1.08,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(cardRef.current, {
        scale: 1,
        duration: 0.35,
        ease: "elastic.out(1,0.5)",
      });

    gsap.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 0.7,
        scale: 1.4,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  };

  const handleLeave = () => {
    if (!glowRef.current) return;

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
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative px-5 py-4 rounded-2xl border-2 border-primary/30 bg-background/40 backdrop-blur-xl text-center transition-all overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0"
      />

      <div className="relative text-2xl lg:text-3xl font-bold text-primary">
        {number}
      </div>

      <div className="relative text-xs text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
};

export default StatCard;