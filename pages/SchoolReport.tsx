import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const SchoolReport: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedBimester, setSelectedBimester] = useState<number | null>(null);

  // Mock Data
  const [reportCards, setReportCards] = useState([
      { bimester: 1, status: 'approved', grade: '8.5', file: 'boletim_1bim.pdf' },
      { bimester: 2, status: 'pending', grade: '-', file: null },
      { bimester: 3, status: 'locked', grade: '-', file: null },
      { bimester: 4, status: 'locked', grade: '-', file: null },
  ]);

  const handleUploadClick = (bimester: number) => {
      setSelectedBimester(bimester);
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && selectedBimester) {
          // Update state to simulate upload
          setReportCards(prev => prev.map(card => 
              card.bimester === selectedBimester 
              ? { ...card, status: 'review', file: file.name } 
              : card
          ));
          alert(`Boletim do ${selectedBimester}º Bimestre enviado para análise!`);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSelectedBimester(null);
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-20 animate-fade-in">
      <div className="mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-white transition-colors mb-4 group"
        >
            <span className="material-icons-round text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm">Voltar</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-round text-blue-500">school</span>
            Boletim Escolar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Mantenha suas notas em dia para garantir sua graduação na Capoeira.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10">
              <span className="material-icons-round text-9xl">auto_stories</span>
          </div>
          <div className="relative z-10">
              <h2 className="text-lg font-bold mb-1">Status Escolar</h2>
              <div className="flex items-end gap-2">
                  <span className="text-4xl font-black">Regular</span>
                  <span className="text-blue-200 text-sm mb-1.5">Sem pendências graves</span>
              </div>
              <p className="text-xs text-blue-100 mt-4 max-w-sm">
                  "O bom capoeirista também é bom na escola. Disciplina e estudo andam juntos."
              </p>
          </div>
      </div>

      <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
      />

      {/* Bimesters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reportCards.map((card) => (
              <div 
                key={card.bimester} 
                className={`relative p-5 rounded-xl border-2 transition-all ${
                    card.status === 'locked' 
                    ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker opacity-60' 
                    : 'border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark shadow-sm'
                }`}
              >
                  <div className="flex justify-between items-start mb-3">
                      <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{card.bimester}º Bimestre</span>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                              {card.status === 'approved' ? `Média: ${card.grade}` : 'Boletim'}
                          </h3>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          card.status === 'approved' ? 'bg-green-100 text-green-600' :
                          card.status === 'review' ? 'bg-yellow-100 text-yellow-600' :
                          card.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-200 text-gray-400'
                      }`}>
                          <span className="material-icons-round text-sm">
                              {card.status === 'approved' ? 'check' :
                               card.status === 'review' ? 'hourglass_empty' :
                               card.status === 'pending' ? 'upload_file' : 'lock'}
                          </span>
                      </div>
                  </div>

                  {card.status === 'approved' && (
                      <div className="mt-4">
                          <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Aprovado</span>
                          <button className="block mt-3 text-xs text-blue-500 hover:underline">Ver arquivo enviado</button>
                      </div>
                  )}

                  {card.status === 'review' && (
                      <div className="mt-4">
                          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">Em Análise</span>
                          <p className="text-xs text-gray-400 mt-2">Aguarde a validação do mestre.</p>
                      </div>
                  )}

                  {card.status === 'pending' && (
                      <button 
                        onClick={() => handleUploadClick(card.bimester)}
                        className="w-full mt-2 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
                      >
                          <span className="material-icons-round text-sm">cloud_upload</span>
                          Enviar Foto/PDF
                      </button>
                  )}

                  {card.status === 'locked' && (
                      <div className="mt-4">
                          <p className="text-xs text-gray-400">Ainda não disponível.</p>
                      </div>
                  )}
              </div>
          ))}
      </div>
    </div>
  );
};