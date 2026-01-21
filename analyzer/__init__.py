"""
MaxSec Analyzer Module
Risk scoring, behavior detection, and threat alerting
"""

__version__ = "0.1.0-alpha"

from .risk_analyzer import BehaviorAnalyzer, RiskLevel, PermissionProfile

__all__ = ["BehaviorAnalyzer", "RiskLevel", "PermissionProfile"]
