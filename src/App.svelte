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
  let terminalEnd: HTMLDivElement;

  $: if ($history) {
    scrollToBottom();
  }

  async function scrollToBottom() {
    await tick();
    terminalEnd?.scrollIntoView({ behavior: 'smooth' });
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

<div class="split-screen">
  <!-- LEFT HALF: TERMINAL -->
  <section class="pane terminal-pane" on:click={() => inputElement?.focus()}>
    <div class="header">
      <div class="window-controls">
        <span class="btn red"></span>
        <span class="btn yellow"></span>
        <span class="btn green"></span>
      </div>
      <span class="title">terminal@portfolio:~</span>
    </div>

    <div class="terminal-body">
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
          autofocus
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div bind:this={terminalEnd}></div>
    </div>
  </section>

  <!-- RIGHT HALF: PAGE VIEWER -->
  <section class="pane content-pane">
    <div class="header">
      <span class="title">view://{$currentPage}</span>
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

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #0b0e14;
    color: #c9d1d9;
    font-family: 'Fira Code', monospace, sans-serif;
  }

  .split-screen {
    display: flex;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 12px;
    gap: 12px;
  }

  .pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    overflow: hidden;
  }

  .header {
    background-color: #21262d;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #30363d;
    position: relative;
    height: 20px;
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

  .title {
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;
    font-size: 0.8rem;
    color: #8b949e;
  }

  /* Left Pane Styles */
  .terminal-body {
    padding: 15px;
    flex: 1;
    overflow-y: auto;
  }

  .brand { color: #58a6ff; font-weight: bold; margin: 0 0 5px 0; }
  .highlight { color: #f0883e; }
  .user { color: #7ee787; }
  .path { color: #79c0ff; }

  .input-line {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  input {
    background: transparent;
    border: none;
    color: #c9d1d9;
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    flex: 1;
  }

  .history-item { margin: 8px 0; }
  .output { white-space: pre-wrap; margin-left: 8px; color: #8b949e; font-size: 0.9rem; }
  .error { color: #ffa198; }
  :global(.cmd) { color: #79c0ff; font-weight: bold; }

  /* Right Pane Styles */
  .content-body {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
  }

  .home-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8b949e;
    text-align: center;
  }

  /* Responsive layout for mobile devices */
  @media (max-width: 768px) {
    .split-screen {
      flex-direction: column;
    }
  }
</style>
