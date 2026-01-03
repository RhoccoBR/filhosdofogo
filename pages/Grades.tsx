import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Interfaces needed for internal state
interface GradeEntry {
    id: string;
    date: string;
    technique: number;
    music: number;
    theory: number;
    average: number;
    notes?: string;
}

interface Student {
    id: number;
    name: string;
    rank: string;
    avatar: string;
    status: 'evaluated' | 'pending';
    monthStatus: string;
    history: GradeEntry[];
}

// Mock Data with History
const INITIAL_STUDENTS: Student[] = [
    {
        id: 1,
        name: "Anjo de Fogo",
        rank: "Cordel Azul e Branco (Mestre III)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLzx2hIk4vr2-CEl6NORrBasPVq33rAE6ux2udwsWKZ_Dd7AJfZefX9jYbg0Rkf2J7Hsj9lbUrzhMniCMC7OwyHS76us9ekMofPVm6FiF1_ylG-lQLX6hzl-utknsYTyBzr7Xl08YiA4tmK41YSrln7K6Ct-eQ5CV4sN3nuQ6pSbx1SZ0GNNu36TzK867FXn35yhT1QXXNna8mAyfCjyvL6Uh4ZkCaGbwGnoWt1xpvG68jxtsRyyGNv8csZoklZPQFLUMbWUo2THk",
        status: 'evaluated',
        monthStatus: 'Avaliado',
        history: [
            { id: '1', date: '2023-11-20', technique: 8.0, music: 7.5, theory: 9.0, average: 8.2, notes: 'Ótima movimentação.' },
            { id: '2', date: '2023-11-27', technique: 8.5, music: 8.0, theory: 9.0, average: 8.5, notes: 'Melhorou na bateria.' },
            { id: '3', date: '2023-12-04', technique: 9.0, music: 8.5, theory: 9.5, average: 9.0, notes: 'Excelente treino.' },
        ]
    },
    {
        id: 4,
        name: "Menor",
        rank: "Cordel Verde e Amarelo",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk1AfptQ28cUm3y0Vu2Mj3k-4qcv_pM4xEKppEp2awACmXxfd3Eez1_-k7wY5Xy6uIVPFInE5DNw_XzAbp_lhHXExzzZUh76pe0nR7JTettpEMLWW2iRwAd-bCcwsABkw1LFGajMW6y3619gLjyM5DtkQcXRgu138g32h0CnyoQCh7WU8xpwxefZAQtrSd3XowsRtJUKTNEz2_ArDvR4ADT4zShfiIMw8hL7ujnOrrNwAcWycOMSGOmqThmndOCVZzvWhT5db_ufI",
        status: 'pending',
        monthStatus: 'Pendente',
        history: [
            { id: '1', date: '2023-11-15', technique: 6.0, music: 5.0, theory: 7.0, average: 6.0, notes: 'Precisa treinar mais musicalidade.' }
        ]
    },
    {
        id: 2,
        name: "Wolverine",
        rank: "Cordel Verde e Branco (Mestre I)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHz94nMRkGVt-Wmz0jYgnAJrJPG2Q9eIWgQ8B5wCKXMDYoDVqWy59-QmIdYj2NJ4_T_eG-wAeqym3oVr_K8uFZzAgdBMgUaw3Oe70AB0VIJNDKvR33deKW00slPax3YbW_CDSDeBBXfhKuTrYALsftKzIoY0D17dnDtaEuZoS8wSprHJvuxhKEZu5LpPu1WZol8GOip9wQb-dRBoVGTDFr7MXHE-VmoZMznj0c1ENkmKosAKTEnlONJFnhQ8DMarg5HsyQW6uBfe8",
        status: 'pending',
        monthStatus: 'Pendente',
        history: []
    },
    {
        id: 99, // Paulinho's Mock ID
        name: "Paulinho",
        rank: "Cordel Amarelo ponta Azul",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL7JWgHDpOWfdv073mz8cCpa8E21QuITENA2iUk-1ACpQ1uqgz9xdb4RyH0cxvpEUIoTEQZlTSe_J2edrkvSQK_B1Tk8k5gLYZly4MdZlFaJ3hj1oWB7dhHt_3NUjPT4ugU1D8cDaK8w5oid35x1DBBE__s4mbNZ2Pj_2XakpSDJLNcvQUWHVHh9ZTFkQQzVQDp40EwzpyF5q41bW4ifiMAZEUfrIWHAYFVOccjw7XovnP6otBqkW9pWFIzaoqti0CVqVCuSNUKjM",
        status: 'evaluated',
        monthStatus: 'Avaliado',
        history: [
             { id: '101', date: '2023-12-10', technique: 8.5, music: 7.0, theory: 9.0, average: 8.2, notes: 'Bom desempenho na roda, melhorar a entrada.' },
             { id: '102', date: '2023-12-03', technique: 7.5, music: 6.5, theory: 8.0, average: 7.3, notes: 'Atenção aos detalhes da ginga.' },
             { id: '103', date: '2023-11-26', technique: 8.0, music: 7.0, theory: 8.5, average: 7.8, notes: 'Boa energia hoje!' }
        ]
    }
];

export const Grades: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if user is a student
    const isStudentRole = location.state?.role === 'STUDENT';
    const initialStudentId = isStudentRole ? 99 : null; // Force Paulinho if student role

    const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(initialStudentId);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedStudent = useMemo(() => 
        students.find(s => s.id === selectedStudentId), 
    [students, selectedStudentId]);

    // Form State
    const [evalDate, setEvalDate] = useState(new Date().toISOString().split('T')[0]);
    const [scores, setScores] = useState({
        technique: '',
        music: '',
        theory: '',
        notes: ''
    });

    const currentAverage = useMemo(() => {
        const t = parseFloat(scores.technique) || 0;
        const m = parseFloat(scores.music) || 0;
        const th = parseFloat(scores.theory) || 0;
        const count = (scores.technique ? 1 : 0) + (scores.music ? 1 : 0) + (scores.theory ? 1 : 0);
        return count === 0 ? 0 : (t + m + th) / count;
    }, [scores]);

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!selectedStudent || selectedStudent.history.length === 0) {
            return { weekly: 0, monthly: 0, total: 0 };
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Helper to get week number (basic implementation)
        const getWeek = (date: Date) => {
            const onejan = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
        };
        const currentWeek = getWeek(now);

        let monthSum = 0, monthCount = 0;
        let weekSum = 0, weekCount = 0;
        let totalSum = 0;

        selectedStudent.history.forEach(entry => {
            const entryDate = new Date(entry.date + 'T12:00:00'); // Fix Timezone offset issue for calculation
            totalSum += entry.average;

            // Monthly
            if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
                monthSum += entry.average;
                monthCount++;
            }

            // Weekly
            if (getWeek(entryDate) === currentWeek && entryDate.getFullYear() === currentYear) {
                weekSum += entry.average;
                weekCount++;
            }
        });

        return {
            weekly: weekCount > 0 ? weekSum / weekCount : 0,
            monthly: monthCount > 0 ? monthSum / monthCount : 0,
            total: totalSum / selectedStudent.history.length
        };

    }, [selectedStudent]);

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!selectedStudent) return;

        const newEntry: GradeEntry = {
            id: Date.now().toString(),
            date: evalDate,
            technique: parseFloat(scores.technique) || 0,
            music: parseFloat(scores.music) || 0,
            theory: parseFloat(scores.theory) || 0,
            average: currentAverage,
            notes: scores.notes
        };

        // Update local state
        const updatedStudents = students.map(s => {
            if (s.id === selectedStudent.id) {
                return {
                    ...s,
                    history: [newEntry, ...s.history], // Add new entry to top
                    status: 'evaluated',
                    monthStatus: 'Avaliado Hoje'
                } as Student;
            }
            return s;
        });

        setStudents(updatedStudents);
        setScores({ technique: '', music: '', theory: '', notes: '' });
        alert("Avaliação salva com sucesso!");
    };

    // --- VIEW: INDIVIDUAL STUDENT (OR STUDENT ROLE VIEW) ---
    if (selectedStudent) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                    <button 
                        onClick={() => isStudentRole ? navigate(-1) : setSelectedStudentId(null)} 
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{isStudentRole ? 'Minhas Notas' : selectedStudent.name}</h2>
                            <p className="text-xs text-gray-500">{selectedStudent.rank}</p>
                        </div>
                    </div>
                </div>

                {/* STATISTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <span className="material-icons-round text-sm">calendar_view_week</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Média Semanal</span>
                        </div>
                        <div className="text-3xl font-black">
                            {stats.weekly > 0 ? stats.weekly.toFixed(1) : '-'}
                        </div>
                        <p className="text-[10px] opacity-80 mt-1">Calculado com base na semana atual</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-purple-500/20">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <span className="material-icons-round text-sm">calendar_month</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Média Mensal</span>
                        </div>
                        <div className="text-3xl font-black">
                             {stats.monthly > 0 ? stats.monthly.toFixed(1) : '-'}
                        </div>
                        <p className="text-[10px] opacity-80 mt-1">Mês de {new Date().toLocaleString('pt-BR', { month: 'long' })}</p>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                            <span className="material-icons-round text-sm">history</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Média Geral</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white">
                             {stats.total > 0 ? stats.total.toFixed(1) : '-'}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{selectedStudent.history.length} avaliações totais</p>
                    </div>
                </div>

                <div className={`grid ${isStudentRole ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
                    {/* LEFT COL: NEW EVALUATION (Hidden for Student) */}
                    {!isStudentRole && (
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <span className="material-icons-round text-primary">edit_note</span>
                                        Nova Avaliação Diária
                                    </h3>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Média do Treino</span>
                                        <span className={`text-2xl font-black ${currentAverage >= 7 ? 'text-green-500' : currentAverage > 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                                            {currentAverage > 0 ? currentAverage.toFixed(1) : '-'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid gap-6">
                                    {/* Date Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Data da Avaliação</label>
                                        <input 
                                            type="date"
                                            value={evalDate}
                                            onChange={(e) => setEvalDate(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>

                                    {/* Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <label className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-2 block flex items-center gap-1">
                                                <span className="material-icons-round text-sm">directions_run</span> Técnica
                                            </label>
                                            <input 
                                                type="number" min="0" max="10" step="0.5"
                                                value={scores.technique}
                                                onChange={(e) => setScores({...scores, technique: e.target.value})}
                                                className="w-full bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-center text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="0-10"
                                            />
                                        </div>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                            <label className="text-xs font-bold text-yellow-800 dark:text-yellow-300 uppercase mb-2 block flex items-center gap-1">
                                                <span className="material-icons-round text-sm">music_note</span> Música
                                            </label>
                                            <input 
                                                type="number" min="0" max="10" step="0.5"
                                                value={scores.music}
                                                onChange={(e) => setScores({...scores, music: e.target.value})}
                                                className="w-full bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-center text-lg font-bold focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="0-10"
                                            />
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                                            <label className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase mb-2 block flex items-center gap-1">
                                                <span className="material-icons-round text-sm">menu_book</span> Teoria
                                            </label>
                                            <input 
                                                type="number" min="0" max="10" step="0.5"
                                                value={scores.theory}
                                                onChange={(e) => setScores({...scores, theory: e.target.value})}
                                                className="w-full bg-white dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-center text-lg font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="0-10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Observações do Treino</label>
                                         <textarea 
                                            value={scores.notes}
                                            onChange={(e) => setScores({...scores, notes: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none h-24"
                                            placeholder="Comentários sobre o desempenho, atitude ou pontos a melhorar..."
                                         ></textarea>
                                    </div>

                                    <button 
                                        onClick={handleSave}
                                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-lg shadow-primary/20 transform transition active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <span className="material-icons-round">save</span>
                                        Salvar Avaliação do Dia
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RIGHT COL: HISTORY LIST (Full width for student) */}
                    <div className="lg:col-span-1 w-full">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-full flex flex-col">
                             <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-darker rounded-t-xl">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons-round">history</span> Histórico de Notas
                                </h3>
                            </div>
                            <div className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                                {selectedStudent.history.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        Nenhuma avaliação registrada ainda.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {selectedStudent.history.map((entry) => (
                                            <div key={entry.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-500 uppercase">
                                                            {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <div className="flex gap-2 mt-1">
                                                             <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">T: {entry.technique}</span>
                                                             <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded">M: {entry.music}</span>
                                                             <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded">Teo: {entry.theory}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                                        entry.average >= 7 ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20' : 
                                                        entry.average >= 5 ? 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 
                                                        'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                                                    }`}>
                                                        {entry.average.toFixed(1)}
                                                    </div>
                                                </div>
                                                {entry.notes && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
                                                        "{entry.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW: STUDENT LIST SELECTION ---
    return (
        <div className="max-w-5xl mx-auto space-y-6 mb-20">
             <div className="mb-6">
                 <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-4 group">
                    <span className="material-icons-round text-xl mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Voltar
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-icons-round text-green-500 text-3xl">assessment</span>
                    Avaliação de Alunos
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Selecione um aluno para registrar a nota do dia e ver médias.
                </p>
            </div>

             {/* Search */}
             <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <span className="material-icons-round">search</span>
                </span>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-shadow shadow-sm" 
                    placeholder="Buscar aluno por nome..."
                />
            </div>

            {/* Students Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.filter(s => s.id !== 99).map(student => { // Hide Paulinho from Professor list for clean demo
                    // Calculate Last Grade for list view
                    const lastGrade = student.history.length > 0 ? student.history[0].average.toFixed(1) : null;
                    const historyCount = student.history.length;

                    return (
                        <div 
                            key={student.id} 
                            onClick={() => setSelectedStudentId(student.id)}
                            className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-surface-darker transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${lastGrade ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                            
                            <div className="relative">
                                <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-surface-dark shadow-sm" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-primary transition-colors">{student.name}</h3>
                                <p className="text-xs text-gray-500 truncate mb-1">{student.rank}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">
                                        {historyCount} avaliações
                                    </span>
                                    {lastGrade && (
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 ml-auto flex items-center gap-1">
                                            Última: {lastGrade}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                    );
                })}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <span className="material-icons-round text-4xl opacity-30 mb-2">person_search</span>
                    <p>Nenhum aluno encontrado.</p>
                </div>
            )}
        </div>
    );
};