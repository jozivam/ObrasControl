import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  QrCode,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Zap
} from 'lucide-react';

export const ScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    closeScanner,
    scannerCallback,
    filteredTags,
    darBaixaTag,
    registrarFotoInstalacao,
    comissionarTag,
    activeUser
  } = useApp();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedTagCode, setScannedTagCode] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Iniciar câmera quando o modal abrir
  useEffect(() => {
    if (!isScannerOpen) {
      // Parar stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setScannedTagCode(null);
      setActionSuccessMessage(null);
      setSearchTerm('');
      return;
    }

    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Navegador não suporta acesso direto à câmera.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
      } catch (err: any) {
        console.warn('Erro ao inicializar câmera:', err);
        setHasCameraPermission(false);
        setCameraError(err.message || 'Câmera indisponível ou permissão negada.');
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScannerOpen]);

  if (!isScannerOpen) return null;

  // TAG selecionada
  const selectedTag = filteredTags.find((t) => t.tag === (scannedTagCode || searchTerm.toUpperCase().trim()));

  // Sugestões rápidas de TAGs da obra
  const tagsSugeridas = filteredTags.filter((t) =>
    searchTerm.trim() ? t.tag.toLowerCase().includes(searchTerm.toLowerCase()) || t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) : true
  ).slice(0, 5);

  const handleSelectTag = (tagCode: string) => {
    setScannedTagCode(tagCode);
    setSearchTerm(tagCode);
    if (scannerCallback) {
      scannerCallback(tagCode);
    }
  };

  const handleExecutarBaixa = () => {
    if (!selectedTag) return;
    darBaixaTag(selectedTag.id, `Bipado via scanner por ${activeUser.nome}`);
    setActionSuccessMessage(`TAG ${selectedTag.tag} baixada para campo com sucesso!`);
    setTimeout(() => {
      setActionSuccessMessage(null);
      closeScanner();
    }, 1500);
  };

  const handleExecutarFoto = () => {
    if (!selectedTag) return;
    registrarFotoInstalacao(
      selectedTag.id,
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      'Plataforma de Montagem em Campo'
    );
    setActionSuccessMessage(`Foto de instalação da TAG ${selectedTag.tag} registrada!`);
    setTimeout(() => {
      setActionSuccessMessage(null);
      closeScanner();
    }, 1500);
  };

  const handleExecutarComissionamento = () => {
    if (!selectedTag) return;
    comissionarTag(selectedTag.id, `Comissionado via terminal móvel por ${activeUser.nome}`);
    setActionSuccessMessage(`TAG ${selectedTag.tag} comissionada com sucesso!`);
    setTimeout(() => {
      setActionSuccessMessage(null);
      closeScanner();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[95vh]">
        
        {/* Cabeçalho do Scanner */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Leitor de TAG & Código de Barras</h3>
              <p className="text-[11px] text-slate-400">Câmera HTML5 de campo + Bipagem rápida</p>
            </div>
          </div>
          <button
            onClick={closeScanner}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport da Câmera com Mira Visual Laser */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {hasCameraPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-400 space-y-2">
              <Camera className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs font-semibold text-slate-300">Câmera em modo de demonstração</p>
              <p className="text-[11px] text-slate-500">
                Selecione uma das TAGs da lista abaixo ou digite o código para simular a leitura do sensor.
              </p>
            </div>
          )}

          {/* Mira de Escaneamento Estilizada */}
          <div className="absolute inset-8 border-2 border-blue-500/70 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr" />
            </div>
            {/* Linha Laser Animada */}
            <div className="w-full h-0.5 bg-blue-400/90 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br" />
            </div>
          </div>

          <div className="absolute bottom-2 left-2 right-2 text-center">
            <span className="text-[10px] font-semibold bg-black/70 backdrop-blur-sm text-slate-300 px-2.5 py-1 rounded-full border border-white/10">
              Aponte para o QR Code ou etiqueta metálica do instrumento
            </span>
          </div>
        </div>

        {/* Área de Seleção e Busca Assistida */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          
          {/* Campo de Busca Rápida com Autocomplete */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite o código da TAG (ex: Z3M03M1, Z3P71_PT1)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setScannedTagCode(null);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
            />
          </div>

          {/* Atalhos Rápidos para Simular Leitura em 1 Clique */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Simular Leitura das TAGs Reais da Obra:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tagsSugeridas.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTag(t.tag)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition ${
                    selectedTag?.tag === t.tag
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {t.tag} ({t.status === 'NO_ESTOQUE' ? 'Estoque' : t.status === 'EM_MONTAGEM' ? 'Montagem' : 'Instalado'})
                </button>
              ))}
            </div>
          </div>

          {/* Feedback de Ação Concluída */}
          {actionSuccessMessage && (
            <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Cartão de TAG Reconhecida e Ações Imediatas */}
          {selectedTag && !actionSuccessMessage && (
            <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-blue-500/40 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-sm text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                    {selectedTag.tag}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{selectedTag.descricao}</h4>
                  <p className="text-[10px] text-slate-400">{selectedTag.subsistema}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTag.status === 'NO_ESTOQUE' ? 'bg-slate-700 text-slate-300' :
                    selectedTag.status === 'EM_MONTAGEM' ? 'bg-blue-900 text-blue-300' :
                    selectedTag.status === 'INSTALADO_CAMPO' ? 'bg-amber-900 text-amber-300' :
                    'bg-emerald-900 text-emerald-300'
                  }`}>
                    {selectedTag.status}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1">Custódia: {selectedTag.custodia}</p>
                </div>
              </div>

              {/* Ações Específicas baseadas no Status Atual */}
              <div className="pt-2 border-t border-slate-700 space-y-2">
                {selectedTag.status === 'NO_ESTOQUE' && (
                  <button
                    onClick={handleExecutarBaixa}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <span>Dar Baixa Física para Montagem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedTag.status === 'EM_MONTAGEM' && (
                  <button
                    onClick={handleExecutarFoto}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Registrar Foto da Instalação em Campo</span>
                  </button>
                )}

                {selectedTag.status === 'INSTALADO_CAMPO' && (
                  <button
                    onClick={handleExecutarComissionamento}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Comissionamento</span>
                  </button>
                )}

                {selectedTag.status === 'COMISSIONADO' && (
                  <div className="text-center py-2 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instrumento comissionado e validado!</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
