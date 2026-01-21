"""
MaxSec Agent Core - Main Entry Point
Orchestrates process monitoring, analysis, and enforcement
"""

import asyncio
import argparse
import signal
import sys
import logging
from pathlib import Path

from logger import setup_logging
from process_monitor import ProcessMonitor

logger = None


class MaxSecAgent:
    """Main agent coordinator"""
    
    def __init__(self, mode: str = "monitor"):
        """
        Initialize MaxSec Agent
        
        Args:
            mode: Operation mode (monitor, enforce, lockdown)
        """
        global logger
        logger = setup_logging(log_level="INFO")
        
        self.mode = mode
        self.monitor = ProcessMonitor(
            enable_hash_computation=True,
            enable_network_tracking=True
        )
        self.running = False
        
        logger.info(f"MaxSec Agent initialized in {mode} mode")
    
    async def process_callback(self, processes):
        """Callback for process enumeration"""
        logger.info(f"Monitoring {len(processes)} processes")
        
        # Log summary
        if processes:
            high_resource = [p for p in processes if p.cpu_percent > 50 or p.mem_percent > 50]
            if high_resource:
                logger.warning(f"High resource usage: {len(high_resource)} processes")
    
    async def run(self):
        """Start agent monitoring loop"""
        self.running = True
        logger.info(f"Starting MaxSec Agent in {self.mode} mode")
        
        try:
            await self.monitor.monitor_continuous(
                callback=self.process_callback,
                interval=5.0
            )
        except KeyboardInterrupt:
            logger.info("Shutdown signal received")
        finally:
            await self.shutdown()
    
    async def shutdown(self):
        """Graceful shutdown"""
        self.running = False
        logger.info("MaxSec Agent shutting down")
        sys.exit(0)
    
    def handle_signal(self, sig, frame):
        """Handle system signals"""
        logger.info(f"Signal {sig} received, initiating shutdown")
        if self.running:
            asyncio.create_task(self.shutdown())


def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(
        description="MaxSec [Maximum Security] - Unauthorized Access Detection & Control"
    )
    
    parser.add_argument(
        "--mode",
        choices=["monitor", "enforce", "lockdown"],
        default="monitor",
        help="Operation mode (default: monitor)"
    )
    
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Logging level (default: INFO)"
    )
    
    parser.add_argument(
        "--log-file",
        type=str,
        default=None,
        help="Log file path (optional)"
    )
    
    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Configuration file path"
    )
    
    args = parser.parse_args()
    
    # Setup logging
    global logger
    logger = setup_logging(log_level=args.log_level, log_file=args.log_file)
    
    # Create and run agent
    agent = MaxSecAgent(mode=args.mode)
    
    # Setup signal handlers
    signal.signal(signal.SIGINT, agent.handle_signal)
    signal.signal(signal.SIGTERM, agent.handle_signal)
    
    # Run agent
    try:
        asyncio.run(agent.run())
    except KeyboardInterrupt:
        logger.info("Agent terminated by user")
    except Exception as e:
        logger.critical(f"Unhandled exception: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
