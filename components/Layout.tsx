import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { DatabaseUser } from '../services/supabase';
import { APP_LOGO } from '../constants';

const IMAGES = {
    defaultAvatar: "https://ui-avatars.com/api/?name=User&background=random"
};

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'class' | 'financial' | 'assignment' | 'info';
    timestamp: Date;
    read: boolean;
}

const LANGUAGES = [
    { code: 'PT', label: 'Português', flag: '🇧🇷' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'EN', label: 'English', flag: '🇺🇸' }
];

const TRANSLATIONS = {
    PT: {
        dashboard: 'Visão',
        events: 'Eventos',
        users: 'Usuários',
        financial: 'Finanças',
        classes: 'Aulas',
        reminders: 'Lembretes',
        details: 'Detalhes',
        notifications: 'Notificações',
        markAllRead: 'Marcar todas como lidas',
        noNotifications: 'Nenhuma notificação.',
        activate: 'Ativar Notificações',
        permissionText: 'Ative as notificações para receber alertas de aulas e pagamentos.',
        backToDashboard: 'Voltar para a Tela Principal'
    },
    ES: {
        dashboard: 'Vista',
        events: 'Eventos',
        users: 'Usuarios',
        financial: 'Finanzas',
        classes: 'Clases',
        reminders: 'Avisos',
        details: 'Detalles',
        notifications: 'Notificaciones',
        markAllRead: 'Marcar todas como leídas',
        noNotifications: 'Sin notificaciones.',
        activate: 'Activar Notificaciones',
        permissionText: 'Active las notificaciones para recibir alertas de clases y pagos.',
        backToDashboard: 'Volver al Panel Principal'
    },
    EN: {
        dashboard: 'Overview',
        events: 'Events',
        users: 'Users',
        financial: 'Finance',
        classes: 'Classes',
        reminders: 'Reminders',
        details: 'Details',
        notifications: 'Notifications',
        markAllRead: 'Mark all as read',
        noNotifications: 'No notifications.',
        activate: 'Enable Notifications',
        permissionText: 'Enable notifications to receive class and payment alerts.',
        backToDashboard: 'Back to Dashboard'
    }
};

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<DatabaseUser | null>(null);
  
  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Language State
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  // Check Login Status on Mount
  useEffect(() => {
      const storedUser = localStorage.getItem('fdf_user');
      if (storedUser) {
          try {
              setCurrentUser(JSON.parse(storedUser));
          } catch (e) {
              console.error("Invalid user data");
          }
      } else {
          // Se não estiver logado e tentar acessar /app, redireciona
          navigate('/login');
      }
  }, [navigate]);

  const handleLogout = () => {
      if(window.confirm("Deseja realmente sair?")) {
          localStorage.removeItem('fdf_user');
          navigate('/login');
      }
  };

  // Derived Translations
  const t = TRANSLATIONS[currentLang.code as keyof typeof TRANSLATIONS];

  const navItems = useMemo(() => {
      // Base items
      const items = [
        { id: 'dashboard', icon: 'dashboard', label: t.dashboard, path: '/app/dashboard' },
        { id: 'events', icon: 'event', label: t.events, path: '/app/events' },
      ];

      // Role Based Items (Simplified logic for mobile bar)
      if (currentUser?.role === 'ADMIN') {
          items.push({ id: 'users', icon: 'manage_accounts', label: t.users, path: '/app/users' });
          items.push({ id: 'financial', icon: 'attach_money', label: t.financial, path: '/app/financial' });
      } else if (currentUser?.role === 'PROFESSOR') {
          items.push({ id: 'classes', icon: 'fitness_center', label: t.classes, path: '/app/classes' });
          items.push({ id: 'financial', icon: 'attach_money', label: t.financial, path: '/app/financial' });
      } else {
          // Student
          items.push({ id: 'financial', icon: 'attach_money', label: t.financial, path: '/app/financial' });
          items.push({ id: 'classes', icon: 'fitness_center', label: t.classes, path: '/app/training' });
      }

      return items;
  }, [t, currentUser]);

  // Initialize Notifications & Mock Data
  useEffect(() => {
    // Initial mocked notification
    const initialData: NotificationItem[] = [
        {
            id: 'init-1',
            title: 'Bem-vindo ao Sistema',
            message: 'Configure seu perfil para aproveitar todas as funcionalidades.',
            type: 'info',
            timestamp: new Date(),
            read: true
        }
    ];
    setNotifications(initialData);

    // Simulate "Push" Notifications arriving over time
    const timer1 = setTimeout(() => {
        addNotification(
            'Mensalidade Pendente', 
            'A mensalidade de Dezembro está próxima do vencimento.', 
            'financial'
        );
    }, 5000);

    return () => {
        clearTimeout(timer1);
    };
  }, []);

  // Update unread badge
  useEffect(() => {
    setHasUnread(notifications.some(n => !n.read));
  }, [notifications]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // Notifications
        if (
            notificationPanelRef.current && 
            !notificationPanelRef.current.contains(event.target as Node) &&
            bellRef.current &&
            !bellRef.current.contains(event.target as Node)
        ) {
            setShowNotifications(false);
        }
        
        // Language Menu
        if (
            langMenuRef.current && 
            !langMenuRef.current.contains(event.target as Node)
        ) {
            setShowLangMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
        alert('Este navegador não suporta notificações de sistema.');
        return;
    }
    
    try {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
            new Notification('Notificações Ativadas', {
                body: 'Você receberá alertas sobre aulas, pagamentos e eventos.',
                icon: APP_LOGO
            });
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNote: NotificationItem = {
        id: Date.now().toString(),
        title,
        message,
        type,
        timestamp: new Date(),
        read: false
    };

    setNotifications(prev => [newNote, ...prev]);

    // Trigger System Notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: APP_LOGO
        });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Check if current page is dashboard
  const isDashboard = location.pathname === '/app/dashboard';

  return (
    <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-6">
            {/* Back Button - Visible on all pages except Dashboard */}
            {!isDashboard && (
                <button 
                    onClick={() => navigate('/app/dashboard')}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t.backToDashboard}
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
            )}

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary">
                    <img src={APP_LOGO} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-lg text-primary hidden md:block">Filhos do Fogo</span>
                <span className="font-bold text-lg text-primary md:hidden">FdF</span>
            </div>
        </div>

        <div className="flex items-center gap-3">
             {/* Language Selector */}
             <div className="relative" ref={langMenuRef}>
                <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                    <span className="text-xl">{currentLang.flag}</span>
                    <span className="text-xs font-bold hidden md:block">{currentLang.code}</span>
                </button>

                {showLangMenu && (
                    <div className="absolute top-12 right-0 w-40 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-fade-in origin-top-right">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setCurrentLang(lang);
                                    setShowLangMenu(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${currentLang.code === lang.code ? 'bg-primary/5 text-primary font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
             </div>

             {/* Notification Bell */}
             <div className="relative">
                <button 
                    ref={bellRef}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                    <span className="material-icons-round">notifications</span>
                    {hasUnread && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark animate-pulse"></span>
                    )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                    <div ref={notificationPanelRef} className="absolute top-12 right-0 w-80 md:w-96 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-fade-in origin-top-right">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-surface-darker">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t.notifications}</h3>
                            {notifications.length > 0 && (
                                <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline">
                                    {t.markAllRead}
                                </button>
                            )}
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-icons-round text-4xl mb-2 opacity-50">notifications_none</span>
                                    <p className="text-sm">{t.noNotifications}</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative ${!notification.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}
                                    >
                                        {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                notification.type === 'financial' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                                notification.type === 'class' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                                notification.type === 'assignment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                                                'bg-gray-100 text-gray-600 dark:bg-gray-700'
                                            }`}>
                                                <span className="material-icons-round text-lg">
                                                    {notification.type === 'financial' ? 'priority_high' :
                                                     notification.type === 'class' ? 'event' :
                                                     notification.type === 'assignment' ? 'assignment' : 'info'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-2">
                                                    {notification.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
             </div>

             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="material-icons-round dark:hidden">dark_mode</span>
                <span className="material-icons-round hidden dark:block">light_mode</span>
            </button>
            
            {/* User Profile in Header */}
            {currentUser && (
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-surface-darker py-1 px-3 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={() => navigate('/app/profile')}>
                    <img src={currentUser.avatar || IMAGES.defaultAvatar} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold hidden sm:block leading-none">{currentUser.name}</span>
                        <span className="text-[10px] text-gray-500 hidden sm:block leading-none">{currentUser.role === 'STUDENT' ? 'Aluno' : currentUser.role === 'ADMIN' ? 'Admin' : 'Prof.'}</span>
                    </div>
                </div>
            )}

            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors" title="Sair">
                <span className="material-icons-round">logout</span>
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            <Outlet />
        </main>
      </div>

      {/* Bottom Nav (Mobile) - Dynamic based on Role */}
      <nav className="sm:hidden fixed bottom-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 flex justify-around py-2 px-1 z-50 overflow-x-auto hide-scrollbar">
        {navItems.map(item => (
            <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                    location.pathname.includes(item.path)
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400'
                }`}
            >
                <span className="material-icons-round text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </button>
        ))}
      </nav>
    </div>
  );
};