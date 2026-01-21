"""
Structured logging setup for MaxSec Agent Core
Supports JSON logging with OpenTelemetry integration
"""

import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict
from pythonjsonlogger import jsonlogger


class MaxSecFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with trace ID and timestamps"""
    
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, 
                   message_dict: Dict[str, Any]) -> None:
        super().add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.utcnow().isoformat() + 'Z'
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        log_record['module'] = record.module


def setup_logging(log_level: str = "INFO", log_file: str = None) -> logging.Logger:
    """
    Configure structured logging for MaxSec Agent
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional file path for file logging
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger("maxsec-agent")
    logger.setLevel(log_level)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler with JSON formatter
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(MaxSecFormatter())
    logger.addHandler(console_handler)
    
    # File handler if specified
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(log_level)
        file_handler.setFormatter(MaxSecFormatter())
        logger.addHandler(file_handler)
    
    return logger
