import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface WorkItem {
    id: number;
    title: string;
    date: string;
    description: string;
    status: 'pending' | 'completed';
    submissionFile?: string; // Nome do arquivo enviado
}

const INITIAL_WORKS: WorkItem[] = [
    {
        id: 1,
        title: "Pesquisa: Mestre Bimba",
        date: "2025-12-25",
        description: "Escrever sobre a importância de Mestre Bimba para a Capoeira Regional. Mínimo 1 página.",
        status: "pending"
    },
    {
        id: 2,
        title: "Desenho de Instrumento",
        date: "2025-12-10",
        description: "Desenhar um Berimbau e identificar suas partes (verga, cabaça, arame, etc).",
        status: "completed",
        submissionFile: "desenho_berimbau.jpg"
    }
];

export const Works: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Determine Role (Default to STUDENT if not passed)
    const userRole = location.state?.role || 'STUDENT';
    const isProfessorOrAdmin = userRole === 'PROFESSOR' || userRole === 'ADMIN';

    // Initial Mock Data
    const [works, setWorks] = useState<WorkItem[]>(INITIAL_WORKS);
    const [uploadingWorkId, setUploadingWorkId] = useState<number | null>(null);
    
    // Form State
    const [newWork, setNewWork] = useState({
        title: '',
        date: '',
        description: ''
    });

    const handleCreateWork = () => {
        if (!newWork.title || !newWork.date) {
            alert("Por favor, preencha pelo menos o título e a data.");
            return;
        }

        const work: WorkItem = {
            id: Date.now(),
            title: newWork.title,
            date: newWork.date,
            description: newWork.description,
            status: 'pending'
        };

        setWorks([work, ...works]);
        setNewWork({ title: '', date: '', description: '' }); // Reset form
    };

    // Admin/Professor manual toggle
    const toggleWorkStatus = (id: number) => {
        setWorks(works.map(w => 
            w.id === id 
            ? { ...w, status: w.status === 'pending' ? 'completed' : 'pending' } 
            : w
        ));
    };

    const deleteWork = (id: number) => {
        if(window.confirm("Excluir este trabalho?")) {
            setWorks(works.filter(w => w.id !== id));
        }
    };

    // Student Upload Logic
    const handleUploadClick = (workId: number) => {
        setUploadingWorkId(workId);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (file && uploadingWorkId) {
            // Update the specific work item
            setWorks(works.map(w => {
                if (w.id === uploadingWorkId) {
                    return { 
                        ...w, 
                        status: 'completed', 
                        submissionFile: file.name 
                    };
                }
                return w;
            }));
            
            alert(`Arquivo "${file.name}" enviado com sucesso! Trabalho marcado como concluído.`);
        }
        
        // Reset state
        setUploadingWorkId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const pendingWorks = works.filter(w => w.status === 'pending');
    const completedWorks = works.filter(w => w.status === 'completed');

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col space-y-4 mb-20 animate-fade-in">
            {/* Header */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-medium mb-3 group">
                    <span className="material-icons-round text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Voltar
                </button>
                <div className="flex items-center gap-3">
                    <span className="material-icons-round text-primary text-3xl">menu_book</span>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Trabalhos e Tarefas</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            {isProfessorOrAdmin ? 'Gerencie as atividades dos alunos.' : 'Envie seus trabalhos para avaliação.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden File Input for Students */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf,image/*"
                onChange={handleFileChange}
            />

            {/* Form Section - Only visible for Professor/Admin */}
            {isProfessorOrAdmin && (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                     <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                        <span className="material-icons-round text-primary">add_task</span>
                        Passar Novo Trabalho
                     </h2>
                     <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">Título do Trabalho</label>
                                <input 
                                    type="text" 
                                    value={newWork.title}
                                    onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                                    placeholder="Ex: Pesquisa sobre Mestre Bimba" 
                                    className="w-full bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">Data de Entrega</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-round text-gray-400 text-lg">calendar_month</span>
                                    </div>
                                    <input 
                                        type="date" 
                                        value={newWork.date}
                                        onChange={(e) => setNewWork({...newWork, date: e.target.value})}
                                        className="w-full pl-10 bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição / Instruções</label>
                            <textarea 
                                rows={3} 
                                value={newWork.description}
                                onChange={(e) => setNewWork({...newWork, description: e.target.value})}
                                placeholder="Detalhes sobre o trabalho..." 
                                className="w-full bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm resize-none"
                            ></textarea>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button 
                                onClick={handleCreateWork}
                                type="button" 
                                className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm active:scale-95 transform flex items-center gap-2"
                            >
                                <span className="material-icons-round text-lg">send</span>
                                Criar Trabalho
                            </button>
                        </div>
                     </form>
                </div>
            )}
            
            {/* Lists Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pending List */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 flex flex-col h-full min-h-[14rem] group hover:border-yellow-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-yellow-500/10 rounded-lg">
                                <span className="material-icons-round text-yellow-500 text-xl block">schedule</span>
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-white">Pendentes</h3>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-surface-darker px-2 py-1 rounded text-gray-500">{pendingWorks.length}</span>
                    </div>
                    
                    <div className="flex-grow space-y-3 overflow-y-auto max-h-60 pr-1">
                        {pendingWorks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-4">
                                <span className="material-icons-round text-4xl opacity-20 mb-2">inbox</span>
                                <p className="text-sm italic">Nenhum trabalho pendente.</p>
                            </div>
                        ) : (
                            pendingWorks.map(work => (
                                <div key={work.id} className="bg-white dark:bg-surface-darker p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative group/item">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{work.title}</h4>
                                        {isProfessorOrAdmin && (
                                            <button onClick={() => deleteWork(work.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                <span className="material-icons-round text-sm">close</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{work.description || 'Sem descrição.'}</p>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-[10px] text-gray-400 font-mono">{work.date.split('-').reverse().join('/')}</span>
                                        
                                        {/* Action Button: Upload for Student, Toggle for Admin */}
                                        {isProfessorOrAdmin ? (
                                            <button 
                                                onClick={() => toggleWorkStatus(work.id)}
                                                className="text-[10px] font-bold text-gray-500 hover:text-green-600 hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-icons-round text-xs">check_box_outline_blank</span> Marcar Manual
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleUploadClick(work.id)}
                                                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">cloud_upload</span> Enviar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Completed List */}
                 <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 flex flex-col h-full min-h-[14rem] group hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-green-500/10 rounded-lg">
                                <span className="material-icons-round text-green-500 text-xl block">check_circle</span>
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-white">Concluídos</h3>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-surface-darker px-2 py-1 rounded text-gray-500">{completedWorks.length}</span>
                    </div>
                    
                    <div className="flex-grow space-y-3 overflow-y-auto max-h-60 pr-1">
                        {completedWorks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-4">
                                <span className="material-icons-round text-4xl opacity-20 mb-2">playlist_add_check</span>
                                <p className="text-sm italic">Nenhum trabalho concluído.</p>
                            </div>
                        ) : (
                            completedWorks.map(work => (
                                <div key={work.id} className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors relative group/item opacity-75 hover:opacity-100">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-gray-600 dark:text-gray-400 line-through">{work.title}</h4>
                                        {isProfessorOrAdmin && (
                                            <button onClick={() => deleteWork(work.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                <span className="material-icons-round text-sm">close</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Display Attached File if exists */}
                                    {work.submissionFile && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit max-w-full">
                                            <span className="material-icons-round text-sm">attach_file</span>
                                            <span className="truncate">{work.submissionFile}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-[10px] text-gray-400 font-mono">{work.date.split('-').reverse().join('/')}</span>
                                        <button 
                                            onClick={() => toggleWorkStatus(work.id)}
                                            className="text-[10px] font-bold text-yellow-600 hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-icons-round text-xs">undo</span> {isProfessorOrAdmin ? 'Reabrir' : 'Reenviar'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};