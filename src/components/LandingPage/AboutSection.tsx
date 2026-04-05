import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeBackground from "../ui/ThreeBackground";
import ImageShape from "../ui/ImageShape";
import { ABOUT_IMAGES } from "~/contants";
import StatCard from "../ui/StatCard";
import WhySection from "./WhySection";

gsap.registerPlugin(ScrollTrigger);


const AboutSection: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const desc1Ref = useRef<HTMLParagraphElement>(null);
  const desc2Ref = useRef<HTMLParagraphElement>(null);
  const centerRingRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement[]>([]);


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(
        [titleRef.current, desc1Ref.current, desc2Ref.current],
        {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
        }
      );

      if (centerRingRef.current) {
        gsap.to(centerRingRef.current, {
          scale: 1.15,
          repeat: -1,
          yoyo: true,
          duration: 2.5,
          ease: "sine.inOut",
        });
      }

      gsap.from(imageRefs.current, {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
        },
      });

      gsap.from(statsRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="relative py-20 md:px-6 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative overflow-hidden">
        <div className="grid lg:grid-cols-2 relative z-10">
          <div className="relative flex items-center justify-center py-20 min-h-120">
            <div
              ref={centerRingRef}
              className="absolute w-28 h-28 rounded-full border border-primary/30"
            />

            {ABOUT_IMAGES.map((img, i) => (
              <ImageShape
                key={i}
                ref={(el: HTMLDivElement) => {
                  imageRefs.current[i] = el;
                }}
                image={img.src}
                size={img.size}
                style={img.style as React.CSSProperties}
              />
            ))}
          </div>

          <div
            ref={contentRef}
            className="px-8 w-full lg:px-14 py-16 flex flex-col justify-center"
          >
            <h2
              ref={titleRef}
              className="text-3xl lg:text-4xl font-bold leading-tight mb-4"
            >
              Tentang <span className="text-primary">BMEC</span> 2026
            </h2>

            <p
              ref={desc1Ref}
              className="text-muted-foreground leading-relaxed text-justify mb-3"
            >
              Biomedical Engineering Competition (BMEC) merupakan ajang
              kompetisi tahunan yang berfokus pada ilmu Teknik Biomedis Dasar
              dan diselenggarakan oleh Himpunan Mahasiswa Teknik Biomedis
              Universitas Airlangga.
            </p>

            <p
              ref={desc2Ref}
              className="text-muted-foreground/70 text-sm leading-relaxed text-justify mb-8"
            >
              BMEC 2025 menghadirkan berbagai fasilitas menarik untuk membantu
              peserta mengembangkan kemampuan akademik dan inovasi di bidang
              Teknik Biomedis.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { number: "500+", label: "Peserta" },
                { number: "40+", label: "Sekolah" },
                { number: "3", label: "Kompetisi" },
                { number: "2026", label: "BMEC Tahun Ini" },
              ].map((stat, i) => (
                <div
                  key={i}
                  ref={(el: HTMLDivElement) => {
                    statsRef.current[i] = el;
                  }}
                >
                  <StatCard {...stat} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;