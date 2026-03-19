// * Reusable gradient orb background used across hero sections
// * Matches the homepage Hero visual style (gradient orbs + grid pattern)
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* * Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] bg-brand-orange/10 rounded-full blur-[128px] opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-neutral-400/10 rounded-full blur-[128px] opacity-40" />

      {/* * Grid pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
        style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)' }}
      />
    </div>
  )
}