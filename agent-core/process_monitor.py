"""
Cross-platform process monitoring module
Collects real-time process and resource activity data from Windows/Linux
"""

import asyncio
import hashlib
import logging
import platform
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any
from datetime import datetime
import psutil

logger = logging.getLogger("maxsec-agent.process-monitor")


@dataclass
class ProcessInfo:
    """Process metadata snapshot"""
    pid: int
    ppid: int  # Parent PID
    name: str
    executable: str
    hash_sha256: Optional[str] = None
    command_line: str = ""
    user_context: str = ""
    status: str = "running"
    create_time: Optional[float] = None
    mem_percent: float = 0.0
    cpu_percent: float = 0.0
    num_threads: int = 0
    connections: int = 0
    open_files: int = 0
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow().isoformat() + 'Z'
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return asdict(self)


class ProcessMonitor:
    """
    Cross-platform process enumeration and monitoring
    Supports Windows (WMI, ToolHelp32) and Linux (/proc, psutil)
    """
    
    def __init__(self, enable_hash_computation: bool = True, 
                 enable_network_tracking: bool = True):
        self.system = platform.system()
        self.enable_hash = enable_hash_computation
        self.enable_network = enable_network_tracking
        self.process_cache: Dict[int, ProcessInfo] = {}
        
        logger.info(f"ProcessMonitor initialized for {self.system}")
    
    async def enumerate_processes(self) -> List[ProcessInfo]:
        """
        Enumerate all running processes
        Returns list of ProcessInfo objects with metadata
        """
        processes = []
        
        try:
            for proc in psutil.process_iter(['pid', 'ppid', 'name', 'exe', 'cmdline']):
                try:
                    proc_info = await self._capture_process_info(proc)
                    if proc_info:
                        processes.append(proc_info)
                        self.process_cache[proc.pid] = proc_info
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    continue
        except Exception as e:
            logger.error(f"Error enumerating processes: {e}")
        
        logger.debug(f"Enumerated {len(processes)} processes")
        return processes
    
    async def _capture_process_info(self, proc: psutil.Process) -> Optional[ProcessInfo]:
        """Capture comprehensive metadata for a process"""
        try:
            with proc.oneshot():
                pid = proc.pid
                ppid = proc.ppid()
                name = proc.name()
                exe = proc.exe() if proc.exe() else ""
                
                # Compute SHA-256 hash if enabled
                hash_sha256 = None
                if self.enable_hash and exe:
                    hash_sha256 = await self._compute_file_hash(exe)
                
                # Get command line args
                cmdline = " ".join(proc.cmdline()) if proc.cmdline() else ""
                
                # Get user context
                try:
                    user_context = proc.username()
                except:
                    user_context = "unknown"
                
                # Get resource usage
                try:
                    mem_info = proc.memory_info()
                    mem_percent = proc.memory_percent()
                except:
                    mem_percent = 0.0
                
                try:
                    cpu_percent = proc.cpu_percent(interval=0.1)
                except:
                    cpu_percent = 0.0
                
                num_threads = proc.num_threads()
                
                # Network connections
                connections = 0
                if self.enable_network:
                    try:
                        connections = len(proc.net_connections())
                    except:
                        pass
                
                # Open files
                open_files = 0
                try:
                    open_files = len(proc.open_files())
                except:
                    pass
                
                # Process status
                status = proc.status()
                create_time = proc.create_time()
                
                return ProcessInfo(
                    pid=pid,
                    ppid=ppid,
                    name=name,
                    executable=exe,
                    hash_sha256=hash_sha256,
                    command_line=cmdline,
                    user_context=user_context,
                    status=status,
                    create_time=create_time,
                    mem_percent=mem_percent,
                    cpu_percent=cpu_percent,
                    num_threads=num_threads,
                    connections=connections,
                    open_files=open_files
                )
        except Exception as e:
            logger.debug(f"Error capturing process info for PID {proc.pid}: {e}")
            return None
    
    async def _compute_file_hash(self, file_path: str) -> Optional[str]:
        """
        Compute SHA-256 hash of executable file
        Uses async file I/O for non-blocking operation
        """
        try:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, self._hash_file, file_path)
        except Exception as e:
            logger.debug(f"Error computing hash for {file_path}: {e}")
            return None
    
    @staticmethod
    def _hash_file(file_path: str, chunk_size: int = 8192) -> str:
        """Compute SHA-256 hash of file"""
        sha256 = hashlib.sha256()
        try:
            with open(file_path, 'rb') as f:
                while chunk := f.read(chunk_size):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except:
            return None
    
    async def get_process_details(self, pid: int) -> Optional[ProcessInfo]:
        """Get detailed info for specific process by PID"""
        try:
            proc = psutil.Process(pid)
            return await self._capture_process_info(proc)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            logger.warning(f"Cannot access process {pid}")
            return None
    
    async def monitor_continuous(self, callback, interval: float = 5.0):
        """
        Continuously monitor processes and invoke callback
        
        Args:
            callback: Async function to call with process list
            interval: Polling interval in seconds
        """
        logger.info(f"Starting continuous monitoring with {interval}s interval")
        
        try:
            while True:
                processes = await self.enumerate_processes()
                await callback(processes)
                await asyncio.sleep(interval)
        except asyncio.CancelledError:
            logger.info("Process monitoring cancelled")
        except Exception as e:
            logger.error(f"Error in continuous monitoring: {e}")
