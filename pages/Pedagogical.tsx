import React from 'react';

export const Pedagogical: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold">
                <span className="material-icons-round text-blue-400 text-3xl">school</span>
                Acompanhamento Pedagógico
            </h1>
            
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-500 flex items-center justify-center">
                            <span className="material-icons-round">group</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-lg">Anjo de Fogo</h2>
                                <span className="material-icons-round text-green-500 text-sm">chat_bubble</span>
                            </div>
                            <p className="text-xs text-gray-500">0 Alunos Ativos</p>
                        </div>
                    </div>
                    <span className="material-icons-round transform rotate-180">expand_less</span>
                </div>
                
                <div className="p-5 bg-surface-light dark:bg-surface-dark">
                    <div className="mb-6 bg-surface-light dark:bg-surface-darker rounded-md p-4 border-l-4 border-primary shadow-sm">
                        <h3 className="flex items-center gap-2 text-primary font-bold text-sm mb-2 uppercase">
                             <span className="material-icons-round text-base">menu_book</span> Conteúdo Sendo Ministrado
                        </h3>
                        <p className="text-sm italic text-gray-500">Conteúdo não definido</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
