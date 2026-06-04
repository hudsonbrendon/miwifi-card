import { svg } from "lit";

// Xiaomi-style tower router (AX6000/AX3600 look): low wide body with a fan of
// six blade antennas. Static product render; the animation is driven entirely
// by CSS in styles.ts via the `.hero.online` ancestor.
// Animation hooks (class names must match styles.ts):
//   .mw-wave (3) — Wi-Fi waves above the antenna fan
//   .mw-led       — front status indicator (blinks)
//   .mw-dot-down (2) / .mw-dot-up (2) — data-flow particles
// Background is intentionally transparent (not the spec's opaque white) so the
// card blends with both light and dark Home Assistant themes.
export const svgRouter = svg`
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="mwBodyTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A3A3D"/>
      <stop offset="100%" stop-color="#1F1F22"/>
    </linearGradient>
    <linearGradient id="mwBodyFront" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#232326"/>
      <stop offset="100%" stop-color="#141416"/>
    </linearGradient>
    <linearGradient id="mwAntenna" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#202022"/>
      <stop offset="50%" stop-color="#2c2c2f"/>
      <stop offset="100%" stop-color="#161618"/>
    </linearGradient>
    <linearGradient id="mwWave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff8a3d"/>
      <stop offset="100%" stop-color="#ff5722"/>
    </linearGradient>
    <filter id="mwBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>

  <!-- ground shadow -->
  <ellipse cx="200" cy="252" rx="150" ry="12" fill="rgba(0,0,0,0.12)" filter="url(#mwBlur)"/>

  <!-- feet -->
  <rect x="98" y="244" width="32" height="6" rx="3" fill="#141416"/>
  <rect x="270" y="244" width="32" height="6" rx="3" fill="#141416"/>

  <!-- six blade antennas in a fan (symmetric about x=200) -->
  <g fill="url(#mwAntenna)">
    <rect x="145.5" y="62" width="9" height="118" rx="4.5" transform="rotate(-26 150 178)"/>
    <rect x="163.5" y="62" width="9" height="118" rx="4.5" transform="rotate(-16 168 178)"/>
    <rect x="181.5" y="62" width="9" height="118" rx="4.5" transform="rotate(-8 186 178)"/>
    <rect x="209.5" y="62" width="9" height="118" rx="4.5" transform="rotate(8 214 178)"/>
    <rect x="227.5" y="62" width="9" height="118" rx="4.5" transform="rotate(16 232 178)"/>
    <rect x="245.5" y="62" width="9" height="118" rx="4.5" transform="rotate(26 250 178)"/>
  </g>
  <!-- antenna base hinges -->
  <g fill="#0E0E10">
    <rect x="144" y="172" width="12" height="10" rx="2"/>
    <rect x="162" y="172" width="12" height="10" rx="2"/>
    <rect x="180" y="172" width="12" height="10" rx="2"/>
    <rect x="208" y="172" width="12" height="10" rx="2"/>
    <rect x="226" y="172" width="12" height="10" rx="2"/>
    <rect x="244" y="172" width="12" height="10" rx="2"/>
  </g>

  <!-- body: top face (perspective) + front face -->
  <path d="M96 172 L304 172 L316 182 L84 182 Z" fill="url(#mwBodyTop)"/>
  <rect x="80" y="181" width="240" height="65" rx="6" fill="url(#mwBodyFront)" stroke="#0E0E10" stroke-width="1.5"/>

  <!-- front status indicator / logo (blinks when online) -->
  <rect class="mw-led" x="191" y="193" width="18" height="3.6" rx="1.8" fill="#9A9A9E"/>

  <!-- ventilation slots -->
  <g stroke="#0E0E10" stroke-width="2.4" stroke-linecap="round">
    <line x1="96" y1="214" x2="304" y2="214"/>
    <line x1="96" y1="219" x2="304" y2="219"/>
    <line x1="96" y1="224" x2="304" y2="224"/>
    <line x1="96" y1="229" x2="304" y2="229"/>
    <line x1="96" y1="234" x2="304" y2="234"/>
    <line x1="96" y1="239" x2="304" y2="239"/>
  </g>

  <!-- discreet corner logo -->
  <rect x="296" y="236" width="11" height="4" rx="2" fill="#55565A"/>

  <!-- Wi-Fi waves above the antenna fan (emanate upward, centered) -->
  <g fill="none" stroke="url(#mwWave)" stroke-width="5" stroke-linecap="round">
    <path class="mw-wave mw-wave-1" d="M176 58 a24 24 0 0 1 48 0"/>
    <path class="mw-wave mw-wave-2" d="M159 66 a41 41 0 0 1 82 0"/>
    <path class="mw-wave mw-wave-3" d="M142 74 a58 58 0 0 1 116 0"/>
  </g>

  <!-- data-flow dots (down = inbound, up = outbound) -->
  <g>
    <circle class="mw-dot mw-dot-down mw-dot-down-1" cx="150" cy="200" r="3.5" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-down mw-dot-down-2" cx="170" cy="200" r="3.5" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-1" cx="230" cy="224" r="3.5" fill="#81c784"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-2" cx="250" cy="224" r="3.5" fill="#81c784"/>
  </g>
</svg>`;
