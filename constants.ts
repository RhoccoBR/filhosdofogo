// URL da Logo do App - Altere aqui para atualizar em todo o sistema
export const APP_LOGO = "https://i.imgur.com/5bEqYYA.png";

export const CAPOEIRA_RANKS = [
    "Cordel Cinza (Iniciante)",
    "Cordel Verde",
    "Cordel Verde ponta Amarelo",
    "Cordel Verde ponta Azul",
    "Cordel Verde e Amarelo",
    "Cordel Verde e Amarelo ponta Verde",
    "Cordel Verde e Amarelo ponta Amarelo",
    "Cordel Verde e Amarelo ponta Azul",
    "Cordel Amarelo",
    "Cordel Amarelo ponta Verde",
    "Cordel Amarelo ponta Azul",
    "Cordel Amarelo e Azul (Instrutor)",
    "Cordel Amarelo e Azul ponta Amarelo (Instrutor I)",
    "Cordel Amarelo e Azul ponta Azul (Instrutor II)",
    "Cordel Azul (Professor)",
    "Cordel Azul ponta Verde e Amarelo (Professor I)",
    "Cordel Verde, Amarelo, Azul e Branco (Mestrando)",
    "Cordel Verde e Branco (Mestre I)",
    "Cordel Amarelo e Branco (Mestre II)",
    "Cordel Azul e Branco (Mestre III)",
    "Cordel Branco (Grão-Mestre)"
];

export const getRankGradient = (rankName: string): string => {
    const lower = rankName.toLowerCase();
    
    // Separamos a string em "Base" e "Ponta"
    const parts = lower.split('ponta');
    const baseRank = parts[0].trim();
    const tipDescription = parts.length > 1 ? parts[1].trim() : '';

    // Se tiver pontinha (parte inferior)
    if (tipDescription) {
        let tipColor = 'from-gray-500 to-gray-700';
        if (tipDescription.includes('verde')) tipColor = 'from-green-600 to-green-600';
        else if (tipDescription.includes('amarelo')) tipColor = 'from-yellow-400 to-yellow-400';
        else if (tipDescription.includes('azul')) tipColor = 'from-blue-600 to-blue-600';
        else if (tipDescription.includes('branco')) tipColor = 'from-white to-white';
        
        return tipColor; // Retornamos a cor da ponta para a tarja inferior
    }

    // --- MESTRES / MESTRANDOS ---
    if (baseRank.includes('mestrando') || (baseRank.includes('verde') && baseRank.includes('amarelo') && baseRank.includes('azul'))) {
        return 'bg-gradient-to-b from-green-600 via-yellow-400 to-blue-600';
    }

    // --- CORES DUPLAS (INTERMEDIÁRIAS) - 50/50 ---
    if (baseRank.includes('verde') && baseRank.includes('amarelo')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-yellow-400 to-50%';
    }
    if (baseRank.includes('amarelo') && baseRank.includes('azul')) {
        return 'bg-gradient-to-b from-yellow-400 from-50% to-blue-600 to-50%';
    }
    if (baseRank.includes('verde') && baseRank.includes('azul')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-blue-600 to-50%';
    }
    if (baseRank.includes('azul') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-blue-600 from-50% to-white to-50%';
    }
    if (baseRank.includes('verde') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-white to-50%';
    }
    if (baseRank.includes('amarelo') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-yellow-400 from-50% to-white to-50%';
    }

    // --- CORES SÓLIDAS ---
    if (baseRank.includes('verde')) return 'bg-green-600';
    if (baseRank.includes('amarelo')) return 'bg-yellow-400';
    if (baseRank.includes('azul')) return 'bg-blue-600';
    if (baseRank.includes('cinza')) return 'bg-gray-400';
    if (baseRank.includes('branco')) return 'bg-white';

    return 'bg-gray-500';
};

// Nova função para pegar apenas a cor da base (parte de cima)
export const getBaseRankGradient = (rankName: string): string => {
    const lower = rankName.toLowerCase();
    const parts = lower.split('ponta');
    const baseRank = parts[0].trim();

    if (baseRank.includes('verde') && baseRank.includes('amarelo')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-yellow-400 to-50%';
    }
    if (baseRank.includes('amarelo') && baseRank.includes('azul')) {
        return 'bg-gradient-to-b from-yellow-400 from-50% to-blue-600 to-50%';
    }
    if (baseRank.includes('verde') && baseRank.includes('azul')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-blue-600 to-50%';
    }
    if (baseRank.includes('azul') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-blue-600 from-50% to-white to-50%';
    }
    if (baseRank.includes('verde') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-green-600 from-50% to-white to-50%';
    }
    if (baseRank.includes('amarelo') && baseRank.includes('branco')) {
        return 'bg-gradient-to-b from-yellow-400 from-50% to-white to-50%';
    }
    
    if (baseRank.includes('verde')) return 'bg-green-600';
    if (baseRank.includes('amarelo')) return 'bg-yellow-400';
    if (baseRank.includes('azul')) return 'bg-blue-600';
    if (baseRank.includes('cinza')) return 'bg-gray-400';
    if (baseRank.includes('branco')) return 'bg-white';
    
    return 'bg-gray-500';
};

export const getRankTextColor = (rankName: string): string => {
    const lower = rankName.toLowerCase();
    if (lower.includes('vermelho')) return 'text-red-600';
    if (lower.includes('azul')) return 'text-blue-600';
    if (lower.includes('verde')) return 'text-green-600';
    if (lower.includes('amarelo')) return 'text-yellow-600';
    if (lower.includes('cinza')) return 'text-gray-500';
    return 'text-gray-600 dark:text-gray-400';
};