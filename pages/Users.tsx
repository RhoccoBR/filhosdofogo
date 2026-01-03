import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAPOEIRA_RANKS } from '../constants';
import { supabase, DatabaseUser } from '../services/supabase';
import { OFFICIAL_USERS_LIST } from '../services/officialData';

// Valor padrão para formulário
const DEFAULT_FORM: DatabaseUser = {
    name: '',
    real_name: '',
    email: '',
    rank: CAPOEIRA_RANKS[0],
    role: 'STUDENT',
    avatar: ''
};

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DatabaseUser>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  
  // Avatar Upload State
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SUPABASE INTEGRATION ---

  // 1. Fetch Users (READ)
  const fetchUsers = async () => {
      setLoading(true);
      try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('id', { ascending: false });
          
          if (error) throw error;
          if (data) setUsers(data as DatabaseUser[]);
      } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          alert("Erro ao conectar com o banco de dados. Verifique as chaves no arquivo services/supabase.ts");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  // 2. Import Official List Logic
  const handleImportOfficialList = async () => {
      if (!window.confirm("Isso adicionará a lista oficial de Admins e Professores ao banco de dados se eles ainda não existirem (baseado no email). Deseja continuar?")) {
          return;
      }

      setImporting(true);
      let addedCount = 0;
      let skippedCount = 0;

      try {
          for (const officialUser of OFFICIAL_USERS_LIST) {
              // Verifica se já existe pelo email
              const { data: existing } = await supabase
                  .from('users')
                  .select('id')
                  .eq('email', officialUser.email)
                  .single();

              if (!existing) {
                  const { error } = await supabase.from('users').insert([officialUser]);
                  if (error) {
                      console.error(`Erro ao adicionar ${officialUser.name}:`, error);
                  } else {
                      addedCount++;
                  }
              } else {
                  skippedCount++;
              }
          }
          
          alert(`Importação concluída!\nAdicionados: ${addedCount}\nJá existentes (ignorados): ${skippedCount}`);
          fetchUsers(); // Atualiza a lista na tela

      } catch (error) {
          console.error("Erro na importação:", error);
          alert("Ocorreu um erro durante a importação.");
      } finally {
          setImporting(false);
      }
  };

  // 3. Filter Logic (Client side for better performance on small lists)
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.real_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // 4. Handlers Actions
  const handleDelete = async (id?: number) => {
      if (!id) return;
      if (window.confirm("Tem certeza que deseja remover este usuário do banco de dados?")) {
          const { error } = await supabase.from('users').delete().eq('id', id);
          if (error) {
              alert("Erro ao deletar usuário");
          } else {
              setUsers(users.filter(u => u.id !== id));
          }
      }
  };

  const handleEdit = (user: DatabaseUser) => {
      setFormData({
          id: user.id,
          name: user.name,
          real_name: user.real_name,
          email: user.email,
          rank: user.rank,
          role: user.role,
          avatar: user.avatar
      });
      setPreviewAvatar(user.avatar || null);
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
          // Nota: Em uma app real, você faria upload para o Supabase Storage aqui.
          // Para simplificar, estamos usando URL local temporária ou um placeholder.
          const imageUrl = URL.createObjectURL(file);
          setPreviewAvatar(imageUrl);
      }
  };

  // 5. Submit (CREATE or UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const userAvatar = previewAvatar || `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=random&color=fff`;
      
      const payload = {
          name: formData.name,
          real_name: formData.real_name,
          email: formData.email,
          rank: formData.rank,
          role: formData.role,
          avatar: userAvatar
      };

      if (isEditing && formData.id) {
          // Update
          const { error } = await supabase
            .from('users')
            .update(payload)
            .eq('id', formData.id);
            
          if (error) alert("Erro ao atualizar: " + error.message);
          else {
              fetchUsers(); // Refresh list
              setIsModalOpen(false);
          }
      } else {
          // Create
          const { error } = await supabase
            .from('users')
            .insert([payload]);

          if (error) alert("Erro ao criar: " + error.message);
          else {
              fetchUsers(); // Refresh list
              setIsModalOpen(false);
          }
      }
  };

  return (
    <div className="space-y-6 pb-24 relative">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-icons-round text-pink-500">manage_accounts</span>
                    Gerenciar Usuários
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-bold">
                        {users.length} Total
                    </span>
                </p>
            </div>
            
            {/* Import Button */}
            <button 
                onClick={handleImportOfficialList}
                disabled={importing}
                className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-bold text-xs shadow-md transition-all ${importing ? 'cursor-wait' : ''}`}
            >
                {importing ? (
                    <span className="material-icons-round animate-spin text-sm">refresh</span>
                ) : (
                    <span className="material-icons-round text-sm">cloud_download</span>
                )}
                {importing ? 'Importando...' : 'Importar Lista Oficial'}
            </button>
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
            {loading ? (
                <div className="text-center py-10 text-gray-400 animate-pulse">
                    <span className="material-icons-round text-4xl mb-2 animate-spin">sync</span>
                    <p>Carregando banco de dados...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <span className="material-icons-round text-4xl mb-2 opacity-30">search_off</span>
                    <p>Nenhum usuário encontrado no banco de dados.</p>
                </div>
            ) : (
                filteredUsers.map(user => (
                    <div key={user.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${user.role === 'ADMIN' ? 'bg-red-600' : user.role === 'PROFESSOR' ? 'bg-purple-600' : 'bg-blue-500'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4 pl-2">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="h-12 w-12 rounded-full object-cover border-2 border-surface-light dark:border-surface-dark shadow-sm bg-gray-200" />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500">{user.real_name}</p>
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
                                        value={formData.real_name}
                                        onChange={(e) => setFormData({...formData, real_name: e.target.value})}
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
                                            onClick={() => setFormData({...formData, role: role.id as any})}
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