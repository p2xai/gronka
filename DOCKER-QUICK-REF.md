# Docker Quick Reference Guide

Quick reference for managing Docker containers and troubleshooting common issues.

## Quick Status Checks

### See what's running

```bash
npm run docker:status    # Show all services status
npm run docker:which     # List running service names
npm run docker:ps        # Show containers with ports
npm run docker:stats     # Show resource usage (CPU, memory, network)
```

### Check health

```bash
npm run docker:health    # Check service health status
```

## Viewing Logs

### Individual service logs

```bash
npm run docker:logs:app      # Follow app logs (bot + server)
npm run docker:logs:webui    # Follow webui logs
npm run docker:logs:tunnel   # Follow cloudflared tunnel logs
npm run docker:logs:all      # Follow all logs together
```

### View last 100 lines (without following)

```bash
docker compose logs --tail=100 app
docker compose --profile webui logs --tail=100 webui
```

## Starting Services

### Start individual services

```bash
npm run docker:start:app      # Start main app (bot + server)
npm run docker:start:webui    # Start webui dashboard
npm run docker:start:tunnel   # Start cloudflared tunnel
```

### Start everything

```bash
npm run docker                # Start app only
npm run docker -- --profile webui --profile tunnel  # Start all services
```

## Stopping Services

### Stop individual services

```bash
npm run docker:stop:app       # Stop app service
npm run docker:stop:webui     # Stop webui service
npm run docker:stop:tunnel    # Stop tunnel service
```

### Stop everything

```bash
npm run docker:stop           # Stop all services and remove containers
```

## Restarting Services

### Restart individual services

```bash
npm run docker:restart:app    # Restart app (keeps container)
npm run docker:restart:webui  # Restart webui
npm run docker:restart:tunnel # Restart tunnel
npm run docker:restart:all    # Restart all running services
```

## Rollback & Recovery

### Remove a bad deployment (rollback)

```bash
# Remove webui completely (stops and removes container)
npm run docker:remove:webui

# Remove tunnel completely
npm run docker:remove:tunnel

# After removing, you can start fresh:
npm run docker:start:webui    # Start webui again
npm run docker:start:tunnel   # Start tunnel again
```

### Rebuild and restart

```bash
npm run docker:rebuild:app    # Rebuild app image and restart
npm run docker:rebuild:webui  # Rebuild webui image and restart
npm run docker:rebuild:tunnel # Recreate tunnel container
```

### Full rebuild

```bash
npm run docker:rebuild        # Rebuild all and restart
```

## Debugging

### Open shell in container

```bash
npm run docker:shell          # Open shell in app container
npm run docker:shell:webui    # Open shell in webui container
```

### Execute commands

```bash
npm run docker:exec ls -la    # Run command in app container
npm run docker:env            # Show environment variables
npm run docker:inspect        # Inspect container configuration
```

### Check if services are accessible

```bash
# Check app health endpoint
curl http://localhost:3000/health

# Check webui (if running)
curl http://127.0.0.1:3001
```

## Common Troubleshooting

### Container won't start

1. **Check logs for errors:**

   ```bash
   npm run docker:logs:app
   ```

2. **Check if port is already in use:**

   ```bash
   # On Mac/Linux
   lsof -i :3000
   # On Windows
   netstat -ano | findstr :3000
   ```

3. **Verify environment variables:**

   ```bash
   npm run docker:env
   # Or check .env file exists and has required variables
   ```

4. **Check container status:**
   ```bash
   npm run docker:status
   ```

### Service is unhealthy

1. **Check health status:**

   ```bash
   npm run docker:health
   ```

2. **Check logs:**

   ```bash
   npm run docker:logs:app
   ```

3. **Restart the service:**
   ```bash
   npm run docker:restart:app
   ```

### WebUI not accessible

1. **Check if webui is running:**

   ```bash
   npm run docker:status
   ```

2. **Check webui logs:**

   ```bash
   npm run docker:logs:webui
   ```

3. **Restart webui:**

   ```bash
   npm run docker:restart:webui
   ```

4. **If still broken, remove and restart:**
   ```bash
   npm run docker:remove:webui
   npm run docker:start:webui
   ```

### Tunnel connection issues

1. **Check tunnel logs:**

   ```bash
   npm run docker:logs:tunnel
   ```

2. **Verify tunnel token:**

   ```bash
   # Check .env file has CLOUDFLARE_TUNNEL_TOKEN
   # Check config/cloudflared-config.yml has correct hostname
   ```

3. **Restart tunnel:**
   ```bash
   npm run docker:restart:tunnel
   ```

### FFmpeg not working

1. **Check if FFmpeg is available in container:**

   ```bash
   npm run docker:exec ffmpeg -version
   ```

2. **If missing, rebuild:**
   ```bash
   npm run docker:rebuild:app
   ```

### Permission issues

1. **Fix permissions on host:**

   ```bash
   # On Mac/Linux
   sudo chown -R $USER:$USER data temp logs
   chmod -R 755 data temp logs
   ```

2. **Check container permissions:**
   ```bash
   npm run docker:shell
   ls -la /app/data
   ```

### Out of disk space

1. **Clean temp files:**

   ```bash
   npm run docker:clean:temp
   ```

2. **Clean Docker system:**
   ```bash
   npm run docker:clean      # Clean stopped containers
   npm run docker:prune       # Aggressive cleanup (removes unused images/volumes)
   ```

## Maintenance

### Clean temporary files

```bash
npm run docker:clean:temp    # Clean temp directory in container
```

### Clean Docker system

```bash
npm run docker:clean         # Stop containers and clean stopped containers
npm run docker:prune         # Aggressive cleanup (removes unused images, volumes, networks)
```

**Warning:** `docker:prune` removes all unused Docker resources system-wide, not just for this project.

## Development Mode

### Run with source code mounted (hot reload)

```bash
npm run docker:dev           # Start with ./src mounted as volume
```

### Register Discord commands

```bash
# If container is running
docker compose exec app npm run register-commands

# If container is not running
docker compose run --rm app npm run register-commands
```

## Quick Command Reference

| Task          | Command                       |
| ------------- | ----------------------------- |
| Check status  | `npm run docker:status`       |
| View app logs | `npm run docker:logs:app`     |
| Restart app   | `npm run docker:restart:app`  |
| Remove webui  | `npm run docker:remove:webui` |
| Rebuild app   | `npm run docker:rebuild:app`  |
| Open shell    | `npm run docker:shell`        |
| Clean temp    | `npm run docker:clean:temp`   |
| Stop all      | `npm run docker:stop`         |

## Rollback Procedure (Example: Bad WebUI)

If you deployed a broken webui and need to rollback:

1. **Stop and remove the broken webui:**

   ```bash
   npm run docker:remove:webui
   ```

2. **Verify it's removed:**

   ```bash
   npm run docker:status
   ```

3. **Fix your code** (if needed)

4. **Rebuild and start fresh:**

   ```bash
   npm run docker:rebuild:webui
   # Or if you just want to start without rebuilding:
   npm run docker:start:webui
   ```

5. **Check logs to verify it's working:**
   ```bash
   npm run docker:logs:webui
   ```

## Getting Help

If you're stuck:

1. **Check the full documentation:**
   - `docs/DOCKER.md` - Complete Docker setup guide
   - `docs/DOCKER-TUNNEL.md` - Cloudflare tunnel specific guide

2. **Check container logs:**

   ```bash
   npm run docker:logs:app
   ```

3. **Inspect container:**

   ```bash
   npm run docker:inspect
   ```

4. **Check Docker system:**
   ```bash
   docker system df              # Show disk usage
   docker system events         # Watch Docker events
   ```
