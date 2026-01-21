"""
Risk Scoring & Behavior Analysis Engine
Evaluates process behavior vs declared permissions and assigns threat levels
"""

import logging
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from enum import Enum

logger = logging.getLogger("maxsec-analyzer")


class RiskLevel(Enum):
    """Risk severity levels"""
    SAFE = (0, 30)
    SUSPICIOUS = (31, 60)
    HIGH_RISK = (61, 80)
    CRITICAL = (81, 100)


@dataclass
class RiskFactor:
    """Individual risk scoring factor"""
    name: str
    weight: float  # Percentage (0-100)
    severity: float  # Current severity (0-100)
    description: str = ""
    
    @property
    def contribution(self) -> float:
        """Calculate contribution to total score"""
        return (self.weight / 100.0) * self.severity


class PermissionProfile:
    """App permission baseline mapping"""
    
    SAFE_PERMISSIONS = {
        "notepad.exe": ["filesystem_read", "network"],
        "chrome.exe": ["filesystem", "network", "camera", "microphone"],
        "zoom.exe": ["camera", "microphone", "network", "audio"],
        "explorer.exe": ["filesystem", "network"],
    }
    
    def __init__(self, app_name: str, permissions: List[str] = None):
        self.app_name = app_name
        self.declared_permissions = permissions or self._get_baseline(app_name)
        self.access_history: Dict[str, int] = {}
    
    def _get_baseline(self, app_name: str) -> List[str]:
        """Get baseline permissions for known apps"""
        return self.SAFE_PERMISSIONS.get(app_name.lower(), [])
    
    def check_permission_violation(self, permission: str) -> bool:
        """Check if permission access violates baseline"""
        return permission not in self.declared_permissions
    
    def log_access(self, permission: str) -> None:
        """Log permission access"""
        self.access_history[permission] = self.access_history.get(permission, 0) + 1


class BehaviorAnalyzer:
    """
    Analyzes process behavior and assigns risk scores
    Uses weighted factor model:
    - Permission abuse (25%)
    - Hidden execution (20%)
    - Network anomalies (20%)
    - Persistence behavior (15%)
    - Resource spikes (10%)
    - Masquerading risk (10%)
    """
    
    def __init__(self):
        self.risk_factors: Dict[str, float] = {
            "permission_abuse": 0.25,
            "hidden_execution": 0.20,
            "network_anomalies": 0.20,
            "persistence_behavior": 0.15,
            "resource_spikes": 0.10,
            "masquerading_risk": 0.10,
        }
        logger.info("BehaviorAnalyzer initialized")
    
    def calculate_risk_score(self, 
                            process_data: Dict,
                            permission_profile: Optional[PermissionProfile] = None) -> Tuple[float, Dict]:
        """
        Calculate comprehensive risk score for a process
        
        Args:
            process_data: Process metadata dictionary
            permission_profile: Optional baseline permission profile
            
        Returns:
            (risk_score, factors_breakdown)
        """
        factors = {}
        total_score = 0.0
        
        # 1. Permission Abuse (25%)
        permission_score = self._analyze_permission_abuse(process_data, permission_profile)
        factors["permission_abuse"] = permission_score
        total_score += permission_score * self.risk_factors["permission_abuse"]
        
        # 2. Hidden Execution (20%)
        hidden_score = self._analyze_hidden_execution(process_data)
        factors["hidden_execution"] = hidden_score
        total_score += hidden_score * self.risk_factors["hidden_execution"]
        
        # 3. Network Anomalies (20%)
        network_score = self._analyze_network_anomalies(process_data)
        factors["network_anomalies"] = network_score
        total_score += network_score * self.risk_factors["network_anomalies"]
        
        # 4. Persistence Behavior (15%)
        persistence_score = self._analyze_persistence(process_data)
        factors["persistence_behavior"] = persistence_score
        total_score += persistence_score * self.risk_factors["persistence_behavior"]
        
        # 5. Resource Spikes (10%)
        resource_score = self._analyze_resource_usage(process_data)
        factors["resource_spikes"] = resource_score
        total_score += resource_score * self.risk_factors["resource_spikes"]
        
        # 6. Masquerading Risk (10%)
        masquerade_score = self._analyze_masquerading(process_data)
        factors["masquerading_risk"] = masquerade_score
        total_score += masquerade_score * self.risk_factors["masquerading_risk"]
        
        # Normalize to 0-100
        final_score = min(100.0, max(0.0, total_score))
        
        logger.debug(f"Risk score for {process_data.get('name')}: {final_score:.1f} " 
                     f"(factors: {factors})")
        
        return final_score, factors
    
    def _analyze_permission_abuse(self, process_data: Dict, 
                                  profile: Optional[PermissionProfile] = None) -> float:
        """Analyze permission violations (0-100 severity)"""
        score = 0.0
        
        # Check for undeclared permission access
        if profile:
            # Simulated: check if process accessed undeclared resources
            connections = process_data.get("connections", 0)
            open_files = process_data.get("open_files", 0)
            
            if connections > profile.app_name.count("."):  # Heuristic
                score += 20.0
            if open_files > 50:
                score += 15.0
        
        return min(100.0, score)
    
    def _analyze_hidden_execution(self, process_data: Dict) -> float:
        """Detect hidden/background execution (0-100 severity)"""
        score = 0.0
        
        # Check for common obfuscation patterns
        name = process_data.get("name", "").lower()
        
        # Typosquatting common system processes
        suspicious_names = {
            "svch0st": 50,  # vs svchost
            "lsasa": 60,     # vs lsass
            "csrsa": 50,     # vs csrss
            "nvcssa": 40,    # vs nvcsvc
        }
        
        for suspicious, severity in suspicious_names.items():
            if suspicious in name:
                score += severity
        
        # Check for no command line (potential injection)
        if not process_data.get("command_line", "").strip():
            score += 25.0
        
        # Check for unusual thread count (injection indicator)
        threads = process_data.get("num_threads", 1)
        if threads > 100:
            score += 20.0
        
        return min(100.0, score)
    
    def _analyze_network_anomalies(self, process_data: Dict) -> float:
        """Detect unusual network activity (0-100 severity)"""
        score = 0.0
        
        connections = process_data.get("connections", 0)
        
        # High number of connections is suspicious
        if connections > 50:
            score += 40.0
        elif connections > 20:
            score += 20.0
        elif connections > 5:
            score += 10.0
        
        # Check for unexpected network activity from system processes
        name = process_data.get("name", "").lower()
        system_processes = ["svchost", "csrss", "services"]
        
        if any(sys_proc in name for sys_proc in system_processes):
            if connections > 2:
                score += 30.0
        
        return min(100.0, score)
    
    def _analyze_persistence(self, process_data: Dict) -> float:
        """Detect persistence mechanisms (0-100 severity)"""
        score = 0.0
        
        user_context = process_data.get("user_context", "").lower()
        name = process_data.get("name", "").lower()
        
        # Check for SYSTEM context (unusual for user apps)
        if "system" in user_context and not any(
            sys_proc in name for sys_proc in ["svchost", "services", "lsass"]
        ):
            score += 25.0
        
        # Runtime longer than 30 days suggests persistence
        create_time = process_data.get("create_time")
        if create_time and create_time < (1e9):  # Very old process
            score += 15.0
        
        return min(100.0, score)
    
    def _analyze_resource_usage(self, process_data: Dict) -> float:
        """Detect resource consumption spikes (0-100 severity)"""
        score = 0.0
        
        cpu_percent = process_data.get("cpu_percent", 0.0)
        mem_percent = process_data.get("mem_percent", 0.0)
        
        # High CPU usage
        if cpu_percent > 80:
            score += 30.0
        elif cpu_percent > 50:
            score += 15.0
        
        # High memory usage
        if mem_percent > 50:
            score += 30.0
        elif mem_percent > 20:
            score += 15.0
        
        return min(100.0, score)
    
    def _analyze_masquerading(self, process_data: Dict) -> float:
        """Detect process name masquerading (0-100 severity)"""
        score = 0.0
        
        name = process_data.get("name", "").lower()
        exe_path = process_data.get("executable", "").lower()
        
        # Mismatch between executable name and path
        if exe_path and name:
            exe_basename = exe_path.split("\\")[-1].split("/")[-1].lower()
            if exe_basename != name and name not in exe_path:
                score += 35.0
        
        # Check for unusual extensions
        if name.endswith((".scr", ".pif", ".bat", ".cmd", ".vbs", ".js")):
            score += 40.0
        
        return min(100.0, score)
    
    def get_risk_level(self, risk_score: float) -> RiskLevel:
        """Classify risk score into level"""
        for level in RiskLevel:
            min_val, max_val = level.value
            if min_val <= risk_score <= max_val:
                return level
        return RiskLevel.CRITICAL
    
    def generate_alert_message(self, process_data: Dict, 
                              risk_score: float, factors: Dict) -> str:
        """Generate human-readable alert message"""
        name = process_data.get("name", "Unknown")
        level = self.get_risk_level(risk_score)
        
        top_factor = max(factors.items(), key=lambda x: x[1])
        
        return (
            f"⚠️ ALERT: {name} (PID {process_data.get('pid')}) - "
            f"Risk Level: {level.name} ({risk_score:.0f}/100) | "
            f"Primary concern: {top_factor[0]}"
        )
