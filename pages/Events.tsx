import React, { useState } from 'react';

interface EventData {
    id: number;
    title: string;
    date: string;
    price: string;
    description: string;
    participants: number;
    participantList: string[]; // Added list of names
    mandatory: boolean;
}

const INITIAL_EVENTS: EventData[] = [
    {
        id: 1,
        title: "Batizado e troca de graduação",
        date: "2026-02-02",
        price: "150,00",
        description: "Todos são obrigados a estarem presentes e uniformizados! ❤️",
        participants: 3,
        participantList: ["Anjo de Fogo", "Wolverine", "Menor"],
        mandatory: true
    },
    {
        id: 2,
        title: "Aula com o Mestre Anjo de Fogo",
        date: "2026-01-16",
        price: "100,00",
        description: "Aula especial de fundamentos.",
        participants: 12,
        participantList: ["Wolverine", "Jean", "Tempestade", "Ciclope", "Vampira", "Fera", "Gambit", "Jubileu", "Professor X", "Magneto", "Mística", "Noturno"],
        mandatory: false
    }
];

const DEFAULT_FORM: EventData = {
    id: 0,
    title: '',
    date: '',
    price: '',
    description: '',
    participants: 0,
    participantList: [],
    mandatory: false
};

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<EventData>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  
  // State to track which event has its participant list expanded
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  // Handlers
  const handleAddNew = () => {
      setFormData(DEFAULT_FORM);
      setIsEditing(false);
      setIsModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent, event: EventData) => {
      e.stopPropagation(); // Prevent toggling participants if we clicked edit
      setFormData(event);
      setIsEditing(true);
      setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
      e.stopPropagation(); // Prevent toggling participants if we clicked delete
      if (window.confirm("Tem certeza que deseja cancelar este evento?")) {
          setEvents(prevEvents => prevEvents.filter(ev => ev.id !== id));
      }
  };

  const toggleParticipants = (id: number) => {
      setExpandedEventId(prev => prev === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isEditing) {
          setEvents(events.map(ev => ev.id === formData.id ? formData : ev));
      } else {
          const newEvent = { ...formData, id: Date.now(), participants: 0, participantList: [] };
          setEvents([newEvent, ...events]);
      }
      setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
      if (!dateString) return '--/--/----';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-icons-round text-primary">calendar_today</span>
            Gerenciar Eventos
         </h1>
      </div>

      <button 
        onClick={handleAddNew}
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <span className="material-icons-round">add</span>
        Novo Evento
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        {events.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400">
                <span className="material-icons-round text-4xl mb-2 opacity-30">event_busy</span>
                <p>Nenhum evento agendado.</p>
            </div>
        ) : (
            events.map(event => (
                <div key={event.id} className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm border-l-4 border-l-yellow-400 relative group transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight pr-8">{event.title}</h3>
                        <div className="flex gap-2 absolute top-4 right-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-surface-dark p-1 rounded-lg shadow-sm z-10">
                            <button onClick={(e) => handleEdit(e, event)} className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">
                                <span className="material-icons-round text-sm">edit</span>
                            </button>
                            <button onClick={(e) => handleDelete(e, event.id)} className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                <span className="material-icons-round text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-primary font-semibold text-sm flex items-center gap-1">
                            <span className="material-icons-round text-sm">event</span>
                            {formatDate(event.date)}
                        </span>
                        {event.mandatory && (
                            <span className="text-[10px] font-bold uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded">Obrigatório</span>
                        )}
                    </div>

                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded mb-4">
                        R$ {event.price || '0,00'}
                    </span>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {event.description || <span className="italic opacity-50">Sem descrição.</span>}
                    </p>
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                        <button 
                            onClick={() => toggleParticipants(event.id)}
                            className="flex items-center gap-2 text-sm text-gray-500 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-icons-round text-base">group</span>
                            Participantes ({event.participantList?.length || 0})
                            <span className={`material-icons-round ml-auto transition-transform duration-200 ${expandedEventId === event.id ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {/* Expandable Participant List */}
                        {expandedEventId === event.id && (
                            <div className="mt-3 bg-gray-50 dark:bg-surface-darker rounded-lg p-3 animate-fade-in">
                                {event.participantList && event.participantList.length > 0 ? (
                                    <ul className="space-y-2">
                                        {event.participantList.map((person, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 last:border-0 pb-1 last:pb-0">
                                                <span className="material-icons-round text-xs text-green-500">check_circle</span>
                                                {person}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-2">Nenhum participante confirmado ainda.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* MODAL - ADD/EDIT EVENT */}
      {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker shrink-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons-round text-primary">{isEditing ? 'edit_calendar' : 'event_available'}</span>
                            {isEditing ? 'Editar Evento' : 'Novo Evento'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-icons-round">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título do Evento</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Ex: Batizado 2026"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Valor (R$)</label>
                                    <input 
                                        type="text" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição / Avisos</label>
                                <textarea 
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                    placeholder="Detalhes sobre o evento..."
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-700">
                                <input 
                                    type="checkbox" 
                                    id="mandatory"
                                    checked={formData.mandatory}
                                    onChange={(e) => setFormData({...formData, mandatory: e.target.checked})}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="mandatory" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Presença Obrigatória?
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round text-sm">save</span>
                                Salvar Evento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};