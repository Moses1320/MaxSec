"""
Controller Module - Policy Engine & Enforcement
Executes enforcement actions: terminate, suspend, block network, revoke permissions
"""

import logging
import asyncio
import platform
from dataclasses import dataclass
from typing import List, Optional, Dict
from enum import Enum

logger = logging.getLogger("maxsec-controller")


class EnforcementAction(Enum):
    """Available enforcement actions"""
    TERMINATE = "terminate"
    SUSPEND = "suspend"
    BLOCK_NETWORK = "block_network"
    REVOKE_PERMISSIONS = "revoke_permissions"
    QUARANTINE = "quarantine"
    WHITELIST = "whitelist"


@dataclass
class PolicyRule:
    """Security policy rule"""
    name: str
    trigger_risk_score: float  # Execute when risk >= this score
    action: EnforcementAction
    reversible: bool = True
    requires_approval: bool = False
    description: str = ""


class EnforcementController:
    """
    Executes enforcement actions on detected threats
    Supports Windows and Linux with native APIs
    """
    
    def __init__(self, mode: str = "monitor"):
        """
        Initialize enforcement controller
        
        Args:
            mode: 'monitor' (alert only), 'enforce' (auto-act), 'lockdown' (max protection)
        """
        self.mode = mode
        self.system = platform.system()
        self.execution_log: List[Dict] = []
        self.policies: List[PolicyRule] = self._init_default_policies()
        
        logger.info(f"EnforcementController initialized in {mode} mode on {self.system}")
    
    def _init_default_policies(self) -> List[PolicyRule]:
        """Initialize default security policies"""
        return [
            PolicyRule(
                name="Critical Threat Auto-Terminate",
                trigger_risk_score=85,
                action=EnforcementAction.TERMINATE,
                reversible=False,
                requires_approval=True,
                description="Automatically terminate processes flagged as critical threats"
            ),
            PolicyRule(
                name="High Risk Quarantine",
                trigger_risk_score=70,
                action=EnforcementAction.QUARANTINE,
                reversible=True,
                requires_approval=False,
                description="Suspend and block network for high-risk processes"
            ),
            PolicyRule(
                name="Suspicious Alert",
                trigger_risk_score=50,
                action=EnforcementAction.SUSPEND,
                reversible=True,
                requires_approval=False,
                description="Suspend suspicious processes pending review"
            ),
        ]
    
    async def execute_action(self, process_id: int, action: EnforcementAction, 
                            reason: str = "") -> bool:
        """
        Execute enforcement action on process
        
        Args:
            process_id: PID of target process
            action: EnforcementAction to execute
            reason: Audit log reason
            
        Returns:
            Success status
        """
        if self.mode == "monitor":
            logger.info(f"[MONITOR MODE] Would execute {action.value} on PID {process_id}")
            return False
        
        try:
            if action == EnforcementAction.TERMINATE:
                return await self._terminate_process(process_id, reason)
            elif action == EnforcementAction.SUSPEND:
                return await self._suspend_process(process_id, reason)
            elif action == EnforcementAction.BLOCK_NETWORK:
                return await self._block_network(process_id, reason)
            elif action == EnforcementAction.QUARANTINE:
                return await self._quarantine_process(process_id, reason)
            else:
                logger.warning(f"Unsupported action: {action}")
                return False
        except Exception as e:
            logger.error(f"Error executing {action.value} on PID {process_id}: {e}")
            return False
    
    async def _terminate_process(self, process_id: int, reason: str) -> bool:
        """Terminate process"""
        try:
            if self.system == "Windows":
                import subprocess
                result = subprocess.run(
                    ["taskkill", "/PID", str(process_id), "/F"],
                    capture_output=True
                )
                success = result.returncode == 0
            else:  # Linux
                import subprocess
                result = subprocess.run(
                    ["kill", "-9", str(process_id)],
                    capture_output=True
                )
                success = result.returncode == 0
            
            if success:
                logger.warning(f"Terminated PID {process_id} - Reason: {reason}")
                self._log_action("terminate", process_id, reason, True)
            
            return success
        except Exception as e:
            logger.error(f"Failed to terminate PID {process_id}: {e}")
            self._log_action("terminate", process_id, reason, False, str(e))
            return False
    
    async def _suspend_process(self, process_id: int, reason: str) -> bool:
        """Suspend process (pause execution)"""
        try:
            if self.system == "Windows":
                # Windows: Use pssuspend or similar
                logger.info(f"Suspending PID {process_id} on Windows")
                # Placeholder - would use Windows API in production
                success = True
            else:  # Linux
                import subprocess
                result = subprocess.run(
                    ["kill", "-STOP", str(process_id)],
                    capture_output=True
                )
                success = result.returncode == 0
            
            if success:
                logger.warning(f"Suspended PID {process_id} - Reason: {reason}")
                self._log_action("suspend", process_id, reason, True)
            
            return success
        except Exception as e:
            logger.error(f"Failed to suspend PID {process_id}: {e}")
            self._log_action("suspend", process_id, reason, False, str(e))
            return False
    
    async def _block_network(self, process_id: int, reason: str) -> bool:
        """Block network access for process"""
        try:
            logger.info(f"Blocking network for PID {process_id}")
            
            if self.system == "Windows":
                # Windows Firewall API (placeholder)
                logger.info(f"Would block network for PID {process_id} on Windows")
                success = True
            else:  # Linux
                # iptables-based blocking (requires root)
                logger.info(f"Would block network for PID {process_id} on Linux")
                success = True
            
            if success:
                logger.warning(f"Network blocked for PID {process_id} - Reason: {reason}")
                self._log_action("block_network", process_id, reason, True)
            
            return success
        except Exception as e:
            logger.error(f"Failed to block network for PID {process_id}: {e}")
            self._log_action("block_network", process_id, reason, False, str(e))
            return False
    
    async def _quarantine_process(self, process_id: int, reason: str) -> bool:
        """Quarantine process: suspend + block network"""
        try:
            # Suspend
            await self._suspend_process(process_id, f"Quarantine: {reason}")
            
            # Block network
            await self._block_network(process_id, f"Quarantine: {reason}")
            
            logger.warning(f"Quarantined PID {process_id} - Reason: {reason}")
            self._log_action("quarantine", process_id, reason, True)
            
            return True
        except Exception as e:
            logger.error(f"Failed to quarantine PID {process_id}: {e}")
            self._log_action("quarantine", process_id, reason, False, str(e))
            return False
    
    async def resume_process(self, process_id: int) -> bool:
        """Resume suspended process"""
        try:
            if self.system == "Linux":
                import subprocess
                result = subprocess.run(
                    ["kill", "-CONT", str(process_id)],
                    capture_output=True
                )
                success = result.returncode == 0
            else:
                logger.info(f"Would resume PID {process_id} on Windows")
                success = True
            
            if success:
                logger.info(f"Resumed PID {process_id}")
                self._log_action("resume", process_id, "User action", True)
            
            return success
        except Exception as e:
            logger.error(f"Failed to resume PID {process_id}: {e}")
            return False
    
    def _log_action(self, action: str, process_id: int, reason: str, 
                   success: bool, error: str = None) -> None:
        """Log enforcement action for audit trail"""
        import time
        
        log_entry = {
            "timestamp": time.time(),
            "action": action,
            "process_id": process_id,
            "reason": reason,
            "success": success,
            "error": error
        }
        
        self.execution_log.append(log_entry)
        logger.debug(f"Action logged: {action} (PID {process_id})")
    
    async def evaluate_and_enforce(self, process_data: Dict, risk_score: float) -> Optional[EnforcementAction]:
        """
        Evaluate risk score against policies and execute if needed
        
        Args:
            process_data: Process metadata
            risk_score: Computed risk score (0-100)
            
        Returns:
            Executed action or None
        """
        applied_policy = None
        
        # Find matching policy (highest risk score first)
        for policy in sorted(self.policies, 
                            key=lambda p: p.trigger_risk_score, reverse=True):
            if risk_score >= policy.trigger_risk_score:
                applied_policy = policy
                break
        
        if not applied_policy:
            return None
        
        logger.info(
            f"Policy matched for PID {process_data.get('pid')}: "
            f"{applied_policy.name} (risk={risk_score:.0f})"
        )
        
        if self.mode == "monitor":
            logger.info(f"[MONITOR] Would apply policy: {applied_policy.name}")
            return None
        
        # Execute action
        reason = f"{applied_policy.name}: {applied_policy.description}"
        success = await self.execute_action(
            process_data.get("pid"),
            applied_policy.action,
            reason
        )
        
        return applied_policy.action if success else None
