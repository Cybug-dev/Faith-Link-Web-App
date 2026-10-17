/**
 * Mountains at dusk with an amber rim and a star, drawn to match the sidebar
 * art on the owner's Stitch board. Inline SVG (under 1 kB) so it blends into
 * the sidebar and follows the theme tokens; swap for the owner's image if preferred.
 */
export function SidebarArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 224 120" fill="none" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sidebar-art-rim" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" className="art-rim-stop" stopOpacity="0" />
          <stop offset="0.55" className="art-rim-stop" stopOpacity="0.9" />
          <stop offset="1" className="art-rim-stop" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sidebar-art-glow">
          <stop offset="0" className="art-rim-stop" stopOpacity="0.35" />
          <stop offset="1" className="art-rim-stop" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="44" cy="30" r="18" fill="url(#sidebar-art-glow)" />
      <path className="art-star" d="M44 20l2.6 7.4L54 30l-7.4 2.6L44 40l-2.6-7.4L34 30l7.4-2.6z" />
      <path className="art-ridge-far" d="M0 120V80l30-16 22 8 32-26 28 16 30-24 34 22 26-8 22 10v58z" />
      <path d="M0 80l30-16 22 8 32-26 28 16 30-24 34 22 26-8 22 10" stroke="url(#sidebar-art-rim)" strokeWidth="1.5" />
      <path className="art-ridge-near" d="M0 120V96l36-14 34 10 40-22 40 20 36-12 38 10v32z" />
      <path
        d="M0 96l36-14 34 10 40-22 40 20 36-12 38 10"
        stroke="url(#sidebar-art-rim)"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
    </svg>
  )
}
