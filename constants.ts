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

    // Detectar tipo da ponta para condicional
    let tipType = '';
    if (tipDescription) {
        if (tipDescription.includes('verde') && tipDescription.includes('amarelo')) tipType = 'verde-amarelo';
        else if (tipDescription.includes('verde')) tipType = 'verde';
        else if (tipDescription.includes('amarelo')) tipType = 'amarelo';
        else if (tipDescription.includes('azul')) tipType = 'azul';
        else if (tipDescription.includes('branco')) tipType = 'branco';
    }

    // --- MESTRES / MESTRANDOS ---

    // Mestrando (Verde, Amarelo, Azul, Branco)
    if (baseRank.includes('mestrando') || (baseRank.includes('verde') && baseRank.includes('amarelo') && baseRank.includes('azul'))) {
        return 'bg-gradient-to-b from-green-600 via-yellow-400 to-blue-600';
    }

    // Cordel Branco (Grão-Mestre) ou Níveis de Mestre (com Branco)
    if (baseRank.includes('branco') && !baseRank.includes('iniciante')) {
        // Mestre III (Azul e Branco)
        if (baseRank.includes('azul')) {
            // Azul com ponta
            if (tipType === 'verde') return 'bg-gradient-to-b from-blue-600 via-white to-green-600';
            if (tipType === 'amarelo') return 'bg-gradient-to-b from-blue-600 via-white to-yellow-400';
            // Padrão Azul e Branco
            return 'bg-gradient-to-b from-blue-600 via-blue-600 to-white'; 
        }
        // Mestre I (Verde e Branco)
        if (baseRank.includes('verde')) {
             return 'bg-gradient-to-b from-green-600 via-green-600 to-white';
        }
        // Mestre II (Amarelo e Branco)
        if (baseRank.includes('amarelo')) {
             return 'bg-gradient-to-b from-yellow-400 via-yellow-400 to-white';
        }
        // Vermelho e Branco (se houver)
        if (baseRank.includes('vermelho')) {
             return 'bg-gradient-to-b from-red-600 via-red-600 to-white';
        }
        
        // Apenas Branco (Grão-Mestre)
        return 'bg-gradient-to-b from-gray-100 via-white to-gray-200';
    }

    // --- CORES DUPLAS (INTERMEDIÁRIAS) ---
    
    // Verde e Amarelo
    if (baseRank.includes('verde') && baseRank.includes('amarelo')) {
        if (tipType === 'azul') return 'bg-gradient-to-b from-green-600 via-yellow-400 to-blue-600';
        if (tipType === 'verde') return 'bg-gradient-to-b from-green-600 via-yellow-400 to-green-600';
        if (tipType === 'amarelo') return 'bg-gradient-to-b from-green-600 via-yellow-400 to-yellow-400';
        return 'bg-gradient-to-b from-green-600 to-yellow-400';
    }

    // Amarelo e Azul
    if (baseRank.includes('amarelo') && baseRank.includes('azul')) {
        if (tipType === 'amarelo') return 'bg-gradient-to-b from-yellow-400 via-blue-600 to-yellow-400';
        if (tipType === 'azul') return 'bg-gradient-to-b from-yellow-400 via-blue-600 to-blue-600';
        return 'bg-gradient-to-b from-yellow-400 to-blue-600';
    }

    // Verde e Azul
    if (baseRank.includes('verde') && baseRank.includes('azul')) {
         return 'bg-gradient-to-b from-green-600 to-blue-600';
    }

    // --- CORES SÓLIDAS (COM PONTAS) ---

    // Verde
    if (baseRank.includes('verde')) {
        if (tipType === 'amarelo') return 'bg-gradient-to-b from-green-600 via-green-600 to-yellow-400';
        if (tipType === 'azul') return 'bg-gradient-to-b from-green-600 via-green-600 to-blue-600';
        return 'bg-gradient-to-b from-green-500 to-green-700';
    }

    // Amarelo
    if (baseRank.includes('amarelo')) {
        if (tipType === 'verde') return 'bg-gradient-to-b from-yellow-400 via-yellow-400 to-green-600';
        if (tipType === 'azul') return 'bg-gradient-to-b from-yellow-400 via-yellow-400 to-blue-600';
        return 'bg-gradient-to-b from-yellow-400 to-yellow-600';
    }

    // Azul
    if (baseRank.includes('azul')) {
        if (tipType === 'verde-amarelo') return 'bg-gradient-to-b from-blue-600 via-blue-600 to-yellow-400'; // Aproximação visual
        if (tipType === 'verde') return 'bg-gradient-to-b from-blue-600 via-blue-600 to-green-600';
        if (tipType === 'amarelo') return 'bg-gradient-to-b from-blue-600 via-blue-600 to-yellow-400';
        return 'bg-gradient-to-b from-blue-500 to-blue-700';
    }

    // Cinza / Iniciante
    if (baseRank.includes('cinza')) return 'bg-gradient-to-b from-gray-400 to-gray-600';

    // Fallback padrão
    return 'bg-gradient-to-b from-gray-500 to-gray-700';
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