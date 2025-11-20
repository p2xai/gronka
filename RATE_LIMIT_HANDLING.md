# cobalt rate limit handling implementation

## overview

this implementation addresses rate limiting issues when multiple users download from social media urls via cobalt. the solution includes automatic retries, request queuing, url deduplication, and user-controlled deferred downloads.

## key features

### 1. exponential backoff retry with smart error detection

- **file**: `src/utils/cobalt.js`
- automatically retries failed cobalt api calls up to 3 times
- uses exponential backoff delays: 1s, 2s, 4s
- **smart error analysis** distinguishes rate limiting from content not found:
  - checks http status codes (429 = rate limit)
  - analyzes response timing (< 1s = likely not found, > 2s = likely rate limit)
  - checks error text for "not found", "deleted", "unavailable"
  - explicit rate limit errors always treated as rate limits
- throws `RateLimitError` only for actual rate limiting
- throws `NetworkError` for content not found (doesn't retry)

### 2. request queue with concurrency limiting

- **file**: `src/utils/cobalt-queue.js`
- limits concurrent cobalt api calls to 2 maximum
- queues additional requests when limit reached
- automatically processes queue as slots become available
- provides queue statistics via `getQueueStats()`

### 3. url-based deduplication

- **file**: `src/utils/cobalt-queue.js`
- tracks in-progress downloads by url hash
- if same url requested multiple times, waits for first download to complete
- shares result with all waiting requests
- prevents redundant api calls

### 4. deferred download queue with intelligent retry

- **file**: `src/utils/deferred-download-queue.js`
- persistent queue stored in `data/deferred-downloads.json`
- processes pending downloads every 2 minutes
- **retries failed downloads up to 10 times** (covers ~20 minutes of retry window)
- **stops retrying if content not found** (saves resources on deleted content)
- status types:
  - `pending` - waiting to be processed
  - `processing` - currently being processed
  - `failed` - temporary failure, will retry
  - `failed_permanent` - max retries exceeded or content not found
  - `completed` - successfully processed
  - `cancelled` - user cancelled
- automatic cleanup of old completed/failed_permanent/cancelled requests (24 hours)
- survives bot restarts

### 5. discord button interface

- **file**: `src/commands/download.js`
- when rate limit errors occur after retries, shows buttons:
  - "try again later" - queues download for background processing
  - "cancel" - dismisses the request
- user-friendly interface for handling rate limit issues

### 6. dm notifications

- **file**: `src/utils/deferred-download-notifier.js`
- sends dm to user when deferred download completes
- falls back to follow-up message if dms disabled
- includes download link and size info

### 7. button interaction handlers

- **file**: `src/bot.js`
- handles button clicks for defer and cancel
- processes deferred downloads in background
- integrates with existing download pipeline

## flow diagram

```
user requests download
         |
         v
   queue request (max 2 concurrent)
         |
         v
   check url deduplication
         |
    +----+----+
    |         |
existing   new download
download      |
    |         v
    |    call cobalt api
    |         |
    |    +----+----+
    |    |         |
    | success   error.api.fetch.empty
    |    |         |
    |    |         v
    |    |    retry with exponential backoff
    |    |    (1s, 2s, 4s delays)
    |    |         |
    |    |    +----+----+
    |    |    |         |
    |    | success   still fails
    |    |    |         |
    +----+----+         v
         |         show buttons:
         |         [try again later] [cancel]
         |                   |
         v                   v
    download file      user clicks button
         |                   |
         v              +----+----+
    process file       |         |
         |          defer    cancel
         v             |         |
    save to disk      v         v
         |       add to queue  dismiss
         v             |
    return url         v
              background processor
              (runs every 2 minutes)
                      |
                      v
              retry download
                      |
                      v
              dm user with result
```

## configuration

no additional configuration required. the system uses existing config values:

- `COBALT_API_URL` - cobalt api endpoint
- `COBALT_ENABLED` - whether cobalt is enabled
- `MAX_VIDEO_SIZE` - max file size for non-admin users

## usage

the rate limit handling is automatic and transparent to users:

1. **normal flow**: user requests download, it succeeds
2. **rate limit flow**:
   - download fails with rate limit error
   - automatic retries (3 attempts)
   - if still failing, show buttons
   - user clicks "try again later"
   - request queued for background processing
   - user receives dm when ready

## monitoring

queue statistics available via:

```javascript
import { getQueueStats } from './utils/cobalt-queue.js';
const stats = getQueueStats();
// returns: { activeRequests, queuedRequests, inProgressUrls, maxConcurrent }
```

deferred queue statistics:

```javascript
import { getQueueStats } from './utils/deferred-download-queue.js';
const stats = getQueueStats();
// returns: { total, pending, processing, completed, failed, cancelled }
```

## file changes summary

### new files

- `src/utils/cobalt-queue.js` - request queue and deduplication
- `src/utils/deferred-download-queue.js` - background job queue
- `src/utils/deferred-download-notifier.js` - dm notification system

### modified files

- `src/utils/cobalt.js` - added retry logic and RateLimitError
- `src/commands/download.js` - integrated queue and button ui
- `src/bot.js` - added button handlers and deferred download processor

## testing recommendations

1. test rate limit detection with multiple concurrent requests
2. verify exponential backoff delays
3. test button interactions (defer and cancel)
4. verify dm notifications work
5. test fallback to follow-up when dms disabled
6. verify queue persistence across bot restarts
7. test url deduplication with identical requests
8. verify cleanup of old queue entries

## notes

- max 2 concurrent cobalt requests prevents overwhelming the service
- url deduplication saves api calls when multiple users request same content
- exponential backoff gives platform time to recover from rate limiting
- persistent queue ensures no lost requests during bot restarts
- dm fallback ensures users always receive notifications
