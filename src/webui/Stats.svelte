<script>
  import { onMount } from 'svelte';
  import { fetchStats } from './api.js';

  let stats = null;
  let loading = true;
  let error = null;

  async function loadStats() {
    loading = true;
    error = null;
    try {
      stats = await fetchStats();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  });
</script>

<section class="stats">
  <h2>Statistics</h2>
  {#if loading && !stats}
    <div class="loading">Loading...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
    <button on:click={loadStats}>Retry</button>
  {:else if stats}
    <div class="stats-list">
      <div class="stat-line">
        <span class="stat-label">GIFs:</span>
        <span class="stat-value">{stats.total_gifs?.toLocaleString() || '0'} ({stats.gifs_disk_usage_formatted || '0.00 MB'})</span>
      </div>
      <div class="stat-line">
        <span class="stat-label">Videos:</span>
        <span class="stat-value">{stats.videos_disk_usage_formatted || '0.00 MB'}</span>
      </div>
      <div class="stat-line">
        <span class="stat-label">Images:</span>
        <span class="stat-value">{stats.images_disk_usage_formatted || '0.00 MB'}</span>
      </div>
      <div class="stat-line">
        <span class="stat-label">Total:</span>
        <span class="stat-value">{stats.disk_usage_formatted || '0.00 MB'}</span>
      </div>
    </div>
  {/if}
</section>

<style>
  section {
    padding: 0.5rem;
    border: 1px solid #333;
    background-color: #222;
  }

  h2 {
    margin: 0 0 0.375rem 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #fff;
    border-bottom: 1px solid #333;
    padding-bottom: 0.25rem;
  }

  .stats-list {
    margin: 0;
    padding: 0;
  }

  .stat-line {
    padding: 0.25rem 0;
    font-size: 1rem;
    color: #fff;
  }

  .stat-label {
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .stat-value {
    font-weight: 400;
  }

  .loading {
    color: #888;
    padding: 1rem 0;
  }

  .error {
    color: #ff6b6b;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  button {
    background-color: #444;
    color: #fff;
    border: 1px solid #555;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 3px;
  }

  button:hover {
    background-color: #555;
  }

  button:active {
    background-color: #333;
  }
</style>

