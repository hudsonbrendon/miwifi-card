import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    font-size: 14px;
    color: var(--secondary-text-color, #666);
  }
  .header-left {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .header-item {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    opacity: 0.75;
  }
  .header-item.led-on {
    color: #ff7043;
  }
  .menu {
    color: var(--secondary-text-color, #999);
    cursor: pointer;
    padding: 0 6px;
  }
  .hero {
    padding: 18px 12px 8px;
    display: flex;
    justify-content: center;
  }
  .hero svg, .hero img {
    width: 100%;
    max-width: 460px;
    height: auto;
  }
  .hero.offline { opacity: 0.55; filter: grayscale(0.4); }
  .hero.unavailable { opacity: 0.4; }

  /* animated SVG parts are idle by default */
  .mw-wave { opacity: 0; }
  .mw-dot { opacity: 0; }

  /* --- run only when online --- */
  .hero.online .mw-wave { animation: mw-wave 2.4s ease-out infinite; }
  .hero.online .mw-wave-2 { animation-delay: 0.35s; }
  .hero.online .mw-wave-3 { animation-delay: 0.7s; }
  .hero.online .mw-led { animation: mw-led 1.6s ease-in-out infinite; }
  .hero.online .mw-dot-down { animation: mw-data-down 1.5s linear infinite; }
  .hero.online .mw-dot-down-2 { animation-delay: 0.75s; }
  .hero.online .mw-dot-up { animation: mw-data-up 1.5s linear infinite; }
  .hero.online .mw-dot-up-2 { animation-delay: 0.75s; }

  /* faster data flow when there is measurable traffic */
  .hero.online.busy .mw-dot-down,
  .hero.online.busy .mw-dot-up { animation-duration: 0.7s; }

  .name {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin: 4px 0 2px;
    color: var(--primary-text-color, #2c2c2c);
  }
  .state {
    text-align: center;
    font-size: 14px;
    margin-bottom: 14px;
    color: var(--secondary-text-color, #666);
  }
  .state.online { color: #2e9e5b; font-weight: 500; }
  .state.error { color: #d32f2f; font-weight: 500; }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--divider-color, #eee);
  }
  .stat {
    padding: 12px 6px;
    text-align: center;
    border-right: 1px solid var(--divider-color, #eee);
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: 0; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color, #2c2c2c);
  }
  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color, #888);
    margin-top: 2px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--divider-color, #eee);
  }
  .tool-group { display: flex; gap: 14px; }
  .tool {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #666);
    cursor: pointer;
    border-radius: 6px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease;
  }
  .tool.active-radio { color: #2e9e5b; }
  .tool:hover { background: var(--secondary-background-color, #f0f0f0); color: var(--primary-text-color, #222); }
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
    0% { opacity: 0; transform: translateY(-14px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes mw-data-up {
    0% { opacity: 0; transform: translateY(14px); }
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
