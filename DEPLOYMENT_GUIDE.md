/**
 * MaxSec Complete Deployment & Build Guide
 */

# MaxSec - Deployment & Build Guide

## Overview

MaxSec is a comprehensive system security monitoring solution with:

- **Backend**: Python 3.11+ agent with cross-platform process monitoring
- **Frontend**: React + Electron desktop application with advanced dashboard
- **Architecture**: Modular, production-grade security framework

## Prerequisites

### System Requirements

**Windows:**
- Windows 10 (21H2) or later
- .NET Framework 4.8+ (for some system tools)
- Administrator privileges required

**Linux:**
- Ubuntu 20.04 LTS or later, or equivalent
- Python 3.11+
- systemd support (for service installation)

**All Platforms:**
- Node.js 16.13+
- npm/yarn 8+
- Python 3.11+

### Development Environment

```bash
# Install Node.js (if not already installed)
# From https://nodejs.org/ (LTS recommended)

# Install Python
# Windows: https://www.python.org/downloads/
# Linux: sudo apt install python3.11 python3.11-venv

# Verify installations
node --version  # Should be 16.13+
npm --version   # Should be 8+
python --version  # Should be 3.11+
```

## Building from Source

### Step 1: Clone and Setup

```bash
cd /path/to/MaxSec
cd ui  # Frontend setup

# Install Node dependencies
npm install

cd ../agent-core  # Backend setup

# Create Python virtual environment
python3.11 -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Development Build

```bash
# Terminal 1: Backend
cd agent-core
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m maxsec.main --mode monitor

# Terminal 2: Frontend
cd ui
npm run dev

# Terminal 3: Electron (when ready)
cd ui
npm run electron:dev
```

### Step 3: Production Build

```bash
# Build Frontend
cd ui
npm run build

# Build Electron App
npm run electron:build

# Build Backend
cd ../agent-core
python -m PyInstaller maxsec.spec  # Creates standalone executable
```

## Installation

### Windows Installer

```bash
cd ui

# Generate MSI installer
npm run electron:build -- --win msi

# Generate portable EXE
npm run electron:build -- --win portable
```

Installers will be in `ui/dist/`:
- `MaxSec-Setup.msi` - Standard installer
- `MaxSec-portable.exe` - Portable version

### Linux Package

```bash
# Debian/Ubuntu
npm run electron:build -- --linux deb

# Red Hat/CentOS
npm run electron:build -- --linux rpm

# AppImage
npm run electron:build -- --linux AppImage
```

### macOS Package (if supporting)

```bash
npm run electron:build -- --mac
```

## Configuration

### Backend Configuration

Create `agent-core/config.yaml`:

```yaml
# MaxSec Agent Configuration

agent:
  mode: "monitor"  # monitor, enforce, lockdown
  scan_interval: 5  # seconds
  risk_threshold: 50  # 0-100

monitoring:
  enabled: true
  track_network: true
  track_file_access: true
  hidden_processes: true

enforcement:
  auto_quarantine: false
  auto_terminate: false
  reversible_only: true

database:
  path: "./data/maxsec.db"
  retention_days: 90

telemetry:
  enabled: true
  export_interval: 60  # seconds

logging:
  level: "INFO"  # DEBUG, INFO, WARNING, ERROR
  file: "./logs/maxsec.log"
  max_size_mb: 100
  backup_count: 5
```

### Frontend Configuration

Edit `ui/src/config/environment.ts`:

```typescript
export const API_BASE_URL = "http://localhost:8000";
export const WS_URL = "ws://localhost:8001";

export const FEATURES = {
  DARK_MODE: true,
  ADVANCED_MONITORING: true,
  THREAT_INTELLIGENCE: true,
};
```

## Running

### From Development

```bash
# Terminal 1: Backend
cd agent-core
source venv/bin/activate
python -m maxsec.main --mode monitor

# Terminal 2: Frontend
cd ui
npm run dev
```

Visit `http://localhost:5173` in your browser.

### From Installation

#### Windows

```powershell
# Using installer
# Run MaxSec-Setup.msi and follow prompts

# Or command line
MaxSec-portable.exe
```

#### Linux

```bash
# Using systemd service
sudo systemctl start maxsec-agent
sudo systemctl enable maxsec-agent

# Or direct execution
/opt/maxsec/maxsec-agent --mode monitor
```

## Deployment Checklist

- [ ] Backend Python environment configured
- [ ] Frontend dependencies installed
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Logs directory created
- [ ] Firewall rules configured (if needed)
- [ ] SSL certificates installed (for production)
- [ ] Admin privileges verified
- [ ] Service auto-start configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Security scan performed
- [ ] Load testing completed
- [ ] Disaster recovery plan prepared

## Troubleshooting

### Backend Issues

```bash
# Check Python version
python --version

# Verify dependencies
pip list

# Test imports
python -c "import maxsec"

# Run diagnostics
python -m maxsec.main --diagnose

# View logs
tail -f logs/maxsec.log
```

### Frontend Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Electron version
npm list electron

# Run type checking
npm run type-check

# Test build
npm run build
```

### Connection Issues

```bash
# Test backend API
curl http://localhost:8000/api/health

# Test WebSocket
wscat -c ws://localhost:8001

# Check ports
netstat -an | grep LISTEN  # Linux
netstat -ano | findstr LISTENING  # Windows
```

## Performance Optimization

### Backend

- Enable process monitoring batching
- Adjust scan intervals for your workload
- Use memory-efficient data structures
- Implement caching for risk scores

### Frontend

- Lazy load components
- Implement virtual scrolling for large tables
- Optimize chart re-renders
- Use React.memo for expensive components

## Security Hardening

### Windows

```powershell
# Enable Process Isolation
Set-ProcessMitigation -System -Enable DEP

# Verify Code Signing
signtool verify /pa MaxSec.exe
```

### Linux

```bash
# Set proper file permissions
chmod 755 /opt/maxsec/maxsec-agent
chmod 700 /etc/maxsec/

# Enable SELinux context (if using SELinux)
semanage fcontext -a -t admin_home_t "/etc/maxsec(/.*)?"
restorecon -R /etc/maxsec/
```

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:8000/api/health

# Check resource usage
ps aux | grep maxsec-agent  # Linux
tasklist /FI "IMAGENAME eq MaxSec*"  # Windows

# Monitor logs
tail -f /var/log/maxsec/maxsec.log
```

### Updates

```bash
# Check for updates
maxsec --check-updates

# Update application
maxsec --update

# Rollback (if needed)
maxsec --rollback --version 1.0.0
```

## Support

For issues or questions:
1. Check logs: `logs/maxsec.log`
2. Run diagnostics: `python -m maxsec.main --diagnose`
3. Review documentation
4. Submit issue with logs and system info

## License

MIT License - See LICENSE file
