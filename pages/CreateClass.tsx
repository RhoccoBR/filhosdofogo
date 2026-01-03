import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CLASS_TYPES = [
    { id: 'technique', label: 'Técnica', icon: 'directions_run', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { id: 'roda', label: 'Roda', icon: 'groups', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
    { id: 'music', label: 'Música', icon: 'music_note', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    { id: 'physical', label: 'Físico', icon: 'fitness_center', color: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
];

export const CreateClass: React.FC = () => {
    const navigate = useNavigate();
    const [confirmed, setConfirmed] = useState(false);
    const [selectedType, setSelectedType] = useState('technique');

    const handleCreate = () => {
        // Here you would normally handle the API call
        setConfirmed(true);
    };

    if (confirmed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark animate-fade-in">
                 <div className="relative flex items-center justify-center size-24 rounded-full bg-primary/20 mb-6 animate-bounce-slow">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75"></div>
                    <span className="material-icons-round text-primary text-[48px] font-bold">check</span>
                </div>
                <h1 className="text-3xl font-bold text-center leading-tight mb-2 text-gray-900 dark:text-white">
                    Agendamento<br/>Confirmado!
                </h1>
                <p className="text-center text-gray-500 dark:text-gray-400 text-base max-w-[280px] mb-8">
                    Sua aula foi criada com sucesso e os alunos já foram notificados.
                </p>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-lg border border-gray-100 dark:border-white/5 space-y-5 w-full max-w-sm mb-8">
                    <div className="border-b border-gray-100 dark:border-white/10 pb-4">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-1">
                                Confirmado
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Roda de Sexta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Grupo Iniciantes / Fundamentos</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <div className="flex items-center justify-center size-8 rounded-full bg-gray-50 dark:bg-white/5">
                                    <span className="material-icons-round text-[18px]">calendar_today</span>
                                </div>
                                <span className="text-sm font-medium">Data</span>
                            </div>
                            <p className="text-gray-900 dark:text-white text-sm font-semibold">15 Nov, 2023</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <div className="flex items-center justify-center size-8 rounded-full bg-gray-50 dark:bg-white/5">
                                    <span className="material-icons-round text-[18px]">schedule</span>
                                </div>
                                <span className="text-sm font-medium">Horário</span>
                            </div>
                            <p className="text-gray-900 dark:text-white text-sm font-semibold">19:00 - 20:30</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <div className="flex items-center justify-center size-8 rounded-full bg-gray-50 dark:bg-white/5">
                                    <span className="material-icons-round text-[18px]">location_on</span>
                                </div>
                                <span className="text-sm font-medium">Local</span>
                            </div>
                            <p className="text-gray-900 dark:text-white text-sm font-semibold text-right max-w-[150px] truncate">Academia Central, Sala 2</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button onClick={() => navigate('/app/classes')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all">
                        <span>Voltar para Minhas Aulas</span>
                    </button>
                    <button onClick={() => navigate('/app/events')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-transparent border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white gap-2 text-base font-medium leading-normal hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all">
                        <span className="material-icons-round text-[20px]">calendar_month</span>
                        <span>Ver Calendário</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                 <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                    <span className="material-icons-round text-xl">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agendar Nova Aula</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os detalhes para notificar os alunos.</p>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 animate-fade-in">
                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                    
                    {/* Class Type Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Tipo de Aula</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {CLASS_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setSelectedType(type.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                        selectedType === type.id 
                                        ? `${type.color} ring-2 ring-offset-2 dark:ring-offset-surface-dark ring-opacity-50` 
                                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="material-icons-round text-2xl">{type.icon}</span>
                                    <span className="text-sm font-bold">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título da Aula</label>
                             <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ex: Treino de Sequências, Roda de Sexta..." 
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                />
                             </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Data</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-icons-round">calendar_today</span>
                                </span>
                                <input 
                                    type="date" 
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker pl-10 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Início</label>
                                <input 
                                    type="time" 
                                    defaultValue="19:00"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker px-2 py-3 text-base text-center outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Término</label>
                                <input 
                                    type="time" 
                                    defaultValue="20:30"
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker px-2 py-3 text-base text-center outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Local</label>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round">location_on</span>
                            </span>
                            <select className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker pl-10 pr-10 py-3 text-base outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow">
                                <option value="">Selecione o local...</option>
                                <option value="sede">Sede Principal - Centro</option>
                                <option value="filial1">Filial Norte - Escola Estadual</option>
                                <option value="praca">Praça da Matriz (Ao ar livre)</option>
                                <option value="online">Online (Zoom/Meet)</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                                <span className="material-icons-round">expand_more</span>
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                            <span>Observações / Conteúdo</span>
                            <span className="text-xs text-gray-400 font-normal">Opcional</span>
                        </label>
                        <textarea 
                            rows={4}
                            placeholder="Descreva o foco do treino, requisitos de uniforme ou avisos importantes..."
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-darker px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                        ></textarea>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-darker transition-colors flex-1">
                            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" defaultChecked />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Notificar Alunos</span>
                                <span className="text-xs text-gray-500">Enviar alerta via App e Email</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-darker transition-colors flex-1">
                            <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Repetir Semanalmente</span>
                                <span className="text-xs text-gray-500">Criar recorrência automática</span>
                            </div>
                        </label>
                    </div>

                    <button 
                        onClick={handleCreate}
                        type="submit"
                        className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-primary/20 transform transition active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        <span className="material-icons-round">check_circle</span>
                        Confirmar Agendamento
                    </button>
                </form>
            </div>
        </div>
    );
};