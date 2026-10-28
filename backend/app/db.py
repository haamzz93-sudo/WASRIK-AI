"""
db.py - MySQL Database Connection & Helpers
WasrikAgent AI - BPJS Kesehatan Healthkathon 2026
"""

import os
import pymysql
from pymysql.cursors import DictCursor
from typing import List, Dict, Any, Optional

def get_db_connection():
    """
    Koneksi ke MySQL database.
    Mendukung konfigurasi dari .env atau default XAMPP/VPS.
    """
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    # Cek port: di XAMPP default 3307, di VPS standar 3306
    port = int(os.getenv("MYSQL_PORT", "3307"))
    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD", "")
    database = os.getenv("MYSQL_DATABASE", "wasrik_db")

    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            cursorclass=DictCursor,
            autocommit=True,
            charset="utf8mb4"
        )
        return conn
    except Exception as e:
        # Coba fallback ke port 3306 jika port 3307 gagal
        if port != 3306:
            try:
                conn = pymysql.connect(
                    host=host,
                    port=3306,
                    user=user,
                    password=password,
                    database=database,
                    cursorclass=DictCursor,
                    autocommit=True,
                    charset="utf8mb4"
                )
                return conn
            except Exception:
                pass
        raise RuntimeError(f"Gagal terhubung ke MySQL database (host: {host}:{port}, db: {database}): {e}")

def fetch_all(query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()
    finally:
        conn.close()

def fetch_one(query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchone()
    finally:
        conn.close()

def execute_query(query: str, params: Optional[tuple] = None) -> int:
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            affected = cursor.execute(query, params or ())
            return affected
    finally:
        conn.close()
