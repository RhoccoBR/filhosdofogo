import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGES = {
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1iPHx7cYsAzOfSuCD9ONN-K8HMOf1Q_X4yi70mHnn50TFJEFBo4Hb8DHQoUkqYXM2K5ztTG9bvdyXH0W_z3gIxlUV2pvTOnzwl2TcsbKYhywlw2L7bNcdb_gHasQPa1ptz5Va0GcV9c-rsreEzdyMCui_auR4ECYQUy0yOQtKxRmnh9dVXBfaX51xysZ8dXxIhI5yISNiBsUTEJlefl-M2gd68HSTE8u9Rl-7gQb3sTxBJfbxq7cw1AevdvxFeptDPPApJiLIEU"
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect based on role from database
        if (data.role === 'admin' || data.role === 'professor') {
          navigate('/app/dashboard');
        } else {
          navigate('/app/student-dashboard');
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-b from-[#EA4420] to-[#b91c1c] px-6 py-10 text-center">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
            >
                <span className="material-icons-round text-2xl">arrow_back</span>
            </button>

            {/* Logo */}
            <div className="mx-auto w-24 h-24 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20 shadow-lg relative">
                 <div className="absolute inset-0 rounded-full border border-white/10"></div>
                 <img 
                    src={IMAGES.logo} 
                    alt="Logo" 
                    className="w-20 h-20 object-contain drop-shadow-md"
                 />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Acesse sua Conta</h1>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                Entre para acessar seu painel personalizado
            </p>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6 bg-[#1E1E1E]">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 pl-1">Seu Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" 
                    className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3.5 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-600" 
                />
            </div>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 pl-1">Sua Senha</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-3.5 outline-none focus:border-[#EA4420] focus:ring-1 focus:ring-[#EA4420] transition-all text-sm placeholder-gray-600 tracking-widest" 
                />
            </div>

            <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#EA4420] hover:bg-[#D13315] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98] mt-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="flex flex-col items-center gap-4 mt-6 text-sm pt-2">
                <button className="text-gray-500 hover:text-gray-300 hover:underline transition-colors decoration-gray-500">
                    Esqueceu sua senha?
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};