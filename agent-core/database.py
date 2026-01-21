"""
SQLite Database Schema & Operations
Stores process history, alerts, and audit logs
"""

import sqlite3
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional

logger = logging.getLogger("maxsec-db")


class MaxSecDatabase:
    """SQLite database for MaxSec"""
    
    def __init__(self, db_path: str = "./maxsec.db"):
        self.db_path = Path(db_path)
        self.connection = None
        self._init_db()
    
    def _init_db(self):
        """Initialize database and create tables"""
        try:
            self.connection = sqlite3.connect(str(self.db_path))
            self.connection.row_factory = sqlite3.Row
            cursor = self.connection.cursor()
            
            # Apps table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS apps (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    path TEXT NOT NULL UNIQUE,
                    hash_sha256 TEXT,
                    risk_score REAL DEFAULT 0.0,
                    trusted INTEGER DEFAULT 0,
                    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Activity log table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS activity_log (
                    id INTEGER PRIMARY KEY,
                    app_id INTEGER,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    resource TEXT,
                    action TEXT,
                    severity TEXT,
                    metadata TEXT,
                    FOREIGN KEY(app_id) REFERENCES apps(id)
                )
            """)
            
            # Alerts table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY,
                    app_id INTEGER,
                    process_id INTEGER,
                    message TEXT,
                    risk_score REAL,
                    user_action TEXT,
                    resolved INTEGER DEFAULT 0,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    resolved_at TIMESTAMP,
                    FOREIGN KEY(app_id) REFERENCES apps(id)
                )
            """)
            
            # Permissions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS permissions (
                    id INTEGER PRIMARY KEY,
                    app_id INTEGER,
                    permission_type TEXT,
                    granted INTEGER,
                    accessed INTEGER,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(app_id) REFERENCES apps(id)
                )
            """)
            
            # Enforcement log table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS enforcement_log (
                    id INTEGER PRIMARY KEY,
                    process_id INTEGER,
                    action TEXT,
                    reason TEXT,
                    success INTEGER,
                    error_message TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            self.connection.commit()
            logger.info(f"Database initialized at {self.db_path}")
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
    def insert_app(self, name: str, path: str, hash_sha256: str = None, 
                  risk_score: float = 0.0) -> int:
        """Insert or update app record"""
        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO apps (name, path, hash_sha256, risk_score, last_seen)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (name, path, hash_sha256, risk_score))
            self.connection.commit()
            return cursor.lastrowid
        except Exception as e:
            logger.error(f"Error inserting app: {e}")
            return None
    
    def insert_alert(self, process_id: int, message: str, risk_score: float, 
                    app_id: int = None) -> int:
        """Insert security alert"""
        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                INSERT INTO alerts (app_id, process_id, message, risk_score)
                VALUES (?, ?, ?, ?)
            """, (app_id, process_id, message, risk_score))
            self.connection.commit()
            return cursor.lastrowid
        except Exception as e:
            logger.error(f"Error inserting alert: {e}")
            return None
    
    def log_enforcement_action(self, process_id: int, action: str, reason: str,
                              success: bool, error_message: str = None) -> int:
        """Log enforcement action"""
        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                INSERT INTO enforcement_log (process_id, action, reason, success, error_message)
                VALUES (?, ?, ?, ?, ?)
            """, (process_id, action, reason, int(success), error_message))
            self.connection.commit()
            return cursor.lastrowid
        except Exception as e:
            logger.error(f"Error logging enforcement: {e}")
            return None
    
    def get_alerts(self, limit: int = 100, unresolved_only: bool = True) -> List[Dict]:
        """Retrieve recent alerts"""
        try:
            cursor = self.connection.cursor()
            query = "SELECT * FROM alerts"
            
            if unresolved_only:
                query += " WHERE resolved = 0"
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            
            cursor.execute(query, (limit,))
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Error fetching alerts: {e}")
            return []
    
    def get_app_by_hash(self, hash_sha256: str) -> Optional[Dict]:
        """Lookup app by SHA-256 hash"""
        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT * FROM apps WHERE hash_sha256 = ?", (hash_sha256,))
            row = cursor.fetchone()
            return dict(row) if row else None
        except Exception as e:
            logger.error(f"Error looking up app: {e}")
            return None
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
