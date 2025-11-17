export async function fetchStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
}

export async function fetchHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch health:', error);
    throw error;
  }
}

export function formatUptime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }
}

export function formatServerStartTime(uptimeSeconds) {
  if (!uptimeSeconds && uptimeSeconds !== 0) return 'N/A';

  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - uptimeSeconds * 1000);

    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    // If same year, don't show year
    if (startTime.getFullYear() === now.getFullYear()) {
      return startTime.toLocaleDateString('en-US', options);
    }

    // Otherwise include year
    return startTime.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  } catch {
    return 'N/A';
  }
}

export async function fetchCryptoPrices() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      bitcoin: data.bitcoin?.usd || null,
      ethereum: data.ethereum?.usd || null,
    };
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    throw error;
  }
}

export function formatPrice(price) {
  if (price === null || price === undefined) return 'N/A';
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
