import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPOEIRA_RANKS } from '../constants';
import { supabase, DatabaseUser } from '../services/supabase';

const PROFESSORS = [
    "Mestre Anjo de Fogo",
    "Mestre Wolverine",
    "Mestrando ...",
    "Professor Lion",
    "Instrutor Aquiles",
    "Instrutor Zeus"
];

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    
    // Form States
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState(''); // name
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [rank, setRank] = useState('');
    const [professor, setProfessor] = useState('');
    const [email, setEmail] = useState('');

    // Load Data
    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            const localUserStr = localStorage.getItem('fdf_user');
            
            if (!localUserStr) {
                navigate('/login');
                return;
            }

            try {
                const localUser = JSON.parse(localUserStr) as DatabaseUser;
                setUserId(localUser.id);

                // Use local data initially to render fast
                populateForm(localUser);

                // Fetch fresh data from Supabase IF possible
                try {
                    const { data: dbUser, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', localUser.id)
                        .maybeSingle();

                    if (error) {
                        console.warn("Modo Offline (Leitura):", error.message || error);
                    } else if (dbUser) {
                        populateForm(dbUser);
                        // Update local storage silently
                        localStorage.setItem('fdf_user', JSON.stringify(dbUser));
                    }
                } catch (dbErr) {
                    console.warn("Erro de conexão ao buscar perfil (ignorado).");
                }

            } catch (e) {
                console.error("Erro ao processar dados do usuário:", e);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    const populateForm = (user: DatabaseUser) => {
        setAvatar(user.avatar || '');
        setNickname(user.name || '');
        setEmail(user.email || '');
        setRank(user.rank || CAPOEIRA_RANKS[0]);
        
        // Split Real Name
        const fullName = user.real_name || '';
        const nameParts = fullName.split(' ');
        if (nameParts.length > 0) {
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(' '));
        }

        // Optional Fields
        setPhone(user.phone || '');
        setBirthDate(user.birth_date || '');
        setProfessor(user.professor || '');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Em um app real, faríamos upload para Storage aqui.
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            setShowUrlInput(false);
            alert("Nota: Imagem local temporária. Para persistir, use uma URL externa.");
        }
    };

    const updateLocalUser = (updates: any) => {
        const localUserStr = localStorage.getItem('fdf_user');
        if (localUserStr) {
            const currentLocal = JSON.parse(localUserStr);
            const updatedLocal = { ...currentLocal, ...updates };
            localStorage.setItem('fdf_user', JSON.stringify(updatedLocal));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const fullName = `${firstName} ${lastName}`.trim();

        // Dados para salvar
        const userUpdates = {
            name: nickname,
            real_name: fullName,
            rank: rank,
            avatar: avatar,
            phone: phone,
            professor: professor,
            birth_date: birthDate ? birthDate : null, 
        };

        // 1. Atualizar Localmente (Sempre funciona)
        updateLocalUser(userUpdates);

        // 2. Tentar atualizar no Banco
        try {
            if (userId) {
                const { error } = await supabase
                    .from('users')
                    .update(userUpdates)
                    .eq('id', userId);

                if (error) throw error;
                alert("Perfil atualizado e sincronizado com a nuvem!");
            } else {
                alert("Perfil atualizado localmente! (Usuário sem ID de banco)");
            }
            navigate('/app/dashboard');

        } catch (error: any) {
            console.error("Erro ao salvar no banco:", error);
            
            // Tratamento específico para RLS (42501)
            if (error?.code === '42501' || error?.message?.includes('security policy')) {
                alert("Dados salvos no dispositivo! \n(Nota: Sincronização com a nuvem indisponível por permissão, mas você pode continuar usando o app).");
            } else {
                // Parse mensagem legível
                const errorMsg = error?.message || (typeof error === 'string' ? error : 'Erro desconhecido');
                alert(`Salvo localmente. Aviso de sincronização: ${errorMsg}`);
            }
            
            navigate('/app/dashboard');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212] text-gray-500">
                <span className="material-icons-round animate-spin text-4xl mb-2 text-primary">sync</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4 font-sans">
            <div className="w-full max-w-[400px] bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden border border-white/5 animate-fade-in">
                
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-b from-[#EA4420] to-[#b91c1c] px-6 py-8 text-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-icons-round text-2xl">arrow_back</span>
                    </button>

                    <div className="flex flex-col items-center mb-3">
                        <div 
                            className="w-24 h-24 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shadow-lg relative cursor-pointer group overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                    alt="Profile" 
                                />
                            ) : (
                                <span className="material-icons-round text-white text-4xl">person</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-icons-round text-white text-2xl">photo_camera</span>
                            </div>
                        </div>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*" 
                        />
                        
                        <button 
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="text-xs text-white/70 hover:text-white underline mt-2"
                        >
                            {showUrlInput ? 'Cancelar URL' : 'Ou usar link de imagem'}
                        </button>
                        
                        {showUrlInput && (
                            <input 
                                type="text" 
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="Cole o link da imagem (https://...)"
                                className="mt-2 w-full max-w-[250px] bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/50 focus:bg-black/30 transition-all"
                                autoFocus
                            />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Editar Perfil</h1>
                    <p className="text-white/80 text-sm font-medium">{email}</p>
                </div>
                
                {/* Form Section */}
                <form className="p-6 space-y-4 bg-[#1E1E1E]" onSubmit={handleSave}>
                     
                     <div className="grid grid-cols-2 gap-3">
                         {/* Nome */}
                         <input 
                            type="text" 
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="Nome" 
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />

                        {/* Sobrenome */}
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Sobrenome" 
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />
                     </div>

                    {/* Apelido */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Apelido (Nome na Capoeira)</label>
                        <input 
                            type="text" 
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="Apelido" 
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Data de Nascimento</label>
                        <input 
                            type="date" 
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none min-h-[46px]" 
                        />
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="(11) 99999-9999" 
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />
                    </div>

                    {/* Graduação */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Cordel / Graduação</label>
                        <div className="relative">
                            <select 
                                value={rank}
                                onChange={e => setRank(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none"
                            >
                                {CAPOEIRA_RANKS.map((r, index) => (
                                    <option key={index} value={r}>{r}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-3.5 pointer-events-none material-icons-round text-gray-500 text-lg">expand_more</span>
                        </div>
                    </div>

                    {/* Professor Responsável */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Professor Responsável</label>
                        <div className="relative">
                            <select 
                                value={professor}
                                onChange={e => setProfessor(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none"
                            >
                                <option value="">Selecione seu professor</option>
                                {PROFESSORS.map((prof, index) => (
                                    <option key={index} value={prof}>{prof}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-3.5 pointer-events-none material-icons-round text-gray-500 text-lg">expand_more</span>
                        </div>
                    </div>
                     
                     <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#EA4420] hover:bg-[#D13315] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="material-icons-round animate-spin text-lg">sync</span>
                            ) : (
                                <span className="material-icons-round text-lg">save</span>
                            )}
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                     </div>
                </form>
            </div>
        </div>
    );
};