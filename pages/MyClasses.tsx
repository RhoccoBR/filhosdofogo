import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const MyClasses: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Attendance Modal State
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [attendanceList, setAttendanceList] = useState<AttendanceStudent[]>(MOCK_ATTENDANCE_LIST);
    const [selectedClassForAttendance, setSelectedClassForAttendance] = useState('');

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Here you would typically upload the file to a server
            alert(`Foto "${file.name}" registrada com sucesso!`);
            // Reset the input so the same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
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

    return (
        <div className="space-y-6">
             <div className="flex overflow-x-auto gap-3 py-1 hide-scrollbar">
                <button onClick={() => navigate('/app/grades')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-icons-round text-green-500">assessment</span>
                    <span className="text-sm font-medium">Notas</span>
                </button>
                <button onClick={() => navigate('/app/music', { state: { role: 'PROFESSOR' } })} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-icons-round text-yellow-500">music_note</span>
                    <span className="text-sm font-medium">Músicas</span>
                </button>
                <button onClick={() => navigate('/app/works')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-icons-round text-blue-400">book</span>
                    <span className="text-sm font-medium">Trabalhos</span>
                </button>
                <button onClick={() => navigate('/app/create-class')} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white shadow-md hover:bg-primary-hover transition-colors">
                    <span className="material-icons-round">add_circle</span>
                    <span className="text-sm font-medium">Nova Aula</span>
                </button>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-icons-round text-purple-500">cloud_upload</span>
                    <h2 className="text-lg font-bold">Registro de Aula</h2>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-surface-darker p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    <span className="material-icons-round text-3xl mb-2 text-purple-500">photo_camera</span>
                    <span className="text-purple-500 font-medium text-sm">Enviar Foto</span>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Minhas Aulas</h2>
                <div className="bg-gray-50 dark:bg-surface-darker rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                    <div className="p-4 pl-5">
                        <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Próxima Aula</p>
                        <p className="text-sm font-medium mb-4">2025-12-29 - 16:00 - Filial Argentina</p>
                        <button 
                            onClick={() => openAttendance('Filial Argentina - 16:00')}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg shadow-lg"
                        >
                            Realizar Chamada
                        </button>
                    </div>
                </div>
            </div>

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