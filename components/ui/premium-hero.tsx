"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { CheckCircleIcon, LockIcon, GlobeIcon, SwissFlagIcon } from "@ciphera-net/ui";
import { track } from "@/lib/pulse";
import { AnimatedCarousel } from "@/components/ui/logo-carousel";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.08 + layer * 0.05;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  };
}

const trustIndicators = [
  { icon: LockIcon, text: "End-to-end encrypted", iconClassName: "w-5 h-5 text-brand-orange" },
  { icon: CheckCircleIcon, text: "Open source", iconClassName: "w-5 h-5 text-brand-orange" },
  { icon: GlobeIcon, text: "Zero-knowledge by design", iconClassName: "w-5 h-5 text-brand-orange" },
  { icon: SwissFlagIcon, text: "Swiss infrastructure", iconClassName: "w-5 h-5" },
];

const privacyTitles = ["encrypted", "private", "secure", "anonymous", "yours"];

const techLogos = [
  "https://cdn.simpleicons.org/nextdotjs/white",
  "https://cdn.simpleicons.org/go/white",
  "https://cdn.simpleicons.org/postgresql/white",
  "https://cdn.simpleicons.org/minio/white",
  "https://cdn.simpleicons.org/redis/white",
  "https://cdn.simpleicons.org/bunnydotnet/white",
  "https://cdn.simpleicons.org/exoscale/white",
  "https://cdn.simpleicons.org/docker/white",
  "https://cdn.simpleicons.org/github/white",
  "https://cdn.simpleicons.org/letsencrypt/white",
];

export const PremiumHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [titleNumber, setTitleNumber] = useState(0);

  const LAYERS = 3;
  const BEAMS_PER_LAYER = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseRef.current;
    const container = containerRef.current;
    if (!canvas || !noiseCanvas || !container) return;
    const ctx = canvas.getContext("2d");
    const nCtx = noiseCanvas.getContext("2d");
    if (!ctx || !nCtx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      noiseCanvas.width = w * dpr;
      noiseCanvas.height = h * dpr;
      noiseCanvas.style.width = `${w}px`;
      noiseCanvas.style.height = `${h}px`;
      nCtx.setTransform(1, 0, 0, 1, 0, 0);
      nCtx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(w, h, layer));
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i + 1] = v;
        imgData.data[i + 2] = v;
        imgData.data[i + 3] = 12;
      }
      nCtx.putImageData(imgData, 0, 0);
    };

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = Math.min(1, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4));
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `rgba(253,94,15,0)`);
      gradient.addColorStop(0.2, `rgba(253,94,15,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(253,94,15,${pulsingOpacity})`);
      gradient.addColorStop(0.8, `rgba(253,94,15,${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `rgba(253,94,15,0)`);

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = container.clientHeight + 50;
          beam.x = Math.random() * container.clientWidth;
        }
        drawBeam(beam);
      });

      generateNoise();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % privacyTitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[130vh] overflow-hidden -mt-[88px] pt-[88px]">
      <canvas ref={noiseRef} className="absolute inset-0 z-0 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(0 0% 4%) 0%, hsl(0 0% 4%) 15%, transparent 100%)' }} />

      <div className="relative z-20 flex h-screen w-full items-center justify-center px-6 text-center -mt-16">
        <div className="container mx-auto flex flex-col items-center gap-12 text-center">
          <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter font-regular">
            <span className="text-white">Your data is</span>
            <span className="relative flex w-full justify-center md:pb-4 md:pt-1">
              &nbsp;
              {privacyTitles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold text-brand-orange"
                  initial={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: -50, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-neutral-400 max-w-2xl text-center">
            Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles.
            Your data is encrypted before it leaves your device — we can&apos;t see it, even if we wanted to.
          </p>

          <div className="flex flex-row gap-3 flex-wrap justify-center">
            <Button size="lg" className="gap-4 bg-brand-orange hover:bg-brand-orange-hover text-white" asChild>
              <Link href="/products" onClick={() => track("cta_explore_products")}>
                Explore Products <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-4 border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500" asChild>
              <Link href="/about" onClick={() => track("cta_our_mission")}>
                Our Mission
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="hidden sm:block w-px h-4 bg-neutral-700 mr-2" />
                )}
                <item.icon className={item.iconClassName ?? "w-5 h-5 text-brand-orange"} />
                <span className="text-sm font-medium text-neutral-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-0 right-0 z-30">
        <AnimatedCarousel
          title="Powered by modern infrastructure"
          logos={techLogos}
          autoPlay={true}
          autoPlayInterval={3000}
          itemsPerViewMobile={3}
          itemsPerViewDesktop={5}
          logoContainerWidth="w-40"
          logoContainerHeight="h-20"
          logoImageWidth="w-auto"
          logoImageHeight="h-10"
          padding="py-0"
          containerClassName="bg-transparent"
          titleClassName="text-white text-lg md:text-2xl"
        />
      </div>
    </div>
  );
};
