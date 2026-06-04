import { css } from "lit";

export const cardStyles = css`
  :host {
    --mw-fg: var(--primary-text-color, #2c2c2c);
    --mw-muted: var(--secondary-text-color, #8a8a8e);
    --mw-divider: var(--divider-color, rgba(0, 0, 0, 0.08));
    --mw-hover: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    --mw-online: #2e9e5b;
    --mw-error: #d32f2f;
    display: block;
  }
  ha-card {
    overflow: hidden;
    padding: 14px 14px 4px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--mw-fg);
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }

  /* ── Header: status badges + kebab ───────────────────────────────── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 6px;
    font-size: 0.95rem;
    color: var(--mw-muted);
  }
  .header-left {
    display: flex;
    gap: 18px;
    align-items: center;
  }
  .header-item {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-variant-numeric: tabular-nums;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mw-muted);
  }
  .header-item.led.led-on {
    color: var(--mw-online);
  }
  .header-item.led.led-on ha-icon {
    color: var(--mw-online);
  }
  .menu {
    color: var(--mw-muted);
    cursor: default;
    padding: 0 4px;
    font-size: 1.1rem;
  }

  /* ── Hero: line-art router illustration ──────────────────────────── */
  .hero {
    display: flex;
    justify-content: center;
    margin: 4px 0 2px;
  }
  .hero svg {
    width: 100%;
    max-width: 248px;
    height: auto;
    display: block;
  }
  .hero.offline { opacity: 0.6; filter: grayscale(0.5); }
  .hero.unavailable { opacity: 0.4; }

  /* animated SVG parts are idle by default (clean static drawing) */
  .mw-wave { opacity: 0; }
  .mw-dot { opacity: 0; }

  /* run only when online */
  .hero.online .mw-wave { animation: mw-wave 2.4s ease-out infinite; }
  .hero.online .mw-wave-2 { animation-delay: 0.35s; }
  .hero.online .mw-wave-3 { animation-delay: 0.7s; }
  .hero.online .mw-led { animation: mw-led 1.8s ease-in-out infinite; }
  .hero.online .mw-dot-down { animation: mw-data-down 1.6s linear infinite; }
  .hero.online .mw-dot-down-2 { animation-delay: 0.8s; }
  .hero.online .mw-dot-up { animation: mw-data-up 1.6s linear infinite; }
  .hero.online .mw-dot-up-2 { animation-delay: 0.8s; }
  .hero.online.busy .mw-dot-down,
  .hero.online.busy .mw-dot-up { animation-duration: 0.8s; }

  /* ── Name + status line ──────────────────────────────────────────── */
  .name {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 6px 0 2px;
    color: var(--mw-fg);
  }
  .state {
    text-align: center;
    font-size: 0.95rem;
    margin: 0 0 14px;
    min-height: 1.2em;
    color: var(--mw-muted);
  }
  .state.online { color: var(--mw-online); font-weight: 500; }
  .state.error { color: var(--mw-error); font-weight: 500; }

  /* ── Stats grid ──────────────────────────────────────────────────── */
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--mw-divider);
    border-bottom: 1px solid var(--mw-divider);
    padding: 14px 0;
  }
  .stat {
    text-align: center;
    border-right: 1px solid var(--mw-divider);
    padding: 0 4px;
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: none; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--mw-fg);
  }
  .stat-label {
    font-size: 0.78rem;
    color: var(--mw-muted);
    margin-top: 2px;
  }

  /* ── Toolbar ─────────────────────────────────────────────────────── */
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 2px 4px;
  }
  .tool-group { display: flex; gap: 16px; }
  .tool {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mw-muted);
    cursor: pointer;
    border-radius: 8px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease, background 120ms ease, color 120ms ease;
  }
  .tool ha-icon { --mdc-icon-size: 20px; }
  .tool.active-radio { color: var(--mw-online); }
  .tool:hover { background: var(--mw-hover); color: var(--mw-fg); }
  .tool:active { transform: scale(0.92); }
  .tool:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
  .compact .stats, .compact .toolbar { display: none; }

  @keyframes mw-wave {
    0% { opacity: 0; }
    25% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes mw-led {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  @keyframes mw-data-down {
    0% { opacity: 0; transform: translateY(-12px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes mw-data-up {
    0% { opacity: 0; transform: translateY(12px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero.online .mw-wave,
    .hero.online .mw-led,
    .hero.online .mw-dot { animation: none; }
    .hero.online .mw-wave { opacity: 0.6; }
    .hero.online .mw-led { opacity: 1; }
    .stat, .tool { transition: none; }
  }
`;
