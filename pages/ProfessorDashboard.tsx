import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankGradient, getRankTextColor } from '../constants';
import { DatabaseUser } from '../services/supabase';

const IMAGES = {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkimL0WxBc6r78Q1tkzfmPQ5-7VcQAUjgSCS1zsxF_4mE6iXwQVm2dfX6rqbpbuVSFdJbSm1rUoSIEKZEgXPH2yWrM6Wcr07J7WtWMNd4lMumoUJeRkrzsGJTOKfiRyA25t-kwuofh-q6kkLHxhdNoNE47d9CazYvWj_SECjEt7Ih3HjKurSyZbxUlAd6uifMxPRwhlUjq_cFWi5B8uJjK8YzhqGjT_kAAGkR5cVv9Qs67dxYx0CscH6ZRQGvY_TgR_2l5ye4CSBM"
};

// Chave Pix de Teste
const PIX_KEY = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Filhos do Fogo6008Sao Paulo62070503***6304E12C";

interface AttendanceStudent {
    id: number;
    name: string;
    rank: string;
    status: 'present' | 'absent' | 'justified';
    justification: string;
}

const MOCK_ATTENDANCE_LIST: AttendanceStudent[] = [
    { id: 1, name: 'Menor', rank: 'Cordel Verde e Amarelo', status: 'present', justification: '' },
    { id: 2, name: 'Wolverine', rank: 'Cordel Verde e Branco', status: 'present', justification: '' },
    { id: 3, name: 'Jean', rank: 'Iniciante', status: 'absent', justification: '' },
    { id: 4, name: 'Tempestade', rank: 'Cordel Amarelo', status: 'present', justification: '' },
    { id: 5, name: 'Ciclope', rank: 'Cordel Azul', status: 'justified', justification: 'Trabalho' },
];

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const currentRank = currentUser?.rank || "Cordel Azul (Professor)";
  const profName = currentUser?.name || "Lion";

  // Attendance Modal State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceList, setAttendanceList] = useState<AttendanceStudent[]>(MOCK_ATTENDANCE_LIST);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState('');

  // Pix Modal State
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);

  const openSocialLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        alert(`Foto "${file.name}" registrada com sucesso! A presença será processada.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        alert(`Comprovante "${file.name}" enviado com sucesso! A administração irá confirmar o pagamento.`);
        if (receiptInputRef.current) receiptInputRef.current.value = '';
        setIsPixModalOpen(false);
    }
  };

  const openAttendance = (className: string) => {
      setSelectedClassForAttendance(className);
      setAttendanceList(MOCK_ATTENDANCE_LIST);
      setIsAttendanceModalOpen(true);
  };

  const updateStatus = (id: number, status: 'present' | 'absent' | 'justified') => {
      setAttendanceList(prev => prev.map(student => 
          student.id === id ? { ...student, status } : student
      ));
  };

  const updateJustification = (id: number, text: string) => {
      setAttendanceList(prev => prev.map(student => 
          student.id === id ? { ...student, justification: text } : student
      ));
  };

  const saveAttendance = () => {
      const presentCount = attendanceList.filter(s => s.status === 'present').length;
      const justifiedCount = attendanceList.filter(s => s.status === 'justified').length;
      alert(`Chamada salva para ${selectedClassForAttendance}!\n${presentCount} Presentes\n${justifiedCount} Justificados`);
      setIsAttendanceModalOpen(false);
  };

  const copyPixKey = () => {
      navigator.clipboard.writeText(PIX_KEY);
      alert("Chave Pix copiada para a área de transferência!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#1e1b4b] shadow-2xl border border-purple-500/20 isolate group">
        <div className="absolute -top-[100px] -right-[50px] w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-[20px] -left-[20px] w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute right-0 bottom-0 transform translate-x-8 translate-y-8 opacity-5 pointer-events-none">
            <span className="material-icons-round text-[200px] text-white rotate-12">verified_user</span>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8">
            <div className="relative shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-orange-500 via-purple-500 to-blue-500 shadow-xl shadow-purple-900/60">
                    <div className="w-full h-full rounded-full border-4 border-[#2E1065] overflow-hidden bg-gray-800 relative z-10">
                        <img alt="Professor Avatar" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" src={IMAGES.avatar} />
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-20 flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-[#2E1065] shadow-lg"></span>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-purple-100 mb-3 shadow-sm">
                    <span className="material-icons-round text-sm text-purple-300">dashboard</span>
                    Painel do Professor
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">
                    Olá, {profName}!
                </h2>
                <p className="text-indigo-200 text-sm sm:text-base font-medium max-w-md leading-relaxed">
                    Bem-vindo de volta. Prepare-se para mais um dia de treinos e evolução.
                </p>
            </div>
        </div>
      </section>

      {/* Quick Actions Scroll */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
        <button onClick={() => navigate('/app/music', { state: { role: 'PROFESSOR' } })} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-yellow-500 text-lg">music_note</span> Músicas
        </button>
        <button onClick={() => navigate('/app/works')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-blue-400 text-lg">book</span> Trabalhos
        </button>
        <button onClick={() => navigate('/app/uniforms')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-orange-300 text-lg">checkroom</span> Uniforme
        </button>
        <button onClick={() => navigate('/app/grades')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300">
            <span className="material-icons-round text-green-400 text-lg">grade</span> Notas
        </button>
        <button onClick={() => navigate('/app/create-class')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-glow transition-colors">
            <span className="material-icons-round text-lg">add_circle_outline</span> Nova Aula
        </button>
        <button onClick={() => setIsPixModalOpen(true)} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-colors">
            <span className="material-icons-round text-lg">payments</span> Mensalidade
        </button>
         <button onClick={() => openSocialLink('https://discord.com/invite/AY2kk9Ubk')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg text-sm font-bold shadow-md transition-colors">
            <span className="material-icons-round text-lg">discord</span> Discord
        </button>
        <button onClick={() => openSocialLink('https://www.instagram.com/filhosdofogo2005/#')} className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white rounded-lg text-sm font-bold shadow-md transition-all">
            <span className="material-icons-round text-lg">photo_camera</span> Instagram
        </button>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex items-center overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl">
            {/* Dynamic Stripe based on Rank */}
            <div className={`absolute left-0 top-0 bottom-0 w-3 rounded-l-xl ${getRankGradient(currentRank)} shadow-[2px_0_10px_rgba(0,0,0,0.1)]`}></div>
            
            <div className="w-full pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black mb-3">Graduação Atual</p>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-opacity-10 ${getRankTextColor(currentRank)} bg-current`}>
                        <span className="material-icons-round text-4xl">workspace_premium</span>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{currentRank}</h3>
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
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white my-1">R$ 0,00</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Custo definido pela coordenação (Gratuito)</p>
        </div>
      </section>

      {/* Register Class */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
            <span className="material-icons-round text-primary">add_a_photo</span>
            <h3 className="font-bold text-sm uppercase">Registrar Aula</h3>
        </div>
        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
        />
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center group hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
        >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">photo_camera</span>
            </div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Enviar Foto</span>
        </button>
      </section>

      {/* Classes & Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Classes & Events */}
        <div className="space-y-6">
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Minhas Aulas</h3>
                <div className="space-y-4">
                    {[
                        { date: "2025-12-12 • 20:30", location: "Academia do Cláudio" },
                        { date: "2025-12-19 • 19:00", location: "Cláudio" },
                        { date: "2025-12-19 • 17:30", location: "Cláudio" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-[#202024] rounded-lg p-3 border border-gray-200 dark:border-gray-700/50 hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-8 rounded-full bg-purple-500"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.date}</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.location}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => openAttendance(item.location)}
                                className="w-full py-2.5 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-700 transition-all active:scale-[0.98]"
                            >
                                Realizar Chamada
                            </button>
                        </div>
                    ))}
                </div>
            </section>

             {/* Upcoming Events (New Section) */}
             <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                         <span className="material-icons-round text-pink-500">event</span>
                         Próximos Eventos
                    </h3>
                </div>
                <div className="space-y-3">
                    {[
                        { title: "Aula com Mestre Anjo", date: "16 Jan", location: "Filial Centro", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30" },
                        { title: "Roda de Rua", date: "20 Jan", location: "Praça da Matriz", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30" },
                        { title: "Batizado 2026", date: "02 Fev", location: "Sede Principal", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30" }
                    ].map((event, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-[#202024] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                             <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${event.color} shrink-0`}>
                                <span className="text-xs font-bold uppercase">{event.date.split(' ')[1]}</span>
                                <span className="text-lg font-bold leading-none">{event.date.split(' ')[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{event.title}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span className="material-icons-round text-[10px]">location_on</span>
                                    {event.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Column 2: Tracking */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 h-full flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Acompanhamento</h3>
            <div className="space-y-3 flex-grow">
                {[
                    { name: "menor", initials: "M" },
                    { name: "teste teste", initials: "T" },
                    { name: "J.T.", initials: "J" }
                ].map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#202024] rounded-lg border border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">{student.initials}</div>
                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{student.name}</span>
                        </div>
                        <button onClick={() => navigate('/app/grades')} className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Avaliar
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-white dark:bg-transparent">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="material-icons-round text-blue-400">book</span>
                    <span>Trabalhos Pendentes</span>
                </div>
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </div>
            
            <div className="mt-4 text-center">
                <button onClick={() => navigate('/app/students-list')} className="text-xs text-primary dark:text-purple-400 hover:underline font-semibold uppercase tracking-wide">
                    Ver todos os alunos
                </button>
            </div>
        </section>
      </div>
      
      <div className="h-6 w-full"></div>

      {/* MODAL: PIX PAYMENT */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPixModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-green-600">pix</span>
                        Pagamento via Pix
                    </h3>
                    <button onClick={() => setIsPixModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Escaneie o QR Code ou copie a chave abaixo para realizar o pagamento da mensalidade.
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

      {/* MODAL: ATTENDANCE (REALIZAR CHAMADA) */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAttendanceModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker shrink-0">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Lista de Presença</h3>
                        <p className="text-xs text-gray-500">{selectedClassForAttendance}</p>
                    </div>
                    <button onClick={() => setIsAttendanceModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto p-2">
                    {attendanceList.map(student => (
                        <div key={student.id} className="p-3 hover:bg-gray-50 dark:hover:bg-surface-darker rounded-lg border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                    {student.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.rank}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateStatus(student.id, 'present')}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                                            student.status === 'present' 
                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                                            : 'bg-white dark:bg-surface-dark text-gray-500 border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <span className="material-icons-round text-sm">check_circle</span>
                                        Presente
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(student.id, 'absent')}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                                            student.status === 'absent' 
                                            ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' 
                                            : 'bg-white dark:bg-surface-dark text-gray-500 border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <span className="material-icons-round text-sm">cancel</span>
                                        Ausente
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(student.id, 'justified')}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                                            student.status === 'justified' 
                                            ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' 
                                            : 'bg-white dark:bg-surface-dark text-gray-500 border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <span className="material-icons-round text-sm">edit_note</span>
                                        Justificar
                                    </button>
                                </div>

                                {student.status === 'justified' && (
                                    <div className="animate-fade-in">
                                        <input 
                                            type="text" 
                                            value={student.justification}
                                            onChange={(e) => updateJustification(student.id, e.target.value)}
                                            placeholder="Digite o motivo da falta..."
                                            className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-orange-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker shrink-0 flex gap-3">
                    <button onClick={() => setIsAttendanceModalOpen(false)} className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={saveAttendance} className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md transition-all flex items-center justify-center gap-2">
                        <span className="material-icons-round">save</span>
                        Salvar Chamada
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};