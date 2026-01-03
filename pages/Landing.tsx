import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_LOGO } from '../constants';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-gray-100 font-sans selection:bg-orange-500/30">
      
      {/* Styles for Custom Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-600/50">
                <img src={APP_LOGO} alt="Logo Pequeno" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                Filhos do Fogo
            </span>
        </div>
        <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded bg-primary hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-orange-900/20"
        >
            Entrar
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden">
        {/* Background Glow - Pulsing Fire Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse"></div>

        {/* Main Logo with Floating Effect */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8 animate-float transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_35px_rgba(234,68,32,0.6)] cursor-pointer group">
            {/* Inner Glow to accentuate logo shape */}
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>
            <img 
                src={APP_LOGO} 
                alt="Grupo de Capoeira Filhos do Fogo" 
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
            />
        </div>

        {/* Slogan */}
        <h2 className="text-xl sm:text-2xl text-gray-300 font-medium mb-10 tracking-wide">
            Humildade, Disciplina e União
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center relative z-10">
            <button 
                onClick={() => navigate('/login')}
                className="bg-primary hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-orange-900/30 transition-transform active:scale-95 flex-1"
            >
                Área do Aluno
            </button>
            <button 
                onClick={() => window.open('https://www.instagram.com/filhosdofogo2005/#', '_blank')}
                className="bg-transparent border border-orange-600/50 hover:border-orange-500 text-orange-500 hover:text-orange-400 font-bold py-3.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 flex-1"
            >
                <span className="material-icons-round text-lg">photo_camera</span>
                Siga no Instagram
            </button>
        </div>
      </main>

      {/* Features Section (Nossa Essência) */}
      <section className="bg-[#181818] border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-2">Nossa Essência</h3>
                <div className="h-1 w-12 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Comunidade */}
                <div className="bg-[#1E1E1E] p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 mb-4 group-hover:text-primary transition-colors mx-auto">
                        <span className="material-icons-round text-2xl">groups</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 text-center">Comunidade</h4>
                    <p className="text-sm text-gray-400 text-center leading-relaxed">
                        Um ambiente acolhedor onde todos se ajudam a crescer, respeitando a Hierarquia e a Individualidade de cada capoeirista.
                    </p>
                </div>

                {/* Card 2: Aulas */}
                <div className="bg-[#1E1E1E] p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 mb-4 group-hover:text-primary transition-colors mx-auto">
                        <span className="material-icons-round text-2xl">calendar_month</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 text-center">Aulas Diárias</h4>
                    <p className="text-sm text-gray-400 text-center leading-relaxed">
                        Treinos técnicos, físicos, teóricos e musicais. Horários flexíveis para todos os níveis de graduação, do iniciante ao avançado.
                    </p>
                </div>

                {/* Card 3: Eventos */}
                <div className="bg-[#1E1E1E] p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 mb-4 group-hover:text-primary transition-colors mx-auto">
                        <span className="material-icons-round text-2xl">location_on</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 text-center">Eventos</h4>
                    <p className="text-sm text-gray-400 text-center leading-relaxed">
                        Participação em batizados, eventos e intercâmbios constantes com outros grupos do Brasil e do Mundo.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};