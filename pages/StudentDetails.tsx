import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MOCK_STUDENTS_DB = [
    {
        id: "1",
        name: "Anjo de Fogo",
        realName: "Marcos Antonio Soares",
        rank: "Cordel Azul e Branco (Mestre III)",
        role: "Aluno",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLzx2hIk4vr2-CEl6NORrBasPVq33rAE6ux2udwsWKZ_Dd7AJfZefX9jYbg0Rkf2J7Hsj9lbUrzhMniCMC7OwyHS76us9ekMofPVm6FiF1_ylG-lQLX6hzl-utknsYTyBzr7Xl08YiA4tmK41YSrln7K6Ct-eQ5CV4sN3nuQ6pSbx1SZ0GNNu36TzK867FXn35yhT1QXXNna8mAyfCjyvL6Uh4ZkCaGbwGnoWt1xpvG68jxtsRyyGNv8csZoklZPQFLUMbWUo2THk"
    },
    {
        id: "4",
        name: "Menor",
        realName: "Menor Teste",
        rank: "Cordel Verde e Amarelo",
        role: "Aluno",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk1AfptQ28cUm3y0Vu2Mj3k-4qcv_pM4xEKppEp2awACmXxfd3Eez1_-k7wY5Xy6uIVPFInE5DNw_XzAbp_lhHXExzzZUh76pe0nR7JTettpEMLWW2iRwAd-bCcwsABkw1LFGajMW6y3619gLjyM5DtkQcXRgu138g32h0CnyoQCh7WU8xpwxefZAQtrSd3XowsRtJUKTNEz2_ArDvR4ADT4zShfiIMw8hL7ujnOrrNwAcWycOMSGOmqThmndOCVZzvWhT5db_ufI"
    },
    {
        id: "2",
        name: "Wolverine",
        realName: "Adriano de Freitas",
        rank: "Cordel Verde e Branco (Mestre I)",
        role: "Aluno",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHz94nMRkGVt-Wmz0jYgnAJrJPG2Q9eIWgQ8B5wCKXMDYoDVqWy59-QmIdYj2NJ4_T_eG-wAeqym3oVr_K8uFZzAgdBMgUaw3Oe70AB0VIJNDKvR33deKW00slPax3YbW_CDSDeBBXfhKuTrYALsftKzIoY0D17dnDtaEuZoS8wSprHJvuxhKEZu5LpPu1WZol8GOip9wQb-dRBoVGTDFr7MXHE-VmoZMznj0c1ENkmKosAKTEnlONJFnhQ8DMarg5HsyQW6uBfe8"
    }
];

export const StudentDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'info' | 'school' | 'training' | 'tasks'>('info');

    const student = useMemo(() => {
        return MOCK_STUDENTS_DB.find(s => s.id === id) || MOCK_STUDENTS_DB[1]; // Default to Menor if not found
    }, [id]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-darker transition-colors">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Detalhes do Aluno
                    </h1>
                </div>
            </div>

            {/* Student Profile Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-icons-round text-9xl">verified_user</span>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 border-4 border-white dark:border-surface-darker shadow-lg overflow-hidden shrink-0">
                        <img src={student.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center md:text-left space-y-2 flex-1">
                        <div>
                            <h2 className="text-3xl font-bold">{student.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{student.realName}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                             <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-full text-sm font-bold border border-yellow-200 dark:border-yellow-900/30">
                                {student.rank}
                            </span>
                             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-900/30">
                                {student.role}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-md transition-all">
                            <span className="material-icons-round text-sm">edit</span> Editar Perfil
                        </button>
                         <button className="flex items-center justify-center gap-2 px-6 py-2 bg-surface-light dark:bg-surface-darker border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all">
                            <span className="material-icons-round text-sm">chat</span> Mensagem
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-gray-200 dark:border-gray-800 pb-1">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-3 rounded-t-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${activeTab === 'info' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className="material-icons-round text-lg">person</span>
                    Informações Pessoais
                </button>
                <button 
                    onClick={() => setActiveTab('school')}
                    className={`px-4 py-3 rounded-t-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${activeTab === 'school' ? 'border-blue-500 text-blue-600 bg-blue-500/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className="material-icons-round text-lg">school</span>
                    Boletim Escolar
                </button>
                 <button 
                    onClick={() => setActiveTab('training')}
                    className={`px-4 py-3 rounded-t-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${activeTab === 'training' ? 'border-orange-500 text-orange-600 bg-orange-500/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className="material-icons-round text-lg">fitness_center</span>
                    Treinos em Casa
                </button>
                <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-3 rounded-t-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${activeTab === 'tasks' ? 'border-purple-500 text-purple-600 bg-purple-500/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className="material-icons-round text-lg">assignment</span>
                    Trabalhos
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Dados Cadastrais</h3>
                             <div className="space-y-4">
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Data de Nascimento</span>
                                    <span className="font-medium">01/02/2000</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Email</span>
                                    <span className="font-medium">email@exemplo.com</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Telefone</span>
                                    <span className="font-medium">(11) 99999-9999</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500 text-sm">Responsável</span>
                                    <span className="font-medium">Mãe / Pai</span>
                                </div>
                             </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Dados da Capoeira</h3>
                             <div className="space-y-4">
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Professor</span>
                                    <span className="font-medium">Lion</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Data de Início</span>
                                    <span className="font-medium">10/05/2023</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-800 pb-2">
                                    <span className="text-gray-500 text-sm">Graduação Anterior</span>
                                    <span className="font-medium text-green-600">Cordel Verde</span>
                                </div>
                                 <div className="flex justify-between pt-1">
                                    <span className="text-gray-500 text-sm">Mensalidade</span>
                                    <span className="font-bold text-green-500">Em dia</span>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'school' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div>
                                <h3 className="font-bold text-blue-800 dark:text-blue-300">Acompanhamento Escolar</h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Verifique as notas e frequência escolar.</p>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                <span className="material-icons-round text-sm">upload_file</span> Anexar Boletim
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                             {[1, 2, 3, 4].map((bimestre) => (
                                <div key={bimestre} className={`relative p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-3 transition-all ${bimestre <= 2 ? 'bg-surface-light dark:bg-surface-dark border-green-500' : 'bg-gray-50 dark:bg-white/5 border-gray-300 dark:border-gray-700'}`}>
                                    {bimestre <= 2 && <div className="absolute top-2 right-2 text-green-500"><span className="material-icons-round">check_circle</span></div>}
                                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{bimestre}º Bimestre</span>
                                    {bimestre <= 2 ? (
                                        <>
                                            <div className="text-3xl font-black text-gray-800 dark:text-white">8.5</div>
                                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Aprovado</span>
                                            <button className="text-xs text-blue-500 hover:underline mt-1">Ver Detalhes</button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons-round text-4xl text-gray-300">pending</span>
                                            <span className="text-xs text-gray-400">Aguardando entrega</span>
                                        </>
                                    )}
                                </div>
                             ))}
                        </div>
                    </div>
                )}

                {activeTab === 'training' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-orange-500 text-white p-5 rounded-xl shadow-lg">
                                <div className="text-4xl font-black mb-1">12</div>
                                <div className="font-medium text-orange-100 text-sm uppercase tracking-wide">Treinos este mês</div>
                            </div>
                             <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm">
                                <div className="text-4xl font-black mb-1 text-gray-800 dark:text-white">450</div>
                                <div className="font-medium text-gray-500 text-sm uppercase tracking-wide">Minutos Totais</div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 border-dashed border-2">
                                <div className="text-center text-primary">
                                    <span className="material-icons-round text-3xl">add_circle</span>
                                    <div className="font-bold text-sm">Registrar Treino</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <h3 className="p-4 font-bold border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5">Histórico Recente</h3>
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {[
                                    { title: "Ginga e Esquivas", date: "Ontem", duration: "45 min", type: "Técnica" },
                                    { title: "Sequência de Bimba", date: "20 Dez", duration: "60 min", type: "Sequência" },
                                    { title: "Alongamento e Flexibilidade", date: "18 Dez", duration: "30 min", type: "Físico" },
                                ].map((train, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
                                                <span className="material-icons-round">fitness_center</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{train.title}</h4>
                                                <p className="text-xs text-gray-500">{train.date} • {train.type}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-sm text-gray-600 dark:text-gray-400">{train.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="space-y-4">
                         <div className="flex justify-end">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                <span className="material-icons-round text-sm">add</span> Atribuir Trabalho
                            </button>
                         </div>

                        <div className="space-y-3">
                             {/* Task Item */}
                             <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-yellow-500">
                                <div>
                                    <h4 className="font-bold text-base">Pesquisa: Mestre Bimba</h4>
                                    <p className="text-sm text-gray-500 mt-1">Escrever sobre a importância de Mestre Bimba para a Capoeira Regional.</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                        <span className="flex items-center gap-1 text-gray-500"><span className="material-icons-round text-sm">calendar_today</span> Entrega: 25/12/2025</span>
                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-bold">Pendente</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-2 text-sm bg-gray-100 dark:bg-surface-darker hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-medium">Ver Detalhes</button>
                                </div>
                             </div>

                             {/* Task Item */}
                             <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-green-500 opacity-75">
                                <div>
                                    <h4 className="font-bold text-base line-through text-gray-400">Desenho de Instrumento</h4>
                                    <p className="text-sm text-gray-500 mt-1">Desenhar um Berimbau e suas partes.</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                        <span className="flex items-center gap-1 text-gray-500"><span className="material-icons-round text-sm">event_available</span> Entregue: 10/12/2025</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-bold">Concluído</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-2 text-sm font-bold text-green-600 flex items-center gap-1">
                                        <span className="material-icons-round">grade</span> Nota: 10
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};