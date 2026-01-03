import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Song {
    id: number;
    title: string;
    category: string;
    lyrics: string;
    borderColor: string;
    audioUrl?: string;
    isYoutube?: boolean;
}

const INITIAL_SONGS: Song[] = [
    { 
        id: 1, 
        title: 'Paranauê', 
        category: 'Capoeira Regional', 
        lyrics: 'Vou dizer a minha mulher, Paraná Capoeira que venceu, Paraná...', 
        borderColor: 'border-primary',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Exemplo para teste
    },
    { id: 2, title: 'São Bento Grande', category: 'Toque de Berimbau', lyrics: 'São Bento Grande de Angola, jogo de dentro, jogo de fora...', borderColor: 'border-yellow-500' },
    { id: 3, title: 'Zum Zum Zum', category: 'Cantiga', lyrics: 'Zum zum zum, capoeira mata um...', borderColor: 'border-gray-300 dark:border-gray-600' },
];

const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const CustomAudioPlayer: React.FC<{ url: string }> = ({ url }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onLoadedMetadata = () => {
             setDuration(audio.duration);
        };

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
            setIsMuted(vol === 0);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.volume = volume;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    return (
        <div className="mt-4 bg-gray-50 dark:bg-surface-darker rounded-xl p-3 border border-gray-200 dark:border-gray-700 select-none shadow-sm">
            <audio ref={audioRef} src={url} preload="metadata" />
            
            {/* Top Row: Play & Progress */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md active:scale-95 transition-all flex-shrink-0"
                >
                    <span className="material-icons-round text-2xl ml-0.5">{isPlaying ? 'pause' : 'play_arrow'}</span>
                </button>
                
                <div className="flex-1 flex flex-col justify-center">
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        value={currentTime} 
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#EA4420]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1 px-0.5">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Volume & External Link */}
            <div className="flex items-center justify-between mt-2 pl-1">
                <div className="flex items-center gap-2 group">
                    <button onClick={toggleMute} className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-icons-round text-lg">{isMuted || volume === 0 ? 'volume_off' : 'volume_up'}</span>
                    </button>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={isMuted ? 0 : volume} 
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400 hover:accent-primary transition-colors"
                    />
                </div>
                
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] font-bold text-gray-400 hover:text-primary uppercase flex items-center gap-1 transition-colors" 
                    title="Abrir arquivo original"
                >
                    Abrir <span className="material-icons-round text-xs">open_in_new</span>
                </a>
            </div>
        </div>
    );
};

export const MusicLibrary: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
    
    // Check User Role
    const userRole = location.state?.role || 'STUDENT';
    const canManage = userRole === 'ADMIN' || userRole === 'PROFESSOR';
    
    // Form States
    const [newSong, setNewSong] = useState({ title: '', category: '', lyrics: '', urlInput: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDeleteSong = (e: React.MouseEvent, id: number) => {
         e.stopPropagation(); 
         if (window.confirm("Remover esta música?")) {
            setSongs(songs.filter(s => s.id !== id));
         }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAddSong = () => {
        if (!newSong.title) return;

        let finalAudioUrl = newSong.urlInput;
        let isYoutubeLink = false;

        // If a file was selected, create a local blob URL for it
        if (selectedFile) {
            finalAudioUrl = URL.createObjectURL(selectedFile);
        } else if (finalAudioUrl) {
            // Simple check for YouTube URL
            if (finalAudioUrl.includes('youtube.com') || finalAudioUrl.includes('youtu.be')) {
                isYoutubeLink = true;
            }
        }

        const song: Song = {
            id: Date.now(),
            title: newSong.title,
            category: newSong.category || 'Geral',
            lyrics: newSong.lyrics,
            borderColor: 'border-gray-300 dark:border-gray-600',
            audioUrl: finalAudioUrl,
            isYoutube: isYoutubeLink
        };

        setSongs([song, ...songs]);
        
        // Reset Form
        setNewSong({ title: '', category: '', lyrics: '', urlInput: '' });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const renderMediaPlayer = (url?: string, isYoutube?: boolean) => {
        if (!url) return null;

        if (isYoutube) {
            // Extract Video ID
            let videoId = '';
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                videoId = match[2];
            }

            if (videoId) {
                return (
                    <div className="mt-3 w-full aspect-video rounded-lg overflow-hidden bg-black shadow-sm">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }
        }

        // Custom Audio Player (File or Direct Link)
        return <CustomAudioPlayer url={url} />;
    };

    return (
        <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mb-20`}>
            <header className="flex items-center gap-2 mb-6">
                 <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                    <span className="material-icons-round text-xl">arrow_back</span>
                </button>
                <h1 className="text-lg font-semibold">Voltar</h1>
            </header>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="material-icons-round text-primary text-3xl">library_music</span>
                Acervo Musical
            </h2>
            {!canManage && (
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                    Estude as músicas e toques disponibilizados pelo seu mestre.
                </p>
            )}

            <div className={`grid grid-cols-1 ${canManage ? 'lg:grid-cols-2' : ''} gap-8`}>
                
                {/* Form Section - Only for Admin/Professor */}
                {canManage && (
                    <div className="space-y-6">
                        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-primary">add_circle</span>
                                Adicionar Nova Música
                            </h3>
                            
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Título" 
                                    value={newSong.title}
                                    onChange={e => setNewSong({...newSong, title: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Categoria" 
                                    value={newSong.category}
                                    onChange={e => setNewSong({...newSong, category: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
                                />
                                <textarea 
                                    placeholder="Letra..." 
                                    rows={4} 
                                    value={newSong.lyrics}
                                    onChange={e => setNewSong({...newSong, lyrics: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                                ></textarea>
                            </div>
                            
                            <div className="space-y-4 mt-4">
                                {/* Hidden File Input */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileSelect} 
                                    accept="audio/*" 
                                    className="hidden" 
                                />

                                <div 
                                    onClick={triggerFileInput}
                                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${selectedFile ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-darker hover:bg-gray-50 dark:hover:bg-surface-dark/80'}`}
                                >
                                    <span className={`material-icons-round text-2xl mb-2 transition-colors ${selectedFile ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                                        {selectedFile ? 'audio_file' : 'mic'}
                                    </span>
                                    
                                    {selectedFile ? (
                                        <div className="text-primary font-bold text-sm">
                                            {selectedFile.name}
                                            <p className="text-xs font-normal text-gray-500 mt-1">Clique para trocar</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Carregar Áudio (MP3)</p>
                                            <p className="text-xs text-gray-400">Opcional. Máx 10MB.</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OU Link</span>
                                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-round text-gray-400">link</span>
                                    </div>
                                    <input 
                                        type="url" 
                                        placeholder="Cole uma URL (YouTube, SoundCloud...)" 
                                        value={newSong.urlInput}
                                        onChange={e => setNewSong({...newSong, urlInput: e.target.value})}
                                        disabled={!!selectedFile}
                                        className={`w-full bg-gray-50 dark:bg-surface-darker border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleAddSong}
                                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2"
                            >
                                <span className="material-icons-round">save</span>
                                Salvar no Acervo
                            </button>
                        </div>
                    </div>
                )}

                <div className={`mt-8 lg:mt-0 ${!canManage ? 'max-w-2xl mx-auto w-full' : ''}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="material-icons-round mr-2 text-primary">queue_music</span>
                        Lista de Reprodução
                    </h3>
                    <div className="space-y-4">
                         {songs.map(song => (
                             <div key={song.id} className={`bg-white dark:bg-surface-dark border-l-4 ${song.borderColor} rounded-r-lg shadow-sm p-5 relative group hover:shadow-md transition-all border border-gray-100 dark:border-gray-800`}>
                                <div className="flex justify-between items-start">
                                    <div className="pr-8 w-full">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{song.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-gray-100 dark:bg-surface-darker inline-block px-2 py-0.5 rounded uppercase font-bold tracking-wide">{song.category}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 break-words whitespace-pre-line italic mb-3 opacity-90">"{song.lyrics}"</p>
                                        
                                        {/* Render Dynamic Player */}
                                        {renderMediaPlayer(song.audioUrl, song.isYoutube)}
                                    </div>
                                    {canManage && (
                                        <button 
                                            onClick={(e) => handleDeleteSong(e, song.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                            title="Remover música"
                                        >
                                            <span className="material-icons-round text-xl">delete</span>
                                        </button>
                                    )}
                                </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};