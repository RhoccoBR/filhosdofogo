import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('month');

    // Mock Data for Charts
    const financialData = [
        { label: 'Jan', income: 3500, expense: 1200 },
        { label: 'Fev', income: 4200, expense: 2100 },
        { label: 'Mar', income: 3800, expense: 1500 },
        { label: 'Abr', income: 4500, expense: 1100 },
        { label: 'Mai', income: 4100, expense: 3200 },
        { label: 'Jun', income: 5200, expense: 1800 },
    ];

    const attendanceData = [
        { label: 'Segunda', count: 45 },
        { label: 'Quarta', count: 52 },
        { label: 'Sexta', count: 38 },
        { label: 'Sábado', count: 25 },
    ];

    const maxIncome = Math.max(...financialData.map(d => d.income));

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-medium mb-2 group">
                        <span className="material-icons-round text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Voltar
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-orange-500">bar_chart</span>
                        Relatórios e Métricas
                    </h1>
                    <p className="text-sm text-gray-500">Visão geral do desempenho do grupo.</p>
                </div>
                
                <div className="flex gap-2">
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="week">Última Semana</option>
                        <option value="month">Último Mês</option>
                        <option value="quarter">Último Trimestre</option>
                        <option value="year">Ano Atual</option>
                    </select>
                    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                        <span className="material-icons-round text-lg">download</span>
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-round text-6xl">groups</span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Alunos Ativos</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">42</h3>
                    <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        <span className="material-icons-round text-sm">trending_up</span> +3 novos este mês
                    </p>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-round text-6xl">payments</span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Receita (Mês)</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">R$ 3.850</h3>
                    <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        <span className="material-icons-round text-sm">trending_up</span> 12% vs mês anterior
                    </p>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-round text-6xl">check_circle</span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Frequência Média</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">85%</h3>
                    <p className="text-xs text-gray-500 font-bold mt-2 flex items-center gap-1">
                        Estável
                    </p>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-round text-6xl">warning</span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Inadimplência</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">3</h3>
                    <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">
                        Alunos pendentes
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Financial Chart (CSS Based) */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="material-icons-round text-green-500">monetization_on</span>
                        Fluxo de Caixa (Semestral)
                    </h3>
                    
                    <div className="flex items-end justify-between h-64 gap-2 sm:gap-4">
                        {financialData.map((data, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative h-full flex items-end overflow-hidden">
                                    {/* Expense Bar (Background/Overlay) */}
                                    <div 
                                        className="w-full bg-red-400/30 absolute bottom-0 transition-all duration-500"
                                        style={{ height: `${(data.expense / maxIncome) * 100}%` }}
                                    ></div>
                                    {/* Income Bar */}
                                    <div 
                                        className="w-full bg-green-500 mx-1 sm:mx-2 rounded-t-sm transition-all duration-500 group-hover:bg-green-400 relative"
                                        style={{ height: `${(data.income / maxIncome) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            R$ {data.income}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{data.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Receita</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400/50 rounded-full"></div>
                            <span className="text-xs text-gray-500">Despesa</span>
                        </div>
                    </div>
                </div>

                {/* Attendance & Demographics */}
                <div className="space-y-6">
                    {/* Attendance Bars */}
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-blue-500">calendar_today</span>
                            Frequência por Dia da Semana
                        </h3>
                        <div className="space-y-4">
                            {attendanceData.map((day, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{day.label}</span>
                                        <span className="font-bold">{day.count} alunos</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${(day.count / 60) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rank Distribution */}
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-yellow-500">military_tech</span>
                            Distribuição de Graduações
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Iniciantes</div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <div className="w-8 text-xs font-bold">40%</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Cordel Verde</div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                                <div className="w-8 text-xs font-bold">30%</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Cordel Amarelo</div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                </div>
                                <div className="w-8 text-xs font-bold">20%</div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="w-24 text-xs font-bold text-gray-500 text-right">Graduados+</div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                                <div className="w-8 text-xs font-bold">10%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};