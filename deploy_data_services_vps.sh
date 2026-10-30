#!/bin/bash
# ==============================================================================
# deploy_data_services_vps.sh
# Menjalankan 6 Layanan Data Eksternal (DS-001 s/d DS-006) di VPS Ubuntu
# ==============================================================================

set -e

echo "=== 1. Menyiapkan Direktori /opt/data-wasrik ==="
if [ -d "/opt/data-wasrik" ]; then
    echo "Direktori /opt/data-wasrik sudah ada, melakukan git pull..."
    cd /opt/data-wasrik
    git pull origin main
else
    echo "Cloning repository DATA-WASRIK dari GitHub..."
    git clone https://github.com/haamzz93-sudo/DATA-WASRIK.git /opt/data-wasrik
    cd /opt/data-wasrik
fi

echo "=== 2. Setup Virtual Environment Python & Dependencies ==="
if [ ! -d "/opt/data-wasrik/venv" ]; then
    python3 -m venv /opt/data-wasrik/venv
fi

/opt/data-wasrik/venv/bin/pip install --upgrade pip
/opt/data-wasrik/venv/bin/pip install fastapi uvicorn pydantic requests

echo "=== 3. Membuat Systemd Service untuk Runner (run_all.py) ==="
cat << 'EOF' > /etc/systemd/system/wasrik-datalake.service
[Unit]
Description=WasrikAgent AI Data Lake External Services (DS-001 s/d DS-006)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/data-wasrik
ExecStart=/opt/data-wasrik/venv/bin/python /opt/data-wasrik/run_all.py serve
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo "=== 4. Reload Daemon & Start Service ==="
systemctl daemon-reload
systemctl enable wasrik-datalake
systemctl restart wasrik-datalake

sleep 3
systemctl status wasrik-datalake --no-pager

echo "=== 5. Verifikasi Port 9001 - 9006 ==="
for port in {9001..9006}; do
    curl -s -o /dev/null -w "Port $port: %{http_code}\n" http://127.0.0.1:$port/
done

echo "=== DEPLOYMENT DATA-WASRIK SELESAI & AKTIF DI VPS! ==="
