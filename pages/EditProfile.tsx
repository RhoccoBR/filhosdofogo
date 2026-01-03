import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPOEIRA_RANKS } from '../constants';

const IMAGES = {
    // Avatar padrão para demonstração
    defaultAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1iPHx7cYsAzOfSuCD9ONN-K8HMOf1Q_X4yi70mHnn50TFJEFBo4Hb8DHQoUkqYXM2K5ztTG9bvdyXH0W_z3gIxlUV2pvTOnzwl2TcsbKYhywlw2L7bNcdb_gHasQPa1ptz5Va0GcV9c-rsreEzdyMCui_auR4ECYQUy0yOQtKxRmnh9dVXBfaX51xysZ8dXxIhI5yISNiBsUTEJlefl-M2gd68HSTE8u9Rl-7gQb3sTxBJfbxq7cw1AevdvxFeptDPPApJiLIEU"
};

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
    const [avatar, setAvatar] = useState(IMAGES.defaultAvatar);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

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
                <form className="p-6 space-y-4 bg-[#1E1E1E]" onSubmit={(e) => e.preventDefault()}>
                     
                     {/* Nome */}
                     <input 
                        type="text" 
                        placeholder="Nome" 
                        className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                    />

                    {/* Sobrenome */}
                    <input 
                        type="text" 
                        placeholder="Sobrenome" 
                        className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                    />

                    {/* Apelido */}
                    <input 
                        type="text" 
                        placeholder="Apelido (Capoeira)" 
                        className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                    />

                    {/* Data de Nascimento */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Data de Nascimento</label>
                        <input 
                            type="date" 
                            className="w-full bg-[#121212] border border-[#333] text-gray-400 rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm appearance-none" 
                        />
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp (Ex: 5511999999999)</label>
                        <input 
                            type="tel" 
                            placeholder="55DDDNUMERO" 
                            className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-500" 
                        />
                    </div>

                    {/* Graduação */}
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

                    {/* Professor Responsável */}
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
                        <button className="w-full bg-[#EA4420] hover:bg-[#D13315] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                            <span className="material-icons-round text-lg">save</span> Salvar
                        </button>
                     </div>
                </form>
            </div>
        </div>
    );
};