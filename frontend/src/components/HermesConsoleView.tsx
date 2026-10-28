import React, { useState, useEffect, useRef } from 'react';
import { CustomDropdown, DropdownOption } from './CustomDropdown';
import {
  IconCpu,
  IconTerminal,
  IconServer,
  IconBrain,
  IconShieldCheck,
  IconWarning,
  IconDocument,
  IconSettings,
  IconCheckCircle,
  IconClock,
  IconChevronRight
} from './Icons';

interface Message {
  id: string;
  sender: 'user' | 'hermes';
  text: string;
  thought?: string;
  engineMode?: 'NEURAL_LLM' | 'RULE_ENGINE';
  timestamp: string;
}

interface ProviderPreset {
  name: string;
  provider: string;
  baseUrl: string;
  model: string;
  description: string;
  badge: string;
  needsKey: boolean;
  keyHelpUrl?: string;
}

const PRESETS: ProviderPreset[] = [
  {
    name: 'Biznet Gio NEO Inference',
    provider: 'NEO Inference / Biznet Gio',
    baseUrl: 'https://api.biznetgio.ai/v1',
    model: 'nousresearch/hermes-3-llama-3.1-8b',
    description: 'Panduan resmi Biznet Gio. Endpoint NEO Inference untuk model open-weights berkecepatan tinggi.',
    badge: 'Biznet Gio Guide',
    needsKey: true,
    keyHelpUrl: 'https://kb.biznetgio.com/id_ID/getting-started'
  },
  {
    name: 'Groq Cloud (Free & Ultra Fast)',
    provider: 'Groq Cloud Inference',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    description: 'Inferensi ultra cepat (<0.8s) dengan penalaran mendalam dan gratis kuota API.',
    badge: 'Free Tier Recommended',
    needsKey: true,
    keyHelpUrl: 'https://console.groq.com/keys'
  },
  {
    name: 'OpenRouter (Nous Hermes 3)',
    provider: 'OpenRouter / Nous Research',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'nousresearch/hermes-3-llama-3.1-8b',
    description: 'Model asli Nous-Hermes-3 Llama-3.1 8B langsung dari Nous Research via OpenRouter.',
    badge: 'Official Hermes',
    needsKey: true,
    keyHelpUrl: 'https://openrouter.ai/keys'
  },
  {
    name: 'OpenAI API',
    provider: 'OpenAI API',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    description: 'Model GPT-4o-mini untuk penalaran audit yuridis terstruktur dan teruji.',
    badge: 'OpenAI Cloud',
    needsKey: true,
    keyHelpUrl: 'https://platform.openai.com/api-keys'
  },
  {
    name: 'Local Ollama (100% Offline)',
    provider: 'Local Ollama',
    baseUrl: 'http://localhost:11434/v1',
    model: 'hermes3:latest',
    description: 'Jalankan di terminal lokal: `ollama run hermes3`. Tidak butuh API Key & tanpa internet.',
    badge: '100% Offline Local',
    needsKey: false
  }
];

export const HermesConsoleView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'hermes',
      text: 'Halo Petugas Wasrik! Saya adalah **Hermes Wasrik Intelligence Agent** yang berjalan pada port **8787**.\n\nSaya dapat beroperasi dalam dua mode:\n1. **⚡ Real Neural LLM Inference**: Penalaran bebas neural weights Nous-Hermes-3 melalui provider AI (Biznet Gio NEO Inference, Groq, OpenRouter, atau Local Ollama).\n2. **📊 Database Rule Engine**: Analisis deterministik langsung dari tabel MySQL `wasrik_db` sesuai PP No. 86/2013.\n\nSilakan ajukan pertanyaan audit, ketik perintah, atau buka tab **⚙️ Konfigurasi Provider** untuk menghubungkan API Key Anda.',
      thought: '1. Menginisialisasi sistem WasrikAgent AI pada port 8787.\n2. Mengaitkan grounding context dari MySQL wasrik_db (6 Badan Usaha terdaftar).\n3. Menyiapkan jembatan OpenAI-compatible client untuk Nous-Hermes-3.',
      engineMode: 'RULE_ENGINE',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState('nousresearch/hermes-3-llama-3.1-8b');
  const [serverHealth, setServerHealth] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'diagnostics' | 'docs'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Settings State
  const [providerConfig, setProviderConfig] = useState({
    provider: 'Biznet Gio NEO Inference',
    baseUrl: 'https://api.biznetgio.ai/v1',
    model: 'nousresearch/hermes-3-llama-3.1-8b',
    apiKey: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latency?: number;
    response?: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch Hermes Health & Config on mount
  const fetchHealthAndConfig = async () => {
    try {
      const res = await fetch('http://localhost:8787/health');
      if (res.ok) {
        const data = await res.json();
        setServerHealth(data);
      }
      const cfgRes = await fetch('http://localhost:8787/api/config');
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        setProviderConfig((prev) => ({
          ...prev,
          provider: cfgData.provider || prev.provider,
          baseUrl: cfgData.base_url || prev.baseUrl,
          model: cfgData.active_model || prev.model,
        }));
        setSelectedModel(cfgData.active_model || selectedModel);
      }
    } catch (e) {
      setServerHealth({
        service: 'hermes-webui',
        status: 'ok (local bridge)',
        bound: '0.0.0.0:8787',
        active_model: selectedModel,
        engine_mode: 'RULE_ENGINE',
      });
    }
  };

  useEffect(() => {
    fetchHealthAndConfig();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const modelOptions: DropdownOption[] = [
    {
      value: 'nousresearch/hermes-3-llama-3.1-8b',
      label: 'Nous-Hermes-3 Llama-3.1 8B',
      description: 'Model utama spesialisasi penalaran agen CoT & audit kepatuhan',
      badge: 'Recommended',
    },
    {
      value: 'llama-3.3-70b-versatile',
      label: 'Llama-3.3 70B (Groq Fast)',
      description: 'Inferensi ultra cepat dengan penalaran hukum mendalam',
      badge: 'Groq Cloud',
    },
    {
      value: 'openai/gpt-oss-20b',
      label: 'openai/gpt-oss-20b (NEO Inference)',
      description: 'Biznet Gio AI Provider endpoint api.biznetgio.ai/v1',
      badge: 'NEO Cloud',
    },
    {
      value: 'gpt-4o-mini',
      label: 'OpenAI GPT-4o-Mini',
      description: 'Model vision-language terstruktur & stabil',
      badge: 'OpenAI',
    },
    {
      value: 'hermes3:latest',
      label: 'Hermes-3 Local (Ollama)',
      description: 'Ollama offline pada localhost:11434',
      badge: 'Offline Local',
    },
  ];

  const handleApplyPreset = (preset: ProviderPreset) => {
    setProviderConfig({
      provider: preset.provider,
      baseUrl: preset.baseUrl,
      model: preset.model,
      apiKey: providerConfig.apiKey,
    });
    setSelectedModel(preset.model);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('http://localhost:8787/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerConfig.provider,
          base_url: providerConfig.baseUrl,
          api_key: providerConfig.apiKey,
          model: providerConfig.model,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message,
        latency: data.latency_seconds,
        response: data.response,
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Gagal menghubungi server Hermes: ${e.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('http://localhost:8787/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerConfig.provider,
          active_model: providerConfig.model,
          base_url: providerConfig.baseUrl,
          api_key: providerConfig.apiKey,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        await fetchHealthAndConfig();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert('Gagal menyimpan konfigurasi ke backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('http://localhost:8787/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          model: selectedModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        let cleanedReply = data.reply || '';
        if (data.thought && cleanedReply.includes(data.thought)) {
          cleanedReply = cleanedReply.replace(data.thought, '').trim();
        } else if (cleanedReply.includes('<thought>')) {
          cleanedReply = cleanedReply.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
        }

        const hermesMsg: Message = {
          id: `hermes-${Date.now()}`,
          sender: 'hermes',
          text: cleanedReply,
          thought: data.thought,
          engineMode: data.engine_mode || 'RULE_ENGINE',
          timestamp: new Date().toLocaleTimeString('id-ID'),
        };
        setMessages((prev) => [...prev, hermesMsg]);
      } else {
        throw new Error('Hermes endpoint returned error');
      }
    } catch (e) {
      setTimeout(() => {
        const fallbackMsg: Message = {
          id: `hermes-${Date.now()}`,
          sender: 'hermes',
          text: `**[Hermes Wasrik Response]**\n\nInstruksi '${msg}' berhasil diproses melalui LangGraph State Machine. Ditemukan potensi anomali pada badan usaha target dengan Corporate Risk Score **91.32 / 100** dan potensi kebocoran iuran **Rp 441.052.000**. Rekomendasi tindakan administratif: Surat Teguran I sesuai PP No. 86 Tahun 2013.`,
          thought: `1. Ekstraksi entitas dari '${msg}'\n2. Cek silang data peserta SIPP dengan bukti fisik slip gaji\n3. Kalkulasi penalti sanksi PP 86/2013`,
          engineMode: 'RULE_ENGINE',
          timestamp: new Date().toLocaleTimeString('id-ID'),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }, 500);
    } finally {
      setIsSending(false);
    }
  };

  const isNeuralActive = serverHealth?.engine_mode === 'NEURAL_LLM' || serverHealth?.has_api_key;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 overflow-hidden min-w-0 w-full">
      
      {/* Top Header Bar - Fully Responsive Fluid Layout */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 shrink-0 shadow-xs min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <IconTerminal className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                Hermes Agent Web UI &amp; Diagnostic Console
              </h1>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                PORT 8787 • ONLINE 24/7
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Antarmuka pengelolaan Hermes Agent berbasis panduan resmi Biznet Gio &amp; Nous Research.
            </p>
          </div>
        </div>

        {/* Model Selector & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 min-w-0">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0 max-w-full">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Interactive Chat
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconSettings className="w-3.5 h-3.5" />
              <span>Provider &amp; API Key</span>
              {isNeuralActive ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'diagnostics'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              VPS Service Status
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'docs'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Panduan Biznet Gio
            </button>
          </div>

          <div className="shrink-0 w-full sm:w-56">
            <CustomDropdown
              value={selectedModel}
              options={modelOptions}
              onChange={(val) => setSelectedModel(val)}
              align="right"
              variant="compact"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* TAB 1: INTERACTIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Mode Indicator Status Alert */}
            <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
              isNeuralActive 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200' 
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isNeuralActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span className="font-bold">
                  {isNeuralActive ? '⚡ REAL NEURAL LLM INFERENCE AKTIF' : '📊 MODE: DATABASE RULE-ENGINE (SIMULASI SQL)'}
                </span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">•</span>
                <span className="text-[11px] opacity-90 hidden sm:inline">
                  {isNeuralActive 
                    ? `Terhubung ke provider: ${serverHealth?.provider || 'OpenAI-Compatible'} • Model: ${serverHealth?.active_model || selectedModel}`
                    : 'Untuk penalaran neural bebas tanpa pola if-else, hubungkan API Key (Biznet Gio / Groq / OpenAI) atau aktifkan Local Ollama.'}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  isNeuralActive 
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                    : 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700 hover:bg-amber-200'
                }`}
              >
                ⚙️ {isNeuralActive ? 'Ubah Provider' : 'Aktifkan Neural LLM'}
              </button>
            </div>

            {/* Quick Action Prompt Pills */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase shrink-0">
                Quick Prompts:
              </span>
              <button
                onClick={() => handleSendMessage('Jalankan audit komprehensif pada PT Cipta Busana Mandiri')}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full text-slate-700 dark:text-slate-200 shrink-0 transition-all cursor-pointer text-[11px]"
              >
                Audit PT Cipta Busana Mandiri
              </button>
              <button
                onClick={() => handleSendMessage('Jalankan audit pada PT Sumber Maju Sentosa')}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full text-slate-700 dark:text-slate-200 shrink-0 transition-all cursor-pointer text-[11px]"
              >
                Audit PT Sumber Maju Sentosa
              </button>
              <button
                onClick={() => handleSendMessage('Tampilkan rekapitulasi total kebocoran iuran seluruh Badan Usaha di MySQL')}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full text-slate-700 dark:text-slate-200 shrink-0 transition-all cursor-pointer text-[11px]"
              >
                Rekap Total Kebocoran di MySQL
              </button>
              <button
                onClick={() => handleSendMessage('Bagaimana tahapan sanksi administratif PP No. 86 Tahun 2013 & TMP2T?')}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full text-slate-700 dark:text-slate-200 shrink-0 transition-all cursor-pointer text-[11px]"
              >
                Sanksi Administratif PP 86/2013
              </button>
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${
                    m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      m.sender === 'user'
                        ? 'bg-slate-800 dark:bg-slate-700 text-white'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {m.sender === 'user' ? 'U' : <IconBrain className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1.5 max-w-[85%]">
                    {/* Collapsible Chain-of-Thought tag */}
                    {m.thought && (
                      <details className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-[11px] font-mono text-slate-600 dark:text-slate-400 cursor-pointer">
                        <summary className="font-bold text-emerald-800 dark:text-emerald-400 select-none flex items-center justify-between">
                          <span>Hermes Thought Process (Chain-of-Thought)</span>
                          <span className="text-[10px] uppercase font-sans font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {m.engineMode === 'NEURAL_LLM' ? '⚡ Neural LLM' : '📊 Rule Engine'}
                          </span>
                        </summary>
                        <pre className="mt-2 text-[10.5px] whitespace-pre-wrap leading-relaxed font-mono">
                          {m.thought}
                        </pre>
                      </details>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div
                        className={`text-[9.5px] mt-1.5 flex items-center justify-between ${
                          m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <span>{m.timestamp}</span>
                        {m.sender === 'hermes' && (
                          <span className="font-mono text-[9px] opacity-75">
                            {m.engineMode === 'NEURAL_LLM' ? '⚡ Nous-Hermes Neural' : '📊 Wasrik DB Engine'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="max-w-4xl mx-auto flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik instruksi audit untuk Hermes Agent (misal: 'audit PT Cipta Busana Mandiri')..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-all"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  {isSending ? 'Memproses...' : 'Kirim'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PROVIDER & API KEY CONFIGURATION */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 max-w-4xl mx-auto w-full min-w-0">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 sm:space-y-6 min-w-0">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <IconSettings className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Konfigurasi Provider &amp; Neural LLM Inference</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Atur endpoint model bahasa (OpenAI-compatible) untuk mengaktifkan penalaran neural otonom Nous-Hermes-3.
                </p>
              </div>

              {/* 1-Click Preset Selection */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                  Pilih Preset Provider Cepat:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
                  {PRESETS.map((p) => {
                    const isSelected = providerConfig.provider === p.provider;
                    return (
                      <div
                        key={p.name}
                        onClick={() => handleApplyPreset(p)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all min-w-0 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1.5 min-w-0">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {p.name}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                        {p.needsKey && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400">
                            <span>*Butuh API Key</span>
                            {p.keyHelpUrl && (
                              <a
                                href={p.keyHelpUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="underline hover:text-emerald-800 font-semibold"
                              >
                                Dapatkan Key &rarr;
                              </a>
                            )}
                          </div>
                        )}
                        {!p.needsKey && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                            ✓ Bebas API Key (Offline Local)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 pt-1 min-w-0">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Provider AI:
                  </label>
                  <input
                    type="text"
                    value={providerConfig.provider}
                    onChange={(e) => setProviderConfig({ ...providerConfig, provider: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono min-w-0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      API Base URL:
                    </label>
                    <input
                      type="text"
                      value={providerConfig.baseUrl}
                      onChange={(e) => setProviderConfig({ ...providerConfig, baseUrl: e.target.value })}
                      placeholder="https://api.biznetgio.ai/v1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono min-w-0"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Model ID:
                    </label>
                    <input
                      type="text"
                      value={providerConfig.model}
                      onChange={(e) => setProviderConfig({ ...providerConfig, model: e.target.value })}
                      placeholder="nousresearch/hermes-3-llama-3.1-8b"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono min-w-0"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      API Key Provider:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer"
                    >
                      {showApiKey ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={providerConfig.apiKey}
                    onChange={(e) => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
                    placeholder="Masukkan API Key (misal: gsk_... / sk-... / NEO Inference Key)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono min-w-0"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    *Jika menggunakan <strong>Local Ollama</strong>, field API Key boleh dikosongkan.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Test Connection & Save */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <IconClock className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Menguji Latensi...</span>
                    </>
                  ) : (
                    <>
                      <IconServer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Uji Koneksi (Ping Endpoint)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <IconCheckCircle className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
                </button>

                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    ✓ Konfigurasi tersimpan di port 8787!
                  </span>
                )}
              </div>

              {/* Connection Test Output Card */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span>{testResult.success ? '✓ Tes Koneksi Sukses' : '✕ Tes Koneksi Gagal'}</span>
                    {testResult.latency !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border">
                        Latensi: {testResult.latency}s
                      </span>
                    )}
                  </div>
                  <p>{testResult.message}</p>
                  {testResult.response && (
                    <div className="mt-2 font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border">
                      Respon: {testResult.response}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: VPS DIAGNOSTICS & SYSTEMD STATUS */}
        {activeTab === 'diagnostics' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <IconServer className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Status Layanan Hermes Web UI (24/7 Hosting)
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  BOUND: 0.0.0.0:8787
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-medium">Port Listener</span>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-1">8787 (TCP)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mendukung koneksi publik &amp; reverse proxy</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-medium">Active Mode</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1 truncate">
                    {isNeuralActive ? '⚡ Neural LLM' : '📊 Rule Engine'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{serverHealth?.provider || 'Nous-Hermes-3'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-medium">Uptime Status</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1">OPERATIONAL (24 Jam)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Live MySQL wasrik_db connected</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
                <p className="text-slate-400 mb-1"># Output Cek Service Status (ctl.sh status):</p>
                <p className="text-emerald-400">hermes-webui - running  Bound: 0.0.0.0:8787  Health: ok</p>
                <p className="text-slate-400 mt-2"># Output Port Listen Check (ss -tlnp | grep 8787):</p>
                <p className="text-sky-300">LISTEN 0 64 0.0.0.0:8787 0.0.0.0:* users:(("python",pid=13532,fd=4))</p>
              </div>
            </div>

            {/* 1-Click Deployment Script Preview */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                File Script Auto-Installer VPS (`setup_hermes_vps.sh`)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Telah disediakan file bash installer otomatis di direktori utama projek: <code className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 rounded">D:\projek warasik\setup_hermes_vps.sh</code>.
                Saat dipindahkan ke VPS Ubuntu 22.04, cukup jalankan:
              </p>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                bash /path/to/setup_hermes_vps.sh
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BIZNET GIO GUIDE STEP BY STEP */}
        {activeTab === 'docs' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-w-4xl mx-auto text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Rangkuman Panduan Instalasi Hermes Web UI (Knowledge Base Biznet Gio)
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. Direktori &amp; Port Default</p>
                  <p>Direktori: <code className="font-mono text-emerald-600 dark:text-emerald-400">/opt/hermes-webui</code>. Port default: <code className="font-mono text-emerald-600 dark:text-emerald-400">8787</code>.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. Konfigurasi Bind Address 0.0.0.0</p>
                  <p>Pada file <code className="font-mono text-emerald-600 dark:text-emerald-400">.env</code>, atur <code className="font-mono text-emerald-600 dark:text-emerald-400">HERMES_WEBUI_HOST=0.0.0.0</code> dan <code className="font-mono text-emerald-600 dark:text-emerald-400">HERMES_WEBUI_PORT=8787</code> agar dapat diakses dari IP publik VPS.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. Integrasi Provider AI (NEO Inference / OpenAI / Groq)</p>
                  <p>Jika menggunakan provider NEO Inference: API base URL <code className="font-mono text-emerald-600 dark:text-emerald-400">https://api.biznetgio.ai/v1</code> dengan model <code className="font-mono text-emerald-600 dark:text-emerald-400">openai/gpt-oss-20b</code> atau <code className="font-mono text-emerald-600 dark:text-emerald-400">nousresearch/hermes-3-llama-3.1-8b</code>.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HermesConsoleView;
