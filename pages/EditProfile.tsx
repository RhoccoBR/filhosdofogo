import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPOEIRA_RANKS } from '../constants';

const IMAGES = {
    defaultAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1iPHx7cYsAzOfSuCD9ONN-K8HMOf1Q_X4yi70mHnn50TFJEFBo4Hb8DHQoUkqYXM2K5ztTG9bvdyXH0W_z3gIxlUV2pvTOnzwl2TcsbKYhywlw2L7bNcdb_gHasQPa1ptz5Va0GcV9c-rsreEzdyMCui_auR4ECYQUy0yOQtKxRmnh9dVXBfaX51xysZ8dXxIhI5yISNiBsUTEJlefl-M2gd68HSTE8u9Rl-7gQb3sTxBJfbxq7cw1AevdvxFeptDPPApJiLIEU"
};

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        nickname: '',
        phone: '',
        address: '',
        bio: '',
        profile_picture_url: IMAGES.defaultAvatar
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData({
                id: user.id || '',
                name: user.name || '',
                nickname: user.nickname || '',
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
                profile_picture_url: user.profile_picture_url || IMAGES.defaultAvatar
            });
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_picture_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                window.dispatchEvent(new Event('storage'));
                setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
                setTimeout(() => navigate('/app/dashboard'), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Erro ao atualizar perfil' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão com o servidor' });
        } finally {
            setLoading(false);
        }
    };

    const [avatar, setAvatar] = useState(formData.profile_picture_url || IMAGES.defaultAvatar);

    useEffect(() => {
        setAvatar(formData.profile_picture_url || IMAGES.defaultAvatar);
    }, [formData.profile_picture_url]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatar(base64String);
                setFormData(prev => ({ ...prev, profile_picture_url: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const PROFESSORS = [
        "Mestre Anjo de Fogo",
        "Mestre Wolverine",
        "Mestrando ...",
        "Professor Lion",
        "Instrutor Aquiles",
        "Instrutor Zeus"
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4 font-sans">
            <div className="w-full max-w-[400px] bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
                
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-b from-[#EA4420] to-[#b91c1c] px-6 py-8 text-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-icons-round text-2xl">arrow_back</span>
                    </button>

                    <div 
                        className="mx-auto w-24 h-24 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center mb-3 border-2 border-white/20 shadow-lg relative cursor-pointer group overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                         <img 
                            src={avatar} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            alt="Profile" 
                        />
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

                    <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Editar Perfil</h1>
                    <p className="text-white/80 text-sm font-medium">Toque na foto para alterar</p>
                </div>
                
                {/* Form Section */}
                <form className="p-6 space-y-4 bg-[#1E1E1E]" onSubmit={handleSubmit}>
                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/50' : 'bg-red-500/10 text-red-500 border border-red-500/50'}`}>
                            {message.text}
                        </div>
                    )}
                     
                     {/* Nome */}
                     <input 
                        type="text" 
                        placeholder="Nome" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        required
                    />

                    {/* Apelido */}
                    <input 
                        type="text" 
                        placeholder="Apelido (Capoeira)" 
                        value={formData.nickname}
                        onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                        className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                    />

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp (Ex: 5511999999999)</label>
                        <input 
                            type="tel" 
                            placeholder="55DDDNUMERO" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />
                    </div>

                    {/* Graduação (Apenas visual conforme original) */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Cordel / Graduação</label>
                        <div className="relative">
                            <select className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none">
                                <option value="">Cordel Cinza</option>
                                {CAPOEIRA_RANKS.map((rank, index) => (
                                    <option key={index} value={rank}>{rank}</option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-3.5 pointer-events-none material-icons-round text-gray-500 text-lg">expand_more</span>
                        </div>
                    </div>

                    {/* Professor Responsável (Apenas visual conforme original) */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Professor Responsável</label>
                        <div className="relative">
                            <select className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none">
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
                            disabled={loading}
                            className="w-full bg-[#EA4420] hover:bg-[#D13315] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-icons-round text-lg">{loading ? 'sync' : 'save'}</span> 
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                     </div>
                </form>
            </div>
        </div>
    );
};