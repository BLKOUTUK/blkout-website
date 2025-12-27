# Coolify Disk Space Cleanup Guide

## Error
```
fatal: cannot create directory at 'public/images/squared/face square': No space left on device
Deployment failed at 94% file update
```

## Check Disk Space

1. **Log into Coolify Dashboard**
   - Go to https://infra.blkoutuk.cloud
   - Navigate to Servers → localhost

2. **Check Disk Usage**
   - Look for disk space metrics
   - Typical issue: Docker images/containers filling disk
   - Warning threshold: Usually triggers at 80%+

## Cleanup Actions

### Option 1: Remove Old Docker Images
In Coolify dashboard or server SSH:
```bash
docker system df  # Check what's using space
docker image prune -a  # Remove unused images
docker container prune  # Remove stopped containers
docker volume prune  # Remove unused volumes
```

### Option 2: Remove Old Deployments
- Navigate to Applications → blkout-core
- Check deployment history
- Delete old failed/unused deployments

### Option 3: Clean Build Artifacts
```bash
# If you have SSH access:
cd /artifacts
du -sh * | sort -hr | head -20  # Find largest artifacts
# Remove old artifact folders
```

### Option 4: Remove Defunct Applications
- The old "scrollytelling" project (soco0k0gscc8k800s8g8ok0c)
- Any test/abandoned applications
- This frees up both disk and container resources

## After Cleanup

1. Trigger manual deployment in Coolify UI
2. Or wait for next git push to auto-trigger
3. Monitor deployment logs for success

## Prevention

### Added .dockerignore
Now excludes from builds:
- AI metadata (.claude-flow, .swarm)
- Large unused images
- Videos folder (113MB+)
- Development files

### Recommended .gitignore Additions
Add to blkout-website/.gitignore:
```
# Large development assets
public/images/collective-png/
public/images/blkoutuk.com v3/
public/videos/

# Keep only production assets:
# - theory-of-change cards
# - theory-backgrounds-resized
# - collective (for slideshow)
# - squared (features)
```

## Current Repo Size
- Was: 11,945 files (~800MB+)
- After cleanup: Still large but Zone.Identifiers removed
- With .dockerignore: Docker builds skip ~400MB

## If Space Still Issues

**Nuclear Option**: Clone fresh on Coolify server
- May need to ssh into server
- Clean /artifacts directory
- Remove all Docker images
- Fresh deployment from GitHub
