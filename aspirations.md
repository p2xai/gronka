# gif optimization, link goes in, optimized gif comes out.
    
    gif optimized: link
    gif size 6.7mb (-67%)
for cdn.p1x.dev links, process the files locally, no need to fetch, verify we have the file, fallback to link.
use dylanninin/giflossy on docker for fast gif operations

# break down the monolithic bot.js file
    take the .js file and make seperate service related files, ie the downloader service and handlers

# handle all "admin" operations on server where bot is ran, not via discord commands

# migrate from cloudflare tunnels to cloudflare r2 for cdn
    removed cloudflare tunnel service and related configuration from docker-compose
    updated all media file upload/save logic to use cloudflare r2 instead of local disk storage
    express server now handles api endpoints only (health, stats, terms, privacy) and file processing/uploading from discord bot
    actual file serving is handled directly by r2 via custom domain (cdn.gronka.p1x.dev)
    removed direct file serving routes from express (/gifs, /videos, /images) since files are now served directly from r2
    updated 404 handler to redirect to r2-hosted 404 cat image at root level
    created upload script for migrating 404.jpg to r2 bucket
    fixed convert.js flow to properly upload gifs to r2 after conversion and optimization
    files are checked for existence in r2 before upload to avoid re-uploading
    local disk storage retained as fallback if r2 upload fails or r2 is not configured
    no egress fees since r2 serves files directly, server only handles processing and uploads