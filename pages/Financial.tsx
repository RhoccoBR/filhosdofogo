import React, { useState } from 'react';

// Mock data for the history
const HISTORY_DATA = [
    { id: 1, student: 'Menor', type: 'Mensalidade', date: '2023-12-10', amount: 'R$ 80,00', status: 'Pago', method: 'Pix' },
    { id: 2, student: 'Wolverine', type: 'Evento', date: '2023-12-05', amount: 'R$ 150,00', status: 'Pago', method: 'Dinheiro' },
    { id: 3, student: 'Anjo de Fogo', type: 'Uniforme', date: '2023-11-28', amount: 'R$ 110,00', status: 'Pago', method: 'Pix' },
    { id: 4, student: 'Jean', type: 'Mensalidade', date: '2023-11-10', amount: 'R$ 80,00', status: 'Pago', method: 'Pix' },
    { id: 5, student: 'Novo Aluno', type: 'Taxa', date: '2023-11-01', amount: 'R$ 40,00', status: 'Pendente', method: '-' },
    { id: 6, student: 'Menor', type: 'Uniforme', date: '2023-10-15', amount: 'R$ 30,00', status: 'Pago', method: 'Dinheiro' },
    { id: 7, student: 'Zeus', type: 'Evento', date: '2023-10-10', amount: 'R$ 150,00', status: 'Pago', method: 'Pix' },
];

// Mock data for Monthly Fees Control
const INITIAL_MONTHLY_FEES = [
    { id: 101, student: 'Menor', month: 'Dezembro', amount: 'R$ 80,00', status: 'Pago', override: false },
    { id: 102, student: 'Wolverine', month: 'Dezembro', amount: 'R$ 80,00', status: 'Pendente', override: true, days: '1', push: true, email: true },
    { id: 103, student: 'Jean', month: 'Dezembro', amount: 'R$ 80,00', status: 'Pago', override: false },
    { id: 104, student: 'Novo Aluno', month: 'Avaliação', amount: 'R$ 0,00', status: 'Pago', override: false },
];

interface EvaluationValue {
    id: number;
    nickname: string;
    description: string;
    value: string;
    colorClass: string;
}

const INITIAL_EVAL_VALUES: EvaluationValue[] = [
    { id: 1, nickname: 'Menor', description: 'Troca de cordel (Aluno)', value: 'R$ 150,00', colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { id: 2, nickname: 'Lion', description: 'Formatura (Professor)', value: 'R$ 350,00', colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' }
];

interface StudentConfigState {
    id: number;
    studentName: string;
    useGlobal: boolean;
    days: string;
    push: boolean;
    email: boolean;
}

interface NewFeeState {
    student: string;
    month: string;
    amount: string;
    status: string;
}

export const Financial: React.FC = () => {
  const [filterStudent, setFilterStudent] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');

  // Monthly Fees State
  const [monthlyFees, setMonthlyFees] = useState(INITIAL_MONTHLY_FEES);
  
  // Evaluation Values State
  const [evalValues, setEvalValues] = useState(INITIAL_EVAL_VALUES);
  const [newEval, setNewEval] = useState({ nickname: '', value: '' });

  // Add Fee Modal State
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [newFee, setNewFee] = useState<NewFeeState>({
      student: '',
      month: 'Janeiro',
      amount: '',
      status: 'Pendente'
  });

  // Global Reminder Configuration State
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState('3');
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Individual Student Config State
  const [selectedStudent, setSelectedStudent] = useState<StudentConfigState | null>(null);

  const handleSaveReminders = () => {
      // Simulate API call
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
  };

  const openStudentConfig = (item: any) => {
      setSelectedStudent({
          id: item.id,
          studentName: item.student,
          useGlobal: !item.override,
          days: item.days || reminderDays,
          push: item.push !== undefined ? item.push : notifyPush,
          email: item.email !== undefined ? item.email : notifyEmail,
      });
  };

  const handleSaveStudentConfig = () => {
      // Here you would update the backend/state with specific student settings
      console.log("Saving config for student:", selectedStudent);
      setSelectedStudent(null);
  };

  const handleAddFeeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newEntry = {
          id: Date.now(),
          student: newFee.student,
          month: newFee.month,
          amount: newFee.amount.includes('R$') ? newFee.amount : `R$ ${newFee.amount}`,
          status: newFee.status,
          override: false
      };
      
      setMonthlyFees([newEntry, ...monthlyFees]);
      setIsAddFeeModalOpen(false);
      setNewFee({ student: '', month: 'Janeiro', amount: '', status: 'Pendente' });
  };
  
  const handleDeleteFee = (id: number) => {
      if (window.confirm("Remover esta cobrança de mensalidade?")) {
          setMonthlyFees(prev => prev.filter(fee => fee.id !== id));
      }
  };

  const handleAddEvalValue = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newEval.nickname || !newEval.value) return;
      setEvalValues([...evalValues, {
          id: Date.now(),
          nickname: newEval.nickname,
          description: 'Taxa Extra',
          value: newEval.value,
          colorClass: 'bg-gray-100 dark:bg-gray-800 text-gray-600'
      }]);
      setNewEval({ nickname: '', value: '' });
  };

  const handleDeleteEvalValue = (id: number) => {
     if (window.confirm("Remover este valor?")) {
        setEvalValues(prev => prev.filter(v => v.id !== id));
     }
  };

  const filteredHistory = HISTORY_DATA.filter(item => {
    const matchesStudent = item.student.toLowerCase().includes(filterStudent.toLowerCase());
    const matchesType = filterType === 'Todos' || item.type === filterType;
    const matchesDate = !filterDate || item.date === filterDate; 
    
    return matchesStudent && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Seção de Avisos Urgentes */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
         <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
         
         <div className="flex items-center gap-2 mb-4 relative z-10">
             <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                 <span className="material-icons-round text-xl">priority_high</span>
             </div>
             <h2 className="text-lg font-bold text-red-800 dark:text-red-200">Avisos Urgentes</h2>
         </div>

         <div className="space-y-3 relative z-10">
             {/* Alerta Crítico */}
             <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-darker rounded-lg border-l-4 border-red-600 shadow-sm">
                 <div className="flex items-center gap-3">
                     <span className="material-icons-round text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-md">home_work</span>
                     <div>
                         <p className="font-bold text-sm text-gray-800 dark:text-gray-100">Aluguel da Sede</p>
                         <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Vencido há 2 dias</p>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="font-bold text-red-600 block">- R$ 1.200,00</span>
                     <button className="text-xs text-gray-400 underline hover:text-red-500">Pagar agora</button>
                 </div>
             </div>

             {/* Alerta Moderado */}
             <div className="flex items-center justify-between p-3 bg-white dark:bg-surface-darker rounded-lg border-l-4 border-orange-500 shadow-sm">
                 <div className="flex items-center gap-3">
                     <span className="material-icons-round text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-md">local_shipping</span>
                     <div>
                         <p className="font-bold text-sm text-gray-800 dark:text-gray-100">Fornecedor de Camisas</p>
                         <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">Vence Amanhã</p>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="font-bold text-orange-600 block">- R$ 450,00</span>
                     <button className="text-xs text-gray-400 underline hover:text-orange-500">Agendar</button>
                 </div>
             </div>
         </div>
      </div>

      {/* SECTION: GLOBAL REMINDERS CONFIGURATION */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10">
              <div className="flex items-center gap-2">
                  <span className="material-icons-round text-blue-500">alarm_on</span>
                  <div>
                      <h2 className="text-lg font-bold">Configuração Global de Lembretes</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Define o padrão para todos os alunos</p>
                  </div>
              </div>
               <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle" 
                      checked={remindersEnabled}
                      onChange={() => setRemindersEnabled(!remindersEnabled)}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-blue-600"
                  />
                  <label 
                      htmlFor="toggle" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${remindersEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  ></label>
              </div>
          </div>
          
          <div className={`p-5 transition-opacity duration-300 ${remindersEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Antecedência do Aviso (Padrão)
                      </label>
                      <select 
                          value={reminderDays}
                          onChange={(e) => setReminderDays(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                      >
                          <option value="1">1 dia antes do vencimento</option>
                          <option value="3">3 dias antes do vencimento</option>
                          <option value="5">5 dias antes do vencimento</option>
                          <option value="7">1 semana antes do vencimento</option>
                      </select>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Canais de Notificação (Padrão)
                      </label>
                      <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                  type="checkbox" 
                                  checked={notifyPush}
                                  onChange={() => setNotifyPush(!notifyPush)}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-surface-darker dark:border-gray-600"
                              />
                              <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <span className="material-icons-round text-gray-400 text-sm">notifications_active</span>
                                  Notificação no App (Push)
                              </span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                  type="checkbox" 
                                  checked={notifyEmail}
                                  onChange={() => setNotifyEmail(!notifyEmail)}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-surface-darker dark:border-gray-600"
                              />
                              <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <span className="material-icons-round text-gray-400 text-sm">email</span>
                                  Enviar por Email
                              </span>
                          </label>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="text-xs text-gray-400 italic">
                      Você pode personalizar essas configurações individualmente na lista abaixo.
                  </p>
                  <button 
                      onClick={handleSaveReminders}
                      className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                          saveSuccess 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      }`}
                  >
                      {saveSuccess ? (
                          <>
                              <span className="material-icons-round text-sm">check</span>
                              Salvo!
                          </>
                      ) : (
                          <>
                              <span className="material-icons-round text-sm">save</span>
                              Salvar Configuração Global
                          </>
                      )}
                  </button>
              </div>
          </div>
      </div>

       <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
         <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons-round text-green-500">monetization_on</span>
                        <h2 className="text-lg font-bold">Controle de Mensalidades</h2>
                    </div>
                    <p className="text-xs text-gray-500">Vencimento: Dia 10 de cada mês</p>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-gray-50 dark:bg-surface-darker rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Pendente</span>
                        <span className="text-lg font-bold text-red-500 ml-2">R$ 80,00</span>
                    </div>
                    <button 
                        onClick={() => setIsAddFeeModalOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                    >
                        <span className="material-icons-round">add</span>
                        Adicionar
                    </button>
                </div>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-surface-darker">
                    <tr>
                        <th className="px-4 py-3">Aluno</th>
                        <th className="px-4 py-3">Mês Ref.</th>
                        <th className="px-4 py-3 text-right">Valor</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {monthlyFees.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-bold">{item.student}</td>
                            <td className="px-4 py-3">{item.month}</td>
                            <td className={`px-4 py-3 text-right font-bold ${item.amount === 'R$ 0,00' ? 'text-gray-400 line-through' : 'text-green-500'}`}>{item.amount}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 ${item.status === 'Pago' ? 'bg-green-900/20 text-green-600' : 'bg-yellow-900/20 text-yellow-600'} text-[10px] uppercase font-bold px-2 py-1 rounded`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => openStudentConfig(item)}
                                    className={`p-1.5 rounded-full transition-colors relative ${item.override ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'}`}
                                    title="Configurar Lembretes Individuais"
                                >
                                    <span className="material-icons-round text-sm">{item.override ? 'notifications_active' : 'settings'}</span>
                                    {item.override && <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-surface-dark"></span>}
                                </button>
                                <button 
                                    onClick={() => handleDeleteFee(item.id)}
                                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remover Cobrança"
                                >
                                    <span className="material-icons-round text-sm">delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
       </div>

        {/* MODAL: ADD NEW FEE */}
        {isAddFeeModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddFeeModalOpen(false)}></div>
                <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons-round text-primary">add_circle</span>
                            Nova Mensalidade
                        </h3>
                        <button onClick={() => setIsAddFeeModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-icons-round">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleAddFeeSubmit} className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome do Aluno</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Ex: Menor, Wolverine..."
                                value={newFee.student}
                                onChange={(e) => setNewFee({...newFee, student: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mês Ref.</label>
                                <select 
                                    value={newFee.month}
                                    onChange={(e) => setNewFee({...newFee, month: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                >
                                    {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                    <option value="Avaliação">Avaliação</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Valor</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="80,00"
                                    value={newFee.amount}
                                    onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status"
                                        value="Pendente"
                                        checked={newFee.status === 'Pendente'}
                                        onChange={(e) => setNewFee({...newFee, status: e.target.value})}
                                        className="text-yellow-500 focus:ring-yellow-500"
                                    />
                                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500">Pendente</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status"
                                        value="Pago"
                                        checked={newFee.status === 'Pago'}
                                        onChange={(e) => setNewFee({...newFee, status: e.target.value})}
                                        className="text-green-500 focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium text-green-600 dark:text-green-500">Pago</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => setIsAddFeeModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                                Cancelar
                            </button>
                            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md text-sm">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* MODAL: STUDENT REMINDER CONFIGURATION */}
        {selectedStudent && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
                <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Configurar Lembretes</h3>
                            <p className="text-xs text-gray-500">Aluno: <span className="font-semibold text-primary">{selectedStudent.studentName}</span></p>
                        </div>
                        <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-icons-round">close</span>
                        </button>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Toggle Global/Custom */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <div>
                                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100">Usar configuração global?</h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300">Seguirá o padrão definido no topo da página.</p>
                            </div>
                             <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    type="checkbox" 
                                    name="toggle_student" 
                                    id="toggle_student" 
                                    checked={selectedStudent.useGlobal}
                                    onChange={() => setSelectedStudent({...selectedStudent, useGlobal: !selectedStudent.useGlobal})}
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-blue-600"
                                />
                                <label 
                                    htmlFor="toggle_student" 
                                    className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${selectedStudent.useGlobal ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                ></label>
                            </div>
                        </div>

                        {/* Custom Settings - Disabled if Global is checked */}
                        <div className={`space-y-4 transition-all duration-200 ${selectedStudent.useGlobal ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Avisar com antecedência de:</label>
                                <select 
                                    value={selectedStudent.days}
                                    onChange={(e) => setSelectedStudent({...selectedStudent, days: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                                >
                                    <option value="1">1 dia</option>
                                    <option value="3">3 dias</option>
                                    <option value="5">5 dias</option>
                                    <option value="7">1 semana</option>
                                    <option value="15">15 dias</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Canais Específicos</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedStudent.push}
                                            onChange={() => setSelectedStudent({...selectedStudent, push: !selectedStudent.push})}
                                            className="w-4 h-4 text-primary rounded focus:ring-primary dark:bg-surface-darker"
                                        />
                                        <span className="text-sm">Notificação Push (App)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedStudent.email}
                                            onChange={() => setSelectedStudent({...selectedStudent, email: !selectedStudent.email})}
                                            className="w-4 h-4 text-primary rounded focus:ring-primary dark:bg-surface-darker"
                                        />
                                        <span className="text-sm">Email (pais/responsáveis)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setSelectedStudent(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                                Cancelar
                            </button>
                            <button onClick={handleSaveStudentConfig} className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md text-sm">
                                Salvar Preferências
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

       <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <span className="material-icons-round text-primary">checkroom</span>
            <h2 className="text-lg font-bold">Pedidos de Uniforme</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-surface-darker">
                    <tr>
                        <th className="px-4 py-3">Solicitante</th>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3 text-right">Valor</th>
                        <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    <tr>
                        <td className="px-4 py-3">
                            <div className="font-medium">maior</div>
                            <div className="text-xs text-gray-500">Aluno • 12/12/2025</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Combo (Blusa + Calça)</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-500">R$ 110,00</td>
                        <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Entregue</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

       <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <span className="material-icons-round text-purple-500">settings_suggest</span>
                <h2 className="text-lg font-bold">Definir Valor de Avaliação</h2>
            </div>
            <div className="p-5">
                <form onSubmit={handleAddEvalValue} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apelido (Pessoa)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-sm">person</span>
                            </span>
                            <input 
                                type="text" 
                                value={newEval.nickname}
                                onChange={(e) => setNewEval({...newEval, nickname: e.target.value})}
                                placeholder="Ex: Menor, Wolverine..." 
                                className="w-full pl-9 bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" 
                            />
                        </div>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor da Cobrança</label>
                         <input 
                            type="text" 
                            value={newEval.value}
                            onChange={(e) => setNewEval({...newEval, value: e.target.value})}
                            placeholder="R$ 0,00" 
                            className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white" 
                        />
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-md">
                        <span className="material-icons-round">save</span> Salvar Valor
                    </button>
                </form>

                <div className="space-y-2">
                    {evalValues.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-darker rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.colorClass}`}>
                                    <span className="material-icons-round text-sm">person</span>
                                </span>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{item.nickname}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-green-600">{item.value}</span>
                                <button onClick={() => handleDeleteEvalValue(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <span className="material-icons-round text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SECTION: HISTORY */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <span className="material-icons-round text-gray-600 dark:text-gray-400">history</span>
                <h2 className="text-lg font-bold">Histórico de Transações</h2>
            </div>
            
            {/* Filters */}
            <div className="p-4 bg-gray-50 dark:bg-surface-darker border-b border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span className="material-icons-round text-sm">search</span>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar aluno..." 
                        value={filterStudent}
                        onChange={(e) => setFilterStudent(e.target.value)}
                        className="w-full pl-9 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white shadow-sm"
                    />
                </div>
                <div>
                     <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white shadow-sm" 
                    />
                </div>
                <div>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white shadow-sm"
                    >
                        <option value="Todos">Todos os Tipos</option>
                        <option value="Mensalidade">Mensalidade</option>
                        <option value="Uniforme">Uniforme</option>
                        <option value="Evento">Evento</option>
                        <option value="Taxa">Taxa</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-surface-darker">
                        <tr>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Aluno</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3 text-right">Valor</th>
                            <th className="px-4 py-3 text-center">Forma</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{item.date}</td>
                                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{item.student}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                            item.type === 'Mensalidade' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                                            item.type === 'Uniforme' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                                            item.type === 'Evento' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' :
                                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{item.amount}</td>
                                    <td className="px-4 py-3 text-center text-xs text-gray-500">{item.method}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.status === 'Pago' ? (
                                            <span className="material-icons-round text-green-500 text-base">check_circle</span>
                                        ) : (
                                            <span className="material-icons-round text-yellow-500 text-base">pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    Nenhuma transação encontrada com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};