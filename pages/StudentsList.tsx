import React from 'react';
import { useNavigate } from 'react-router-dom';

const STUDENTS = [
    {
        id: 4,
        name: "Menor",
        realName: "Menor Teste",
        rank: "Cordel Verde e Amarelo",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk1AfptQ28cUm3y0Vu2Mj3k-4qcv_pM4xEKppEp2awACmXxfd3Eez1_-k7wY5Xy6uIVPFInE5DNw_XzAbp_lhHXExzzZUh76pe0nR7JTettpEMLWW2iRwAd-bCcwsABkw1LFGajMW6y3619gLjyM5DtkQcXRgu138g32h0CnyoQCh7WU8xpwxefZAQtrSd3XowsRtJUKTNEz2_ArDvR4ADT4zShfiIMw8hL7ujnOrrNwAcWycOMSGOmqThmndOCVZzvWhT5db_ufI",
        status: "Em dia",
        lastTraining: "Ontem"
    },
    {
        id: 1,
        name: "Anjo de Fogo",
        realName: "Marcos Antonio Soares",
        rank: "Cordel Azul e Branco (Mestre III)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLzx2hIk4vr2-CEl6NORrBasPVq33rAE6ux2udwsWKZ_Dd7AJfZefX9jYbg0Rkf2J7Hsj9lbUrzhMniCMC7OwyHS76us9ekMofPVm6FiF1_ylG-lQLX6hzl-utknsYTyBzr7Xl08YiA4tmK41YSrln7K6Ct-eQ5CV4sN3nuQ6pSbx1SZ0GNNu36TzK867FXn35yhT1QXXNna8mAyfCjyvL6Uh4ZkCaGbwGnoWt1xpvG68jxtsRyyGNv8csZoklZPQFLUMbWUo2THk",
        status: "Pendente",
        lastTraining: "3 dias atrás"
    }
];

export const StudentsList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-icons-round text-primary">assignment_ind</span>
                    Detalhes dos Alunos
                </h1>
                <p className="text-gray-500 text-sm mt-1">Selecione um aluno para ver boletins, treinos e tarefas.</p>
            </div>

             <div className="relative mb-6">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <span className="material-icons-round">search</span>
                </span>
                <input 
                    type="text" 
                    className="w-full bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="Filtrar alunos..."
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {STUDENTS.map(student => (
                    <div key={student.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${student.status === 'Em dia' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        
                        <div className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden mb-3">
                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{student.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{student.rank}</p>
                        
                        <div className="w-full border-t border-gray-100 dark:border-gray-700 my-3 pt-3 flex justify-between text-xs text-gray-500">
                            <span>Treino: <span className="font-semibold text-gray-700 dark:text-gray-300">{student.lastTraining}</span></span>
                            <span>Situação: <span className={`font-bold ${student.status === 'Em dia' ? 'text-green-600' : 'text-red-500'}`}>{student.status}</span></span>
                        </div>

                        <button 
                            onClick={() => navigate(`/app/users/${student.id}`)}
                            className="w-full mt-auto bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Ver Ficha Completa <span className="material-icons-round text-sm">arrow_forward</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};