/**
 * Global SVG <defs> mounted once at the app root. Provides filters that any
 * other SVG or HTML element can reference by id:
 *
 *   - #bw-paper-edge      → medium displacement, used on cards / illustrations
 *   - #bw-paper-edge-sm   → tiny displacement, used on small surfaces
 *   - #bw-deboss          → soft inner shadow that suggests "pressed into paper"
 *
 * Filters live in a single absolutely-positioned 0×0 SVG so they take no
 * layout space. ARIA hidden because they're pure decoration.
 */
export function GlobalDefs() {
  return (
    <svg
      aria-hidden
      focusable={false}
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Subtle paper-cut wobble for large surfaces */}
        <filter id="bw-paper-edge" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Tiny wobble for small surfaces where bigger displacement would distort glyphs */}
        <filter id="bw-paper-edge-sm" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* "Pressed into paper" emboss — used on bloom meter, inputs */}
        <filter id="bw-deboss" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="2" specularConstant=".5" specularExponent="20" lightingColor="#ffffff">
            <feDistantLight azimuth="225" elevation="60" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="blur" operator="in" />
        </filter>

        {/* Reusable arrows + glyphs used by ChallengeShell (paper-cut style) */}
        <symbol id="bw-arrow-back" viewBox="0 0 24 24">
          <path
            d="M14 6 L 8 12 L 14 18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </symbol>
        <symbol id="bw-arrow-skip" viewBox="0 0 24 24">
          <path
            d="M9 6 L 15 12 L 9 18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </symbol>
        <symbol id="bw-undo" viewBox="0 0 24 24">
          <path
            d="M4 12 a 8 8 0 1 1 4 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M4 6 L 4 12 L 10 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        </symbol>
      </defs>
    </svg>
  );
}

export default GlobalDefs;
