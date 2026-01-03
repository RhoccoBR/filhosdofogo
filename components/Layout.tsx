import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const IMAGES = {
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS47RDbfOhA71runCA7FPawGCLs9WpciVfLM7qMqYTip_9lf6CFmQIFUOyaOd4gpVCQk9otFNqRON1Gova586XsZonluOjICoX3Rws76VYH9-lD9fZrzr2NRtAyGpJQcYVgeWVTXXV9be_wg5cZtGwosd75SX4gG51XojND53PkRmdBzpSFXViwG-lsgwIFZurWji_vgmmFO2M-fjGmmOaJBwo9R7dW2rLQkvHLuEUMPYTq1nVPMNk7H_cCEN3-aQH3ZcOKOrsMhY",
    adminAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu-HjXtF94pWD_rDGtS4HSA0VIjklD-68H1p4kW-1RrJdwGGJjQhX6uJcU74-3o5DD7ovdna7q_ZCuWSeTNcn3JlqladLTd9WZwiHX75tvtMpUFZVCTPJ79qSHMIkYgUgEP1sI-zIRgkb5NsGhjFrrxFigvD4678X-ZKt6fkhPsTOg3WxQFnti6MXDQmJ1p5Dlu_chlVPtLxkpaHmHpx0CgdNlj06xBUwHJ2HmzHkD65UzgivjPyT4w4JiPKpVVjLna9ZOzunibXg"
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
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      setUser(userStr ? JSON.parse(userStr) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!user && !location.pathname.startsWith('/login') && location.pathname !== '/') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);
  
  // Language State
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  // Derived Translations
  const t = TRANSLATIONS[currentLang.code as keyof typeof TRANSLATIONS];

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', icon: 'dashboard', label: t.dashboard, path: '/app/dashboard' },
      { id: 'events', icon: 'event', label: t.events, path: '/app/events' },
    ];

    if (user?.role === 'admin') {
      items.push({ id: 'users', icon: 'manage_accounts', label: t.users, path: '/app/users' });
    }

    items.push(
      { id: 'financial', icon: 'attach_money', label: t.financial, path: '/app/financial' },
      { id: 'classes', icon: 'fitness_center', label: t.classes, path: '/app/classes' }
    );

    return items;
  }, [t, user]);

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

    const timer2 = setTimeout(() => {
        addNotification(
            'Próxima Aula', 
            'Sua aula de Capoeira começa em 1 hora. Não esqueça o uniforme!', 
            'class'
        );
    }, 15000);

    const timer3 = setTimeout(() => {
        addNotification(
            'Novo Trabalho', 
            'Mestre Lion adicionou uma nova tarefa: Pesquisa sobre Mestre Bimba.', 
            'assignment'
        );
    }, 30000);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
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
                icon: IMAGES.logo
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
            icon: IMAGES.logo
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
                    <img src={IMAGES.logo} alt="Logo" className="w-full h-full object-cover" />
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
                        
                        {/* Permission Request Banner */}
                        {'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied' && (
                             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                                <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">{t.permissionText}</p>
                                <button onClick={requestPermission} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-sm">notifications_active</span>
                                    {t.activate}
                                </button>
                             </div>
                        )}

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
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-surface-darker py-1 px-3 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/app/profile')}>
                <img src={IMAGES.adminAvatar} alt="Profile" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium hidden sm:block">
                  {user?.nickname || user?.name || 'Usuário'} ({user?.role === 'admin' ? 'Mestre' : user?.role === 'professor' ? 'Professor' : 'Aluno'})
                </span>
            </div>
            <button onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }} className="text-gray-500 hover:text-red-500">
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

      {/* Bottom Nav (Mobile) */}
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
         <button
                onClick={() => navigate('/app/financial')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                    location.pathname === '/app/financial'
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400'
                }`}
            >
                <span className="material-icons-round text-xl">notifications_active</span>
                <span className="text-[10px] font-medium truncate w-full text-center">{t.reminders}</span>
        </button>
         <button
                onClick={() => navigate('/app/students-list')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                    location.pathname.includes('/app/students-list')
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400'
                }`}
            >
                <span className="material-icons-round text-xl">assignment_ind</span>
                <span className="text-[10px] font-medium truncate w-full text-center">{t.details}</span>
        </button>
      </nav>
    </div>
  );
};