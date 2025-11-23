<script>
  import { onMount } from 'svelte';
  import Stats from './Stats.svelte';
  import Health from './Health.svelte';
  import Operations from './Operations.svelte';
  import Logs from './Logs.svelte';
  import LogMetrics from './LogMetrics.svelte';

  let activeTab = 'dashboard';

  function setTab(tab) {
    activeTab = tab;
    // Update URL without page reload
    const url = tab === 'dashboard' ? '/' : `/${tab}`;
    window.history.pushState({ tab }, '', url);
  }

  function getTabFromPath() {
    const path = window.location.pathname;
    if (path === '/logs') return 'logs';
    if (path === '/metrics') return 'metrics';
    return 'dashboard';
  }

  onMount(() => {
    // Set initial tab from URL
    activeTab = getTabFromPath();

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      activeTab = getTabFromPath();
    });
  });
</script>

<main>
  <header>
    <div class="header-content">
      <h1>gronka</h1>
      <nav class="tabs">
        <a
          href="/"
          class="tab"
          class:active={activeTab === 'dashboard'}
          on:click|preventDefault={() => setTab('dashboard')}
        >
          dashboard
        </a>
        <a
          href="/logs"
          class="tab"
          class:active={activeTab === 'logs'}
          on:click|preventDefault={() => setTab('logs')}
        >
          logs
        </a>
        <a
          href="/metrics"
          class="tab"
          class:active={activeTab === 'metrics'}
          on:click|preventDefault={() => setTab('metrics')}
        >
          metrics
        </a>
      </nav>
    </div>
  </header>
  <div class="content">
    {#if activeTab === 'dashboard'}
      <Stats />
      <Health />
      <Operations />
    {:else if activeTab === 'logs'}
      <Logs />
    {:else if activeTab === 'metrics'}
      <LogMetrics />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #1a1a1a;
    color: #e0e0e0;
    line-height: 1.6;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    padding: 2rem;
    border-bottom: 1px solid #333;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background-color: transparent;
    color: #888;
    border: 1px solid transparent;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.2s;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
  }

  .tab:hover {
    color: #aaa;
    background-color: #2a2a2a;
  }

  .tab.active {
    color: #fff;
    background-color: #333;
    border-color: #444;
  }

  .content {
    flex: 1;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 2rem;
    row-gap: 1rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  .content > :global(section:last-child) {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    header {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .tabs {
      justify-content: stretch;
    }

    .tab {
      flex: 1;
      padding: 0.75rem;
    }
  }
</style>

