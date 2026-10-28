"""
synthetic_generator.py - Synthetic Data Generator for Healthkathon 2026
Standard Kepatuhan: UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (PDP)
"""

import hashlib
import random
from typing import List, Dict, Any

INDONESIAN_NAMES = [
    "Budi Santoso", "Siti Aminah", "Darmawan Lahru", "Agus Prasetyo", "Dewi Lestari",
    "Rendra Pratama", "Nurul Hidayah", "Hendra Wijaya", "Mega Puspita", "Bambang Triyono",
    "Fitri Handayani", "Ahmad Fauzi", "Rini Wulandari", "Eko Supriyanto", "Ratna Sari",
    "Doni Kurniawan", "Winda Astuti", "Bayu Saputra", "Endah Sulistyo", "Faisal Basri"
]

JOB_POSITIONS = [
    "Operator Produksi", "Staff Administrasi", "Teknisi Mesin", "Quality Control",
    "Supervisor Lapangan", "Staff Accounting", "Warehouse Officer", "Security Officer"
]

def mask_name(name: str) -> str:
    parts = name.split()
    if len(parts) == 1:
        return parts[0][0] + "***"
    return f"{parts[0][0]}*** {parts[-1][0]}******"

def hash_nik(nik_raw: str, salt: str = "wasrik_pdp_salt_2026") -> str:
    combined = f"{salt}:{nik_raw}:{salt}"
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()

def generate_synthetic_payroll(
    num_records: int = 100,
    under_reporting_rate: float = 0.40,
    pduk_rate: float = 0.15
) -> List[Dict[str, Any]]:
    records = []
    
    for i in range(num_records):
        # Generate dummy 16 digit NIK
        nik_raw = f"3216{random.randint(100000000000, 999999999999)}"
        nik_hash = hash_nik(nik_raw)
        
        name = random.choice(INDONESIAN_NAMES)
        masked = mask_name(name)
        position = random.choice(JOB_POSITIONS)
        
        # Real salary distribution (take home pay riil)
        actual_salary = random.choice([5200000, 6500000, 7800000, 8900000, 11500000, 14000000])
        allowances = random.choice([500000, 800000, 1200000, 1800000])
        total_real = actual_salary + allowances
        
        is_pduk = random.random() < pduk_rate
        is_under_reported = (not is_pduk) and (random.random() < under_reporting_rate)
        
        if is_pduk:
            # Tidak didaftarkan sama sekali ke BPJS
            reported_salary = 0.0
            status_jkn = "UNREGISTERED_PDUK"
            gap = total_real
            monthly_leakage = total_real * 0.04
        elif is_under_reported:
            # Dilaporkan hanya setara UMR rendah
            reported_salary = 3800000.0
            status_jkn = "UNDER_REPORTED"
            gap = total_real - reported_salary
            monthly_leakage = gap * 0.04
        else:
            # Patuh 100%
            reported_salary = float(total_real)
            status_jkn = "COMPLIANT"
            gap = 0.0
            monthly_leakage = 0.0
            
        records.append({
            "record_id": f"rec_{i+1:04d}",
            "nik_hash": nik_hash,
            "employee_name_masked": masked,
            "job_position": position,
            "actual_base_salary": actual_salary,
            "actual_allowances": allowances,
            "total_actual_wage": total_real,
            "reported_bpjs_salary": reported_salary,
            "under_reported_gap": gap,
            "monthly_leakage_rp": round(monthly_leakage, 2),
            "status_jkn": status_jkn
        })
        
    return records
