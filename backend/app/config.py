import os
from typing import List

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "WasrikAgent AI - Corporate Compliance & JKN Risk"
        API_V1_STR: str = "/api/v1"
        ENVIRONMENT: str = "development"
        DEBUG: bool = True
        SECRET_KEY: str = "wasrik_super_secret_corporate_compliance_key_2026"
        SALT_PEPPER_PDP: str = "bpjs_healthkathon_salted_sha256_pepper_secure_salt"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
        BACKEND_CORS_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*"
        ]
        class Config:
            env_file = ".env"
            extra = "allow"
except ImportError:
    from pydantic import BaseModel
    class Settings(BaseModel):
        PROJECT_NAME: str = "WasrikAgent AI - Corporate Compliance & JKN Risk"
        API_V1_STR: str = "/api/v1"
        ENVIRONMENT: str = "development"
        DEBUG: bool = True
        SECRET_KEY: str = "wasrik_super_secret_corporate_compliance_key_2026"
        SALT_PEPPER_PDP: str = "bpjs_healthkathon_salted_sha256_pepper_secure_salt"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
        BACKEND_CORS_ORIGINS: List[str] = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*"
        ]

settings = Settings()
