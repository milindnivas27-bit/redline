export function BackgroundLayers() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0"
      style={{ isolation: 'isolate' }}
    >
      {/* Dot grid — the signature texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.075) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 30%, black 25%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 30%, black 25%, transparent 90%)',
        }}
      />

      {/* Red accent glow — top right */}
      <div
        className="absolute -top-40 -right-40 w-[720px] h-[720px]"
        style={{
          background:
            'radial-gradient(circle, rgba(229,72,77,0.14) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Cool blue glow — bottom left, subtle counter-weight */}
      <div
        className="absolute -bottom-52 -left-40 w-[600px] h-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(90,120,255,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Grain — SVG data URI, no external file needed */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  );
}