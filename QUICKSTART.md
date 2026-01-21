# MaxSec Project Quick Start Guide

## 📦 Project Structure

```
MaxSec/
├── agent-core/              # Real-time monitoring engine
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── logger.py            # Structured logging
│   ├── process_monitor.py   # Process enumeration & tracking
│   └── database.py          # SQLite schema & operations
│
├── analyzer/                # Risk scoring & detection
│   ├── __init__.py
│   └── risk_analyzer.py     # Behavior analysis engine
│
├── controller/              # Policy & enforcement
│   ├── __init__.py
│   └── enforcement.py       # Action execution
│
├── ui/                      # User interface (to be built)
│   └── README.md            # UI implementation guide
│
├── telemetry/               # Metrics & logging (to be built)
├── tests/                   # Unit & integration tests
├── docs/                    # Documentation & design docs
├── packaging/               # Windows MSI, Linux .deb/.rpm
│
├── requirements.txt         # Python dependencies
├── maxsec.default.yaml      # Configuration template
├── README.md                # Project overview
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11+
- Windows 10+ / Linux (Ubuntu 20.04+, CentOS 8+)
- Administrator/sudo privileges (for enforcement features)

### Quick Start (Linux/Mac)

```bash
# Clone & setup
git clone https://github.com/your-org/maxsec.git
cd maxsec

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run agent in monitor mode (safe)
python -m agent_core.main --mode monitor --log-level INFO
```

### Quick Start (Windows)

```bash
# Clone & setup
git clone https://github.com/your-org/maxsec.git
cd maxsec

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run agent (requires admin terminal)
python -m agent_core.main --mode monitor --log-level INFO
```

---

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_core.py -v

# Run with coverage report
pytest tests/ --cov=agent-core --cov=analyzer --cov=controller --cov-report=html

# Run only analyzer tests
pytest tests/test_core.py::TestBehaviorAnalyzer -v

# Run async tests
pytest tests/test_core.py -v --asyncio-mode=auto
```

---

## 📊 Core Modules Overview

### 1. **agent-core/process_monitor.py**
Monitors all running processes in real-time

```python
from agent_core.process_monitor import ProcessMonitor

monitor = ProcessMonitor()
processes = await monitor.enumerate_processes()
# Returns: List[ProcessInfo] with pid, name, hash, connections, etc.
```

### 2. **analyzer/risk_analyzer.py**
Scores process risk using 6-factor weighted model

```python
from analyzer.risk_analyzer import BehaviorAnalyzer

analyzer = BehaviorAnalyzer()
risk_score, factors = analyzer.calculate_risk_score(process_data)
# risk_score: 0-100
# factors: dict of individual component scores
```

### 3. **controller/enforcement.py**
Executes enforcement actions (terminate, suspend, block, etc.)

```python
from controller.enforcement import EnforcementController, EnforcementAction

controller = EnforcementController(mode="enforce")
await controller.execute_action(pid, EnforcementAction.TERMINATE)
```

---

## 📋 Configuration

Edit `maxsec.default.yaml` to customize:

```yaml
mode: "monitor"  # or "enforce", "lockdown"

monitoring:
  process_enumeration_interval: 5  # seconds

risk_scoring:
  permission_abuse_weight: 0.25
  # ... other factors ...

alerts:
  min_risk_score: 60  # Alert threshold

policies:
  - name: "Critical Threat Auto-Terminate"
    trigger_risk_score: 85
    action: "terminate"
```

---

## 🔧 Development Workflow

### 1. Make Changes
```bash
# Edit code
vim agent-core/process_monitor.py
```

### 2. Format & Lint
```bash
# Format code with black
black agent-core analyzer controller

# Check with flake8
flake8 agent-core analyzer controller --max-line-length=120

# Type check
mypy agent-core analyzer --ignore-missing-imports
```

### 3. Test
```bash
# Run tests
pytest tests/test_core.py -v

# Run with coverage
pytest tests/ --cov=agent-core --cov-report=html
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: add process network tracking"
git push origin feature/process-tracking
```

---

## 📈 Risk Scoring Formula

```
RiskScore = Σ(FactorWeight × FactorSeverity)

Factors:
├── Permission Abuse         25% weight
├── Hidden Execution         20% weight
├── Network Anomalies        20% weight
├── Persistence Behavior     15% weight
├── Resource Spikes          10% weight
└── Masquerading Risk        10% weight

Classification:
├── 0-30:    SAFE
├── 31-60:   SUSPICIOUS
├── 61-80:   HIGH_RISK
└── 81-100:  CRITICAL
```

---

## 🛡️ Security Notes

**Monitor Mode** (default, safe)
- Collects data & scores risk
- Alerts only, no enforcement
- Perfect for testing & development

**Enforce Mode**
- Auto-executes enforcement policies
- Requires review of false positive risk

**Lockdown Mode**
- Maximum protection
- May disrupt non-critical processes

---

## 📚 Key Documentation

- [Technical Design Document](docs/TDD.md)
- [Process Monitor API](agent-core/process_monitor.py)
- [Risk Analyzer Docs](analyzer/risk_analyzer.py)
- [Enforcement Controller Docs](controller/enforcement.py)
- [Configuration Guide](maxsec.default.yaml)

---

## 🐛 Troubleshooting

**Issue: Permission denied on Linux**
```bash
# Run with sudo
sudo python -m agent_core.main --mode monitor
```

**Issue: psutil not found**
```bash
pip install psutil
```

**Issue: Tests fail with async errors**
```bash
pip install pytest-asyncio
pytest tests/ --asyncio-mode=auto
```

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: security@maxsec.io

---

**Version**: 0.1.0-alpha | **Last Updated**: January 2026
