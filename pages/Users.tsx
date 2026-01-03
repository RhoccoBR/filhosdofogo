import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPOEIRA_RANKS } from '../constants';

// Mock Initial Data
const INITIAL_USERS = [
    {
        id: 1,
        name: "Anjo de Fogo",
        realName: "Marcos Antonio Soares",
        email: "marcos@email.com",
        rank: "Cordel Azul e Branco (Mestre III)",
        role: "ADMIN",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLzx2hIk4vr2-CEl6NORrBasPVq33rAE6ux2udwsWKZ_Dd7AJfZefX9jYbg0Rkf2J7Hsj9lbUrzhMniCMC7OwyHS76us9ekMofPVm6FiF1_ylG-lQLX6hzl-utknsYTyBzr7Xl08YiA4tmK41YSrln7K6Ct-eQ5CV4sN3nuQ6pSbx1SZ0GNNu36TzK867FXn35yhT1QXXNna8mAyfCjyvL6Uh4ZkCaGbwGnoWt1xpvG68jxtsRyyGNv8csZoklZPQFLUMbWUo2THk",
    },
    {
        id: 2,
        name: "Wolverine",
        realName: "Adriano de Freitas",
        email: "adriano@email.com",
        rank: "Cordel Verde e Branco (Mestre I)",
        role: "ADMIN",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHz94nMRkGVt-Wmz0jYgnAJrJPG2Q9eIWgQ8B5wCKXMDYoDVqWy59-QmIdYj2NJ4_T_eG-wAeqym3oVr_K8uFZzAgdBMgUaw3Oe70AB0VIJNDKvR33deKW00slPax3YbW_CDSDeBBXfhKuTrYALsftKzIoY0D17dnDtaEuZoS8wSprHJvuxhKEZu5LpPu1WZol8GOip9wQb-dRBoVGTDFr7MXHE-VmoZMznj0c1ENkmKosAKTEnlONJFnhQ8DMarg5HsyQW6uBfe8",
    },
    {
        id: 3,
        name: "Zeus",
        realName: "Jefferson dos Santos",
        email: "jefferson@email.com",
        rank: "Cordel Amarelo e Azul (Instrutor)",
        role: "PROFESSOR",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCABU_9z4Hhlu1-_kENghwAQs_U2NisYfVABZvKbE24wQ8HHWUq_dA_NtYzYafSkU_R03DgAySrqO8IcvqxN8nHrzqT2OuW4x5LW5X5d3RLlQu0vTbsTYAhoS-IFYjg5UveUXBX8NX1Ow885hujLPbFrBaXrqcvuwFIsHt9e4rL0T2mmtGNGF-Oo7B552yGcQPfusRULd32AMef0AT03BuLGpdBLBT-qu71Jr7Ys0K1ithTHb_ZCTnYXm1KQGbYOeI5HFLm9IWBrYk",
    },
    {
        id: 4,
        name: "Menor",
        realName: "Menor Teste",
        email: "menor@email.com",
        rank: "Cordel Verde e Amarelo",
        role: "STUDENT",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk1AfptQ28cUm3y0Vu2Mj3k-4qcv_pM4xEKppEp2awACmXxfd3Eez1_-k7wY5Xy6uIVPFInE5DNw_XzAbp_lhHXExzzZUh76pe0nR7JTettpEMLWW2iRwAd-bCcwsABkw1LFGajMW6y3619gLjyM5DtkQcXRgu138g32h0CnyoQCh7WU8xpwxefZAQtrSd3XowsRtJUKTNEz2_ArDvR4ADT4zShfiIMw8hL7ujnOrrNwAcWycOMSGOmqThmndOCVZzvWhT5db_ufI",
    }
];

interface UserFormState {
    id?: number;
    name: string;
    realName: string;
    email: string;
    rank: string;
    role: string;
}

const DEFAULT_FORM: UserFormState = {
    name: '',
    realName: '',
    email: '',
    rank: CAPOEIRA_RANKS[0],
    role: 'STUDENT'
};

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormState>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  
  // Avatar Upload State
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Handlers
  const handleDelete = (id: number) => {
      if (window.confirm("Tem certeza que deseja remover este usuário?")) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const handleEdit = (user: typeof INITIAL_USERS[0]) => {
      setFormData({
          id: user.id,
          name: user.name,
          realName: user.realName,
          email: user.email,
          rank: user.rank,
          role: user.role
      });
      setPreviewAvatar(user.avatar);
      setIsEditing(true);
      setIsModalOpen(true);
  };

  const handleAddNew = () => {
      setFormData(DEFAULT_FORM);
      setPreviewAvatar(null);
      setIsEditing(false);
      setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          setPreviewAvatar(imageUrl);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const userAvatar = previewAvatar || `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=random&color=fff`;

      if (isEditing && formData.id) {
          // Update existing
          setUsers(users.map(u => u.id === formData.id ? { ...u, ...formData, avatar: userAvatar } : u));
      } else {
          // Add new
          const newUser = {
              ...formData,
              id: Date.now(),
              avatar: userAvatar
          };
          setUsers([newUser, ...users]);
      }
      setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 relative">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="material-icons-round text-pink-500">manage_accounts</span>
                Gerenciar Usuários
            </h1>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                {users.length} Total
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round">search</span>
            </span>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm" 
                placeholder="Buscar por nome, apelido ou email..."
            />
        </div>

        {/* User List */}
        <div className="space-y-4">
            {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <span className="material-icons-round text-4xl mb-2 opacity-30">search_off</span>
                    <p>Nenhum usuário encontrado.</p>
                </div>
            ) : (
                filteredUsers.map(user => (
                    <div key={user.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${user.role === 'ADMIN' ? 'bg-red-600' : user.role === 'PROFESSOR' ? 'bg-purple-600' : 'bg-blue-500'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4 pl-2">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover border-2 border-surface-light dark:border-surface-dark shadow-sm bg-gray-200" />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500">{user.realName}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                                user.role === 'ADMIN' ? 'bg-red-500/10 text-red-600' : 
                                user.role === 'PROFESSOR' ? 'bg-purple-500/10 text-purple-600' : 
                                'bg-blue-500/10 text-blue-600'
                            }`}>
                                {user.role === 'STUDENT' ? 'Aluno' : user.role === 'PROFESSOR' ? 'Professor' : 'Admin'}
                            </span>
                        </div>

                        <div className="pl-2 space-y-3 mb-4">
                            <div className="flex items-start gap-2">
                                <span className="material-icons-round text-gray-400 text-sm mt-0.5">military_tech</span>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold">{user.rank}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1 overflow-hidden">
                                    <span className="material-icons-round text-[14px]">email</span> 
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pl-2">
                            <button 
                                onClick={() => handleEdit(user)}
                                className="flex-1 flex items-center justify-center gap-1 bg-gray-100 dark:bg-surface-darker hover:bg-gray-200 dark:hover:bg-gray-700 py-2 rounded-lg text-sm transition-colors border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                <span className="material-icons-round text-sm">edit</span> Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(user.id)}
                                className="w-10 flex items-center justify-center bg-gray-100 dark:bg-surface-darker hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                <span className="material-icons-round text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Floating Action Button */}
        <button 
            onClick={handleAddNew}
            className="fixed bottom-20 sm:bottom-6 right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg hover:bg-orange-600 flex items-center justify-center z-40 active:scale-90 transition-transform shadow-orange-500/30"
        >
            <span className="material-icons-round text-2xl">add</span>
        </button>

        {/* MODAL - ADD/EDIT USER */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker shrink-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons-round text-primary">{isEditing ? 'edit' : 'person_add'}</span>
                            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-icons-round">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 shadow-lg">
                                    {previewAvatar ? (
                                        <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="material-icons-round text-4xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-surface-dark flex items-center justify-center transition-transform group-hover:scale-110">
                                    <span className="material-icons-round text-sm">photo_camera</span>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Apelido (Capoeira)</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="Ex: Anjo de Fogo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.realName}
                                        onChange={(e) => setFormData({...formData, realName: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="Ex: João da Silva"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nível de Acesso</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'STUDENT', label: 'Aluno', icon: 'school' },
                                        { id: 'PROFESSOR', label: 'Prof.', icon: 'sports_martial_arts' },
                                        { id: 'ADMIN', label: 'Admin', icon: 'security' }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, role: role.id})}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                                formData.role === role.id 
                                                ? 'bg-primary/10 border-primary text-primary' 
                                                : 'bg-white dark:bg-surface-darker border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <span className="material-icons-round text-lg mb-1">{role.icon}</span>
                                            <span className="text-xs font-bold">{role.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Graduação</label>
                                <div className="relative">
                                    <select 
                                        value={formData.rank}
                                        onChange={(e) => setFormData({...formData, rank: e.target.value})}
                                        className="w-full appearance-none bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        {CAPOEIRA_RANKS.map((rank, index) => (
                                            <option key={index} value={rank}>{rank}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-3 top-3 pointer-events-none material-icons-round text-gray-400 text-lg">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round text-sm">save</span>
                                Salvar Usuário
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};