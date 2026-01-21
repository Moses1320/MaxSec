"""
Unit tests for MaxSec core components
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, MagicMock
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_core.process_monitor import ProcessMonitor, ProcessInfo
from analyzer.risk_analyzer import BehaviorAnalyzer, RiskLevel, PermissionProfile
from controller.enforcement import EnforcementController, EnforcementAction


class TestProcessMonitor:
    """Test process monitoring module"""
    
    def test_process_monitor_init(self):
        """Test ProcessMonitor initialization"""
        monitor = ProcessMonitor()
        assert monitor is not None
        assert monitor.system in ["Windows", "Linux", "Darwin"]
        assert monitor.enable_hash is True
    
    @pytest.mark.asyncio
    async def test_enumerate_processes(self):
        """Test process enumeration"""
        monitor = ProcessMonitor()
        processes = await monitor.enumerate_processes()
        
        assert isinstance(processes, list)
        assert len(processes) > 0
        
        # Check process structure
        first_process = processes[0]
        assert isinstance(first_process, ProcessInfo)
        assert hasattr(first_process, 'pid')
        assert hasattr(first_process, 'name')
        assert hasattr(first_process, 'executable')


class TestBehaviorAnalyzer:
    """Test risk scoring engine"""
    
    def test_analyzer_init(self):
        """Test analyzer initialization"""
        analyzer = BehaviorAnalyzer()
        assert analyzer is not None
        assert len(analyzer.risk_factors) == 6
    
    def test_calculate_risk_safe_app(self):
        """Test risk calculation for safe app"""
        analyzer = BehaviorAnalyzer()
        
        safe_process = {
            "name": "notepad.exe",
            "pid": 1234,
            "command_line": "C:\\Windows\\notepad.exe",
            "user_context": "User",
            "cpu_percent": 0.5,
            "mem_percent": 1.0,
            "connections": 0,
            "open_files": 5,
            "num_threads": 2
        }
        
        risk_score, factors = analyzer.calculate_risk_score(safe_process)
        assert 0 <= risk_score <= 100
        assert risk_score < 30  # Should be SAFE
    
    def test_calculate_risk_suspicious_app(self):
        """Test risk calculation for suspicious app"""
        analyzer = BehaviorAnalyzer()
        
        suspicious_process = {
            "name": "svch0st.exe",  # Typosquatted svchost
            "pid": 5678,
            "command_line": "",  # No command line
            "user_context": "System",
            "cpu_percent": 85.0,
            "mem_percent": 55.0,
            "connections": 75,  # High connection count
            "open_files": 100,
            "num_threads": 150  # Unusual threads
        }
        
        risk_score, factors = analyzer.calculate_risk_score(suspicious_process)
        assert risk_score > 60  # Should be HIGH_RISK or CRITICAL
    
    def test_risk_level_classification(self):
        """Test risk level classification"""
        analyzer = BehaviorAnalyzer()
        
        assert analyzer.get_risk_level(15) == RiskLevel.SAFE
        assert analyzer.get_risk_level(45) == RiskLevel.SUSPICIOUS
        assert analyzer.get_risk_level(70) == RiskLevel.HIGH_RISK
        assert analyzer.get_risk_level(90) == RiskLevel.CRITICAL
    
    def test_alert_message_generation(self):
        """Test alert message generation"""
        analyzer = BehaviorAnalyzer()
        
        process = {"name": "malware.exe", "pid": 9999}
        factors = {"permission_abuse": 85, "hidden_execution": 60}
        
        message = analyzer.generate_alert_message(process, 75, factors)
        
        assert "malware.exe" in message
        assert "9999" in message
        assert "HIGH_RISK" in message


class TestEnforcementController:
    """Test enforcement and control module"""
    
    def test_controller_init_monitor_mode(self):
        """Test controller initialization in monitor mode"""
        controller = EnforcementController(mode="monitor")
        assert controller.mode == "monitor"
        assert len(controller.policies) > 0
    
    def test_controller_init_enforce_mode(self):
        """Test controller initialization in enforce mode"""
        controller = EnforcementController(mode="enforce")
        assert controller.mode == "enforce"
    
    @pytest.mark.asyncio
    async def test_monitor_mode_no_action(self):
        """Test that monitor mode doesn't execute actions"""
        controller = EnforcementController(mode="monitor")
        
        result = await controller.execute_action(
            1234,
            EnforcementAction.TERMINATE,
            "Test termination"
        )
        
        # Monitor mode should return False (no action taken)
        assert result is False
    
    def test_default_policies(self):
        """Test default policy configuration"""
        controller = EnforcementController()
        
        # Check policies are properly configured
        assert any(p.action == EnforcementAction.TERMINATE for p in controller.policies)
        assert any(p.action == EnforcementAction.QUARANTINE for p in controller.policies)
        assert all(hasattr(p, 'trigger_risk_score') for p in controller.policies)


class TestPermissionProfile:
    """Test permission baseline mapping"""
    
    def test_profile_creation(self):
        """Test permission profile creation"""
        profile = PermissionProfile("zoom.exe")
        assert profile is not None
        assert "camera" in profile.declared_permissions
        assert "microphone" in profile.declared_permissions
    
    def test_permission_violation_detection(self):
        """Test permission violation detection"""
        profile = PermissionProfile("notepad.exe")
        
        # File read should be allowed
        assert not profile.check_permission_violation("filesystem_read")
        
        # Camera should be violation
        assert profile.check_permission_violation("camera")
    
    def test_permission_access_logging(self):
        """Test permission access logging"""
        profile = PermissionProfile("chrome.exe")
        
        profile.log_access("network")
        profile.log_access("network")
        profile.log_access("filesystem")
        
        assert profile.access_history["network"] == 2
        assert profile.access_history["filesystem"] == 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
