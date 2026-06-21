"use client";

export function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
        // Deterministic stagger — keeps SSR/strict-mode renders stable and
        // the drift pattern repeatable.
        duration: 20 + (i % 10),
    }));

    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg
                className="w-full h-full text-foreground"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        strokeDasharray="300 700"
                        className="floating-path"
                        style={{
                            animationDuration: `${path.duration}s`,
                            // Negative delay spreads paths across their cycle
                            // from the first frame — no cold-start gap.
                            animationDelay: `-${(path.id * 0.8) % path.duration}s`,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
