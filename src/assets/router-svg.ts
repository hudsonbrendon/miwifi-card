import { svg } from "lit";

// Static markup; animation is driven entirely by CSS in styles.ts via the
// `.hero.online` ancestor. Classes: .mw-wave (3), .mw-led, .mw-dot-up (2),
// .mw-dot-down (2).
export const svgRouter = svg`
<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="mwBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3f47"/>
      <stop offset="100%" stop-color="#23272e"/>
    </linearGradient>
    <linearGradient id="mwWave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff8a3d"/>
      <stop offset="100%" stop-color="#ff5722"/>
    </linearGradient>
  </defs>

  <!-- antennas -->
  <rect x="150" y="40" width="10" height="80" rx="5" fill="#2b2f36" transform="rotate(-18 155 80)"/>
  <rect x="440" y="40" width="10" height="80" rx="5" fill="#2b2f36" transform="rotate(18 445 80)"/>

  <!-- Wi-Fi waves (emanate from the top center) -->
  <g fill="none" stroke="url(#mwWave)" stroke-width="6" stroke-linecap="round">
    <path class="mw-wave mw-wave-1" d="M255 96 a48 48 0 0 1 90 0"/>
    <path class="mw-wave mw-wave-2" d="M232 104 a74 74 0 0 1 136 0"/>
    <path class="mw-wave mw-wave-3" d="M210 112 a100 100 0 0 1 180 0"/>
  </g>

  <!-- router body -->
  <rect x="180" y="120" width="240" height="84" rx="14" fill="url(#mwBody)"/>
  <rect x="180" y="120" width="240" height="84" rx="14" fill="none" stroke="#11141a" stroke-width="2"/>

  <!-- status LED -->
  <circle class="mw-led" cx="300" cy="162" r="9" fill="#ff5722"/>

  <!-- port lights -->
  <rect x="356" y="156" width="14" height="12" rx="2" fill="#454b54"/>
  <rect x="376" y="156" width="14" height="12" rx="2" fill="#454b54"/>

  <!-- data-flow dots (down = into router, up = out) -->
  <g>
    <circle class="mw-dot mw-dot-down mw-dot-down-1" cx="232" cy="150" r="4" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-down mw-dot-down-2" cx="252" cy="150" r="4" fill="#4fc3f7"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-1" cx="348" cy="174" r="4" fill="#81c784"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-2" cx="368" cy="174" r="4" fill="#81c784"/>
  </g>
</svg>`;
