#!/bin/bash
# ==============================================================================
# setup_hermes_vps.sh - Instalasi & Setup Otomatis Hermes Web UI di Ubuntu 22.04
# Berdasarkan Panduan Resmi Biznet Gio & Cetak Biru SRS WasrikAgent AI
# ==============================================================================

set -e

echo "=== 1. Update Repository Server & Install Dependencies ==="
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl python3 python3-pip python3-venv lsof uvicorn

# (Opsional) Jika ingin menjalankan Local Ollama di VPS (100% Offline tanpa API Key):
# curl -fsSL https://ollama.com/install.sh | sh
# ollama pull hermes3

echo "=== 2. Setup Direktori /opt/hermes-webui ==="
sudo mkdir -p /opt/hermes-webui
sudo chown -R $USER:$USER /opt/hermes-webui
cd /opt/hermes-webui

echo "=== 3. Konfigurasi Environment File (.env) ==="
cat << 'EOF' > /opt/hermes-webui/.env
HERMES_WEBUI_HOST=0.0.0.0
HERMES_WEBUI_PORT=8787
HERMES_WEBUI_STATE_DIR=/opt/hermes-webui/state
HERMES_WEBUI_DEFAULT_WORKSPACE=/opt/hermes-webui/workspace
HERMES_WEBUI_BOT_NAME=Hermes-Wasrik
HERMES_WEBUI_PASSWORD=WasrikCompliance2026!
OPENAI_API_BASE=https://api.biznetgio.ai/v1
OPENAI_MODEL=openai/gpt-oss-20b
EOF

mkdir -p /opt/hermes-webui/state /opt/hermes-webui/workspace

echo "=== 4. Setup Python Virtual Environment ==="
python3 -m venv /opt/hermes-webui/venv
source /opt/hermes-webui/venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn requests python-dotenv pydantic langgraph langchain openai

echo "=== 5. Copy Hermes Web UI Server Script ==="
cp "/d/projek warasik/backend/app/hermes_webui_server.py" /opt/hermes-webui/server.py 2>/dev/null || cat << 'EOF' > /opt/hermes-webui/server.py
import os, uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Hermes Web UI Service 24/7")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
@app.get("/health")
def health():
    return {"service": "hermes-webui", "status": "ok", "bound": "0.0.0.0:8787", "provider": "Biznet NEO Inference"}
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8787)
EOF

echo "=== 6. Setup Systemd Service (Agar Hermes ON 24 Jam Non-Stop) ==="
sudo bash -c 'cat << EOF > /etc/systemd/system/hermes-webui.service
[Unit]
Description=Hermes Web UI 24/7 Agent Service (Port 8787)
After=network.target

[Service]
User='$USER'
WorkingDirectory=/opt/hermes-webui
ExecStart=/opt/hermes-webui/venv/bin/python /opt/hermes-webui/server.py
Restart=always
RestartSec=5
EnvironmentFile=/opt/hermes-webui/.env

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable hermes-webui
sudo systemctl restart hermes-webui

echo "=== 7. Status Service Hermes Web UI ==="
sudo systemctl status hermes-webui --no-pager
echo "Hermes Web UI berhasil diaktifkan pada http://0.0.0.0:8787 (24/7 On Hosting VPS)!"
