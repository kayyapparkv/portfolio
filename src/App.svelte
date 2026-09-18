<!-- src/App.svelte -->
<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { currentPage, history, COMMANDS, type Page } from './lib/store';

  // Dynamic Page Components
  import About from './lib/pages/About.svelte';
  import Projects from './lib/pages/Projects.svelte';
  import Skills from './lib/pages/Skills.svelte';
  import Contact from './lib/pages/Contact.svelte';

  let inputVal = '';
  let inputElement: HTMLInputElement;
  let terminalBodyElement: HTMLDivElement;

  $: if ($history) {
    scrollToBottom();
  }

  async function scrollToBottom() {
    await tick();
    if (terminalBodyElement) {
      terminalBodyElement.scrollTop = terminalBodyElement.scrollHeight;
    }
  }

  function handleCommand(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;

    const trimmed = inputVal.trim().toLowerCase();
    inputVal = '';

    if (!trimmed) return;

    if (trimmed === 'clear') {
      history.set([]);
      return;
    }

    const validPages: Page[] = ['about', 'projects', 'skills', 'contact', 'home'];

    if (validPages.includes(trimmed as Page)) {
      currentPage.set(trimmed as Page);
      history.update(h => [
        ...h,
        { command: trimmed, output: `Navigated display pane to: ${trimmed}` }
      ]);
      return;
    }

    if (trimmed === 'help') {
      let helpText = 'Available Commands:\n';
      for (const [cmd, desc] of Object.entries(COMMANDS)) {
        helpText += `  <span class="cmd">${cmd.padEnd(10)}</span> - ${desc}\n`;
      }
      history.update(h => [...h, { command: trimmed, output: helpText }]);
      return;
    }

    history.update(h => [
      ...h,
      {
        command: trimmed,
        output: `Command not found: "${trimmed}". Type 'help' for options.`,
        isError: true
      }
    ]);
  }

  onMount(() => {
    inputElement?.focus();
  });
</script>

<main class="arc-desktop">
  <div class="split-screen">
    <!-- LEFT HALF: TERMINAL WITH SLITHERING WAVY SVG SNAKE BORDER -->
    <div class="snake-border-wrapper" on:click={() => inputElement?.focus()} role="presentation">
      <!-- SVG Wavy Light Beam Engine -->
      <svg class="snake-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="snake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0" />
            <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.4" />
            <stop offset="65%" stop-color="#b388ff" />
            <stop offset="90%" stop-color="#ff8a7a" />
            <stop offset="100%" stop-color="#ffffff" />
          </linearGradient>

          <!-- Real-time SVG Sine-Wave Turbulence Distortion -->
          <filter id="wave-distort" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.04 0.04" numOctaves="2" result="noise" seed="2">
              <animate attributeName="baseFrequency" values="0.03 0.03;0.07 0.05;0.03 0.03" dur="3.5s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <!-- Subtle static track guide -->
        <rect class="snake-track" x="2" y="2" rx="16" ry="16" />

        <!-- Wavy Animated Slithering Snake -->
        <rect class="snake-line" x="2" y="2" rx="16" ry="16" pathLength="100" />
      </svg>

      <section class="pane terminal-pane">
        <div class="header">
          <div class="window-controls">
            <span class="btn red"></span>
            <span class="btn yellow"></span>
            <span class="btn green"></span>
          </div>
          <div class="arc-url-pill">
            <span class="pill-dot">⚡</span>
            <span>arc://terminal</span>
          </div>
        </div>

        <div class="terminal-body" bind:this={terminalBodyElement}>
          <div class="welcome">
            <p class="brand">PORTFOLIO_OS v1.0</p>
            <p>Type <span class="highlight">'help'</span> to see commands or navigate using <span class="highlight">'about'</span>, <span class="highlight">'projects'</span>, etc.</p>
          </div>

          {#each $history as item}
            <div class="history-item">
              <div class="prompt-line">
                <span class="user">visitor</span>:<span class="path">~</span>$ {item.command}
              </div>
              <div class="output" class:error={item.isError}>
                {@html item.output}
              </div>
            </div>
          {/each}

          <div class="input-line">
            <span class="user">visitor</span>:<span class="path">~</span>$&nbsp;
            <input
              type="text"
              bind:value={inputVal}
              bind:this={inputElement}
              on:keydown={handleCommand}
              spellcheck="false"
              autocomplete="off"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- RIGHT HALF: PAGE VIEWER -->
    <section class="pane content-pane">
      <div class="header">
        <div class="arc-url-pill">
          <span class="pill-dot">✦</span>
          <span>arc://views/{$currentPage}</span>
        </div>
      </div>

      <div class="content-body">
        {#if $currentPage === 'home'}
          <div class="home-placeholder">
            <h1>Welcome</h1>
            <p>Enter a navigation command in the left terminal to render a page view here.</p>
          </div>
        {:else if $currentPage === 'about'}
          <About />
        {:else if $currentPage === 'projects'}
          <Projects />
        {:else if $currentPage === 'skills'}
          <Skills />
        {:else if $currentPage === 'contact'}
          <Contact />
        {/if}
      </div>
    </section>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: radial-gradient(at 0% 0%, #ff8a7a 0px, transparent 45%),
                radial-gradient(at 100% 0%, #b388ff 0px, transparent 45%),
                radial-gradient(at 50% 100%, #38bdf8 0px, transparent 50%),
                #111116;
    background-attachment: fixed;
    color: #f1f5f9;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
    overflow: hidden;
  }

  .arc-desktop {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
  }

  .split-screen {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 16px;
    box-sizing: border-box;
  }

  /* --- Slithering Wavy SVG Snake Border --- */
  .snake-border-wrapper {
    position: relative;
    flex: 1;
    height: 100%;
    min-height: 0;
    border-radius: 18px;
    padding: 3px;
    display: flex;
    cursor: text;
    box-sizing: border-box;
  }

  .snake-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
  }

  .snake-track {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    fill: none;
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 1.5;
  }

  .snake-line {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    fill: none;
    stroke: url(#snake-grad);
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-dasharray: 20 80;
    stroke-dashoffset: 0;
    filter: url(#wave-distort) drop-shadow(0 0 6px #38bdf8) drop-shadow(0 0 14px #b388ff);
    animation: snake-slither-crawl 4.5s linear infinite;
  }

  @keyframes snake-slither-crawl {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  /* --- Arc Frosted Panes --- */
  .pane {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: rgba(22, 22, 28, 0.75);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-radius: 16px;
    overflow: hidden;
    z-index: 2;
    box-sizing: border-box;
  }

  .terminal-pane {
    background: rgba(14, 14, 18, 0.92);
    font-family: 'SF Mono', 'Fira Code', monospace;
    width: 100%;
    margin: 1px;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .content-pane {
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  }

  /* Arc Titlebars & URL Pills */
  .header {
    background: rgba(255, 255, 255, 0.03);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    height: 34px;
    gap: 12px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .arc-url-pill {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.76rem;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 auto;
  }

  .pill-dot {
    font-size: 0.7rem;
    color: #38bdf8;
  }

  .window-controls {
    display: flex;
    gap: 6px;
  }

  .btn {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .red { background-color: #ff5f56; }
  .yellow { background-color: #ffbd2e; }
  .green { background-color: #27c93f; }

  /* Terminal Body */
  .terminal-body {
    padding: 20px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    box-sizing: border-box;
  }

  .brand { color: #38bdf8; font-weight: bold; margin: 0 0 6px 0; }
  .highlight { color: #ff8a7a; }
  .user { color: #a78bfa; font-weight: 600; }
  .path { color: #38bdf8; }

  .input-line {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  input {
    background: transparent;
    border: none;
    color: #f8fafc;
    font-family: inherit;
    font-size: 0.92rem;
    outline: none;
    flex: 1;
    min-width: 0;
  }

  .history-item { margin: 8px 0; }
  .output { white-space: pre-wrap; margin-left: 8px; color: rgba(255, 255, 255, 0.7); font-size: 0.88rem; }
  .error { color: #f87171; }
  :global(.cmd) { color: #38bdf8; font-weight: bold; }

  /* Right Pane Content */
  .content-body {
    padding: 28px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .home-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
  }

  @media (max-width: 768px) {
    .split-screen {
      flex-direction: column;
    }
  }
</style>
