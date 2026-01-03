import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Training: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<any[]>([
      { id: 1, name: 'Treino de Ginga.mp4', date: '10/12/2023', status: 'Aprovado', feedback: 'Muito bom!' }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const newVideo = {
            id: Date.now(),
            name: file.name,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Em Análise',
            feedback: ''
        };
        setVideos([newVideo, ...videos]);
        alert(`Vídeo "${file.name}" selecionado para envio.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-20 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-white transition-colors mb-4 group"
        >
            <span className="material-icons-round text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm">Voltar</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-round text-orange-500">videocam</span>
            Treino em Casa
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Grave seus treinos e receba feedback do seu mestre.
        </p>
      </div>

      {/* Suggested Training Card */}
      <div className="bg-surface-light dark:bg-surface-dark border border-orange-500/30 rounded-xl p-5 mb-8 relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-2 -mt-2"></div>
          
          <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0">
                  <span className="material-icons-round text-2xl">fitness_center</span>
              </div>
              <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sugestão de Hoje</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Foco em movimentação básica e resistência.
                  </p>
                  <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 5 min de Ginga (Aquecimento)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 30x Meia-lua de Frente (cada perna)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 20x Cocorinha com Esquiva
                      </li>
                  </ul>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-wide flex items-center gap-1"
                  >
                      Gravar e Enviar <span className="material-icons-round text-sm">arrow_forward</span>
                  </button>
              </div>
          </div>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Enviar Vídeo</h2>
        </div>
        
        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="video/mp4,video/quicktime,video/x-m4v"
            onChange={handleFileSelect}
        />
        
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface-light dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
        >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-surface-darker flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-gray-400 group-hover:text-orange-500 text-3xl transition-colors">cloud_upload</span>
            </div>
            
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Toque para selecionar</span>
            <p className="text-xs text-gray-500 mt-1">
                MP4, MOV (Máx 50MB)
            </p>
        </div>
      </div>

      {/* List Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
            <span className="material-icons-round text-gray-400 text-sm">history</span>
            <h2 className="font-bold text-gray-900 dark:text-white text-md">Meus Envios</h2>
        </div>

        {videos.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <span className="material-icons-round text-4xl mb-2">videocam_off</span>
                <p className="text-sm italic">Nenhum vídeo enviado ainda.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {videos.map((video) => (
                    <div key={video.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-surface-darker flex items-center justify-center text-orange-500 shrink-0">
                                <span className="material-icons-round text-2xl">play_circle</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{video.name}</p>
                                <p className="text-xs text-gray-500">{video.date}</p>
                                {video.feedback && (
                                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                        <span className="material-icons-round text-[10px]">chat</span> {video.feedback}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                video.status === 'Aprovado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                            }`}>
                                {video.status}
                            </span>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-surface-darker rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                <span className="material-icons-round text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};