$env:OLLAMA_INSTALL_DIR = "D:\Ollama"
$env:OLLAMA_MODELS = "D:\Ollama\models"
[System.Environment]::SetEnvironmentVariable('OLLAMA_MODELS', 'D:\Ollama\models', 'User')
[System.Environment]::SetEnvironmentVariable('OLLAMA_INSTALL_DIR', 'D:\Ollama', 'User')

Write-Host ">>> Starting Ollama Installation to D:\Ollama..."
& "D:\projek warasik\install_ollama.ps1"
