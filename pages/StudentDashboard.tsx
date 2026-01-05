import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankGradient, getRankTextColor } from '../constants';
import { DatabaseUser } from '../services/supabase';

const IMAGES = {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL7JWgHDpOWfdv073mz8cCpa8E21QuITENA2iUk-1ACpQ1uqgz9xdb4RyH0cxvpEUIoTEQZlTSe_J2edrkvSQK_B1Tk8k5gLYZly4MdZlFaJ3hj1oWB7dhHt_3NUjPT4ugU1D8cDaK8w5oid35x1DBBE__s4mbNZ2Pj_2XakpSDJLNcvQUWHVHh9ZTFkQQzVQDp40EwzpyF5q41bW4ifiMAZEUfrIWHAYFVOccjw7XovnP6otBqkW9pWFIzaoqti0CVqVCuSNUKjM"
};

const PIX_KEY = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Filhos do Fogo6008Sao Paulo62070503***6304E12C";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<DatabaseUser | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('fdf_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao ler usuário", e);
      }
    }
  }, []);

  // Dados Mockados complementares
  const student = {
      name: currentUser?.name || "Aluno",
      rank: currentUser?.rank || "Cordel Cinza (Iniciante)",
      professor: currentUser?.professor || "Não atribuído",
      financialStatus: "pending",
      nextEvaluation: "R$ 0,00",
      nextClass: { date: "Hoje", time: "20:30", location: "Academia do Cláudio" },
      monthlyTrainings: 12
  };

  const myClasses = [
      { id: 1, title: 'Treino de Sequências', date: 'Hoje', time: '19:00', location: 'Sede', status: 'confirmed' },
      { id: 2, title: 'Roda de Sexta', date: 'Sexta', time: '20:00', location: 'Praça da Matriz', status: 'confirmed' }
  ];

  const groupClasses = [
      { id: 3, title: 'Fundamentos', day: 'Segunda', time: '19:30', location: 'Sede' },
      { id: 4, title: 'Música e Toques', day: 'Quarta', time: '18:00', location: 'Online' },
      { id: 5, title: 'Treino Físico', day: 'Sábado', time: '09:00', location: 'Parque' }
  ];

  const events = [
      { id: 1, title: 'Batizado 2026', date: '02 Fev', price: 'R$ 150,00', registered: true, color: 'border-l-yellow-500' },
      { id: 2, title: 'Workshop de Angola', date: '15 Mar', price: 'R$ 80,00', registered: false, color: 'border-l-blue-500' }
  ];

  // Pix Modal State
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'monthly' | 'extras'>('monthly');

  const openSocialLink = (url: string) => {
    window.open(url, '_blank');
  };

  const copyPixKey = () => {
      navigator.clipboard.writeText(PIX_KEY);
      alert("Chave Pix copiada para a área de transferência!");
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        alert(`Comprovante "${file.name}" enviado com sucesso! Aguarde a confirmação da secretaria.`);
        if (receiptInputRef.current) receiptInputRef.current.value = '';
        setIsPixModalOpen(false);
    }
  };

  const handleOpenPayment = (type: 'monthly' | 'extras') => {
      setPaymentType(type);
      setIsPixModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#9a3412] shadow-2xl border border-orange-500/20 isolate group">
        <div className="absolute -top-[100px] -right-[50px] w-80 h-80 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
            <div className="relative shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-600 shadow-xl shadow-orange-900/60">
                    <div className="w-full h-full rounded-full border-4 border-[#9a3412] overflow-hidden bg-gray-800 relative z-10">
                        <img alt="Student Avatar" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" src={IMAGES.avatar} />
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-20 flex h-6 w-6 items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 border-[#9a3412] ${student.financialStatus === 'paid' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-orange-100 mb-3 shadow-sm">
                    <span className="material-icons-round text-sm text-yellow-300">school</span>
                    Área do Aluno
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">
                    Olá, {student.name}!
                </h2>
                
                {/* Professor Display (Replaces Rank in Hero) */}
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 mt-1">
                    <span className="material-icons-round text-sm text-yellow-400">sports_martial_arts</span>
                    <span className="text-sm text-white font-medium">Prof. {student.professor}</span>
                </div>
            </div>
        </div>
      </section>

      {/* Quick Actions Scroll */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
        <button 
            onClick={() => handleOpenPayment('monthly')} 
            className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg ${student.financialStatus === 'pending' ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse-slow' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
            <span className="material-icons-round text-lg">{student.financialStatus === 'pending' ? 'priority_high' : 'check_circle'}</span> 
            {student.financialStatus === 'pending' ? 'Pagar Mensalidade' : 'Mensalidade OK'}
        </button>
        <button 
            onClick={() => handleOpenPayment('extras')} 
            className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg bg-purple-600 text-white hover:bg-purple-700"
        >
            <span className="material-icons-round text-lg">payments</span> 
            Pagar Avaliação/Eventos
        </button>
        <button onClick={() => navigate('/app/school-report')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-blue-500 text-lg">school</span> Boletim
        </button>
        <button onClick={() => navigate('/app/grades', { state: { role: 'STUDENT', studentName: student.name } })} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-green-500 text-lg">grade</span> Notas
        </button>
        <button onClick={() => navigate('/app/works', { state: { role: 'STUDENT' } })} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-indigo-500 text-lg">assignment</span> Trabalhos
        </button>
        <button onClick={() => navigate('/app/music', { state: { role: 'STUDENT' } })} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-yellow-500 text-lg">music_note</span> Músicas
        </button>
        <button onClick={() => navigate('/app/training')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-blue-400 text-lg">videocam</span> Treinos
        </button>
        <button onClick={() => navigate('/app/uniforms')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-orange-300 text-lg">checkroom</span> Uniforme
        </button>
        <button onClick={() => openSocialLink('https://discord.com/invite/AY2kk9Ubk')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg text-sm font-bold shadow-md transition-colors">
            <span className="material-icons-round text-lg">discord</span> Discord
        </button>
        <button onClick={() => openSocialLink('https://www.instagram.com/filhosdofogo2005/#')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white rounded-lg text-sm font-bold shadow-md transition-all">
            <span className="material-icons-round text-lg">photo_camera</span> Instagram
        </button>
      </section>

      {/* Stats Grid (Rank & Evaluation) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl">
            {/* Dynamic Stripe based on Rank */}
            <div className={`absolute left-0 top-0 bottom-0 w-3 rounded-l-xl ${getRankGradient(student.rank)} shadow-[2px_0_10px_rgba(0,0,0,0.1)]`}></div>
            
            <div className="w-full pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black mb-3">Graduação Atual</p>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-opacity-10 ${getRankTextColor(student.rank)} bg-current`}>
                        <span className="material-icons-round text-4xl">workspace_premium</span>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{student.rank}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reconhecimento oficial do Grupo Filhos do Fogo</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-green-500/30 dark:border-green-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-500/5 dark:bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
            <p className="text-xs uppercase tracking-wider text-green-500 font-bold mb-1 flex items-center gap-1">
                <span className="material-icons-round text-sm">upgrade</span> Sua Próxima Avaliação
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white my-1">{student.nextEvaluation}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Custo definido pela coordenação</p>
        </div>
      </section>

      {/* Next Class & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <span className="material-icons-round text-8xl">sports_martial_arts</span>
              </div>
              <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Próxima Aula</h3>
                  <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{student.nextClass.time}</span>
                      <span className="text-lg font-medium text-primary mb-1">{student.nextClass.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-1">
                      <span className="material-icons-round text-base">location_on</span>
                      {student.nextClass.location}
                  </p>
              </div>
              
              {/* Informative Note instead of Button */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-surface-darker p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <span className="material-icons-round text-sm opacity-70">info</span>
                  <span>A presença é realizada pelo professor em aula.</span>
              </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-primary mb-3">
                  <span className="material-icons-round text-2xl">emoji_events</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{student.monthlyTrainings}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Treinos no Mês</p>
          </div>
      </div>

      {/* Main Grid: 3 Cards Requested */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: SUAS PRÓXIMAS AULAS (Confirmed/Personal) */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-red-500">priority_high</span>
                    Suas Próximas Aulas
                </h3>
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">Obrigatório</span>
            </div>
            
            <div className="p-4 space-y-3 flex-1">
                {myClasses.length > 0 ? (
                    myClasses.map(cls => (
                        <div key={cls.id} className="flex items-center gap-4 p-3 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 shrink-0">
                                <span className="text-xs font-bold uppercase">{cls.date}</span>
                                <span className="text-lg font-black leading-none">{cls.time}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">{cls.title}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    <span className="material-icons-round text-sm">location_on</span>
                                    {cls.location}
                                </div>
                            </div>
                            <button className="p-2 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full transition-colors" title="Ver Detalhes">
                                <span className="material-icons-round">chevron_right</span>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Você não possui aulas obrigatórias agendadas.</p>
                    </div>
                )}
            </div>
        </section>

        {/* CARD 2: PRÓXIMAS AULAS DO GRUPO (Schedule) */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-blue-500">calendar_today</span>
                    Próximas Aulas do Grupo
                </h3>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Opcional</span>
            </div>
            
            <div className="p-4 space-y-3 flex-1">
                {groupClasses.map(cls => (
                    <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-10 rounded-full bg-blue-500"></div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{cls.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{cls.day} • {cls.time} • {cls.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="pt-2 text-center">
                    <button className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-1 w-full">
                        Ver grade completa <span className="material-icons-round text-sm">expand_more</span>
                    </button>
                </div>
            </div>
        </section>

        {/* CARD 3: MURAL DE EVENTOS (Full Width on Mobile, Span 2 on Large) */}
        <section className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
             <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-pink-500">campaign</span>
                    Mural de Eventos
                </h3>
                <button className="text-xs font-bold text-pink-500 hover:underline">Ver Todos</button>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                    <div key={event.id} className={`relative overflow-hidden rounded-xl border-l-4 ${event.color} bg-gray-50 dark:bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="p-4 flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Evento</span>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="material-icons-round text-sm opacity-70">event</span> {event.date}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-gray-900 dark:text-white">{event.price}</span>
                                {event.registered ? (
                                    <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded">Inscrito</span>
                                ) : (
                                    <button className="mt-2 text-xs font-bold text-pink-500 hover:underline">Inscrever-se</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>

      {/* MODAL: PIX PAYMENT */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPixModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-green-600">pix</span>
                        {paymentType === 'monthly' ? 'Pagamento de Mensalidade' : 'Pagamento de Eventos/Avaliação'}
                    </h3>
                    <button onClick={() => setIsPixModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Escaneie o QR Code ou copie a chave abaixo para realizar o 
                        {paymentType === 'monthly' ? ' pagamento da mensalidade.' : ' pagamento da avaliação ou taxa de evento.'}
                    </p>
                    
                    {/* Simulated QR Code */}
                    <div className="w-48 h-48 bg-white p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(PIX_KEY)}`} 
                            alt="QR Code Pix" 
                            className="w-full h-full object-contain opacity-90"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1 text-left">Chave Aleatória</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                readOnly
                                value={PIX_KEY}
                                className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-xs text-gray-600 dark:text-gray-300 outline-none font-mono"
                            />
                            <button 
                                onClick={copyPixKey}
                                className="p-2.5 bg-gray-100 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Copiar"
                            >
                                <span className="material-icons-round text-sm">content_copy</span>
                            </button>
                        </div>
                    </div>

                    {/* Receipt Upload Section */}
                    <div className="w-full pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                        <input 
                            type="file" 
                            ref={receiptInputRef}
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleReceiptUpload}
                        />
                        <button 
                            onClick={() => receiptInputRef.current?.click()}
                            className="w-full py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30"
                        >
                            <span className="material-icons-round text-lg">cloud_upload</span>
                            Enviar Comprovante
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        Após o pagamento, envie o comprovante para a administração.
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};