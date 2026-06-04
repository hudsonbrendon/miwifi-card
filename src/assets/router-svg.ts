import { svg } from "lit";

// Flat line-art illustration of a Xiaomi-style tower router, modelled after the
// miyoo-mini-card aesthetic: white fill, #aaa / #ececec strokes, no gradients —
// a clean "drawn" look that reads on both light and dark Home Assistant themes.
//
// Animation hooks (class names must match styles.ts):
//   .mw-wave (3) — Wi-Fi waves above the antenna fan
//   .mw-led       — front status indicator (blinks)
//   .mw-dot-down (2) / .mw-dot-up (2) — data-flow particles
// Animated parts use soft accent tones; everything else stays line-art.
export const svgRouter = svg`
<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MiWiFi router">
  <!-- six blade antennas in a fan (outline, symmetric about x=140) -->
  <g fill="#ffffff" stroke="#aaaaaa" stroke-width="1.6">
    <rect x="83" y="32" width="10" height="92" rx="5" transform="rotate(-26 88 122)"/>
    <rect x="101" y="32" width="10" height="92" rx="5" transform="rotate(-16 106 122)"/>
    <rect x="119" y="32" width="10" height="92" rx="5" transform="rotate(-8 124 122)"/>
    <rect x="151" y="32" width="10" height="92" rx="5" transform="rotate(8 156 122)"/>
    <rect x="169" y="32" width="10" height="92" rx="5" transform="rotate(16 174 122)"/>
    <rect x="187" y="32" width="10" height="92" rx="5" transform="rotate(26 192 122)"/>
  </g>

  <!-- body shell + subtle inner bezel -->
  <rect x="44" y="120" width="192" height="72" rx="14" ry="14"
        fill="#ffffff" stroke="#aaaaaa" stroke-width="2"/>
  <rect x="50" y="126" width="180" height="60" rx="10" ry="10"
        fill="none" stroke="#ececec" stroke-width="1"/>

  <!-- status indicator (blinks when online) + port lights -->
  <circle class="mw-led" cx="140" cy="136" r="3.6" fill="#6cc070"/>
  <circle cx="156" cy="136" r="2.4" fill="none" stroke="#bbbbbb" stroke-width="1.3"/>
  <circle cx="168" cy="136" r="2.4" fill="none" stroke="#bbbbbb" stroke-width="1.3"/>

  <!-- wordmark -->
  <text x="140" y="155" text-anchor="middle" font-family="sans-serif"
        font-size="11" letter-spacing="2.5" fill="#c2c2c6">MiWiFi</text>

  <!-- ventilation slots -->
  <g stroke="#d2d2d4" stroke-width="2" stroke-linecap="round">
    <line x1="78" y1="166" x2="202" y2="166"/>
    <line x1="78" y1="172" x2="202" y2="172"/>
    <line x1="78" y1="178" x2="202" y2="178"/>
  </g>

  <!-- feet + faint ground shadow -->
  <rect x="62" y="192" width="26" height="5" rx="2.5" fill="none" stroke="#bbbbbb" stroke-width="1.4"/>
  <rect x="192" y="192" width="26" height="5" rx="2.5" fill="none" stroke="#bbbbbb" stroke-width="1.4"/>
  <ellipse cx="140" cy="206" rx="104" ry="6" fill="rgba(0,0,0,0.05)"/>

  <!-- Wi-Fi waves above the antenna fan (emanate upward, centered) -->
  <g fill="none" stroke="#7ab7e0" stroke-width="2.6" stroke-linecap="round">
    <path class="mw-wave mw-wave-1" d="M122 26 a18 18 0 0 1 36 0"/>
    <path class="mw-wave mw-wave-2" d="M110 33 a30 30 0 0 1 60 0"/>
    <path class="mw-wave mw-wave-3" d="M98 40 a42 42 0 0 1 84 0"/>
  </g>

  <!-- data-flow dots (down = inbound, up = outbound) -->
  <g>
    <circle class="mw-dot mw-dot-down mw-dot-down-1" cx="92" cy="150" r="3" fill="#7ab7e0"/>
    <circle class="mw-dot mw-dot-down mw-dot-down-2" cx="106" cy="150" r="3" fill="#7ab7e0"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-1" cx="174" cy="150" r="3" fill="#6cc070"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-2" cx="188" cy="150" r="3" fill="#6cc070"/>
  </g>
</svg>`;
