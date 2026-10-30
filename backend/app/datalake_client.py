"""
datalake_client.py - WasrikAgent Data Lake Interoperability Client
Menghubungkan Backend Wasrik AI ke 6 Layanan Data Eksternal (DS-001 s/d DS-006)
"""

import httpx
import os
from typing import Dict, Any, Optional, List

DATALAKE_BASE_URL = os.getenv("DATALAKE_BASE_URL", "http://127.0.0.1")

class WasrikDataLakeClient:
    def __init__(self, base_url: str = DATALAKE_BASE_URL):
        self.base_url = base_url
        self.headers = {"Accept": "application/json"}
        self.timeout = 5.0

    def get_master_bu(self, nib_or_id: str) -> Optional[Dict[str, Any]]:
        """DS-001 (Port 9001): Tarik profil registrasi Badan Usaha JKN"""
        try:
            url = f"{self.base_url}:9001/api/v1/employers/{nib_or_id}?format=json"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data")
        except Exception:
            pass
        return None

    def get_sipp_wage(self, nib_or_id: str) -> Optional[Dict[str, Any]]:
        """DS-002 (Port 9002): Tarik upah terlaporkan SIPP BPJS Ketenagakerjaan"""
        try:
            url = f"{self.base_url}:9002/api/v1/wages/{nib_or_id}"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data")
        except Exception:
            pass
        return None

    def get_wlkp_real(self, nib_or_id: str) -> Optional[Dict[str, Any]]:
        """DS-003 (Port 9003): Tarik upah & tenaga kerja riil WLKP Kemnaker RI"""
        try:
            url = f"{self.base_url}:9003/api/v1/wlkp/reports/{nib_or_id}"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data")
        except Exception:
            pass
        return None

    def get_billing_status(self, nib_or_id: str) -> Optional[Dict[str, Any]]:
        """DS-004 (Port 9004): Tarik histori piutang & status iuran BPJS Kesehatan"""
        try:
            url = f"{self.base_url}:9004/api/v1/billing/{nib_or_id}"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data")
        except Exception:
            pass
        return None

    def get_medical_claims(self, company_id: str) -> List[Dict[str, Any]]:
        """DS-005 (Port 9005): Tarik klaim medis nyata BPJS Kesehatan Rilis 2024"""
        try:
            url = f"{self.base_url}:9005/api/v1/claims?company_id={company_id}"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data", [])
        except Exception:
            pass
        return []

    def get_sanctions_oss(self, nib_or_id: str) -> Optional[Dict[str, Any]]:
        """DS-006 (Port 9006): Tarik sanksi PP 86/2013 & status blokir OSS BKPM"""
        try:
            url = f"{self.base_url}:9006/api/v1/sanctions/{nib_or_id}"
            res = httpx.get(url, headers=self.headers, timeout=self.timeout)
            if res.status_code == 200:
                return res.json().get("data")
        except Exception:
            pass
        return None

datalake_client = WasrikDataLakeClient()
