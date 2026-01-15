import { ReactNode, useState } from 'react';
import { Target, LayoutDashboard, Target as TargetIcon, BarChart3, Tag, User, Settings, LogOut, Bell, ChevronDown, Menu, X } from 'lucide-react';
import type { User as UserType, Notification } from '../../App';
import { NotificationsPanel } from './NotificationsPanel';

type Page = 'dashboard' | 'objectives-all' | 'objectives-daily' | 'objectives-weekly' | 'objectives-monthly' | 'objectives-yearly' | 'reports' | 'tags' | 'profile' | 'settings';

interface MainLayoutProps {
  currentUser: UserType;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: ReactNode;
  notifications: Notification[];
  onNotificationsUpdate: (notifications: Notification[]) => void;
}

export function MainLayout({ 
  currentUser, 
  currentPage, 
  onNavigate, 
  onLogout, 
  children,
  notifications,
  onNotificationsUpdate 
}: MainLayoutProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showObjectivesSubmenu, setShowObjectivesSubmenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'objectives-all' as Page, label: 'Objectives', icon: TargetIcon, hasSubmenu: true },
    { id: 'reports' as Page, label: 'Reports', icon: BarChart3 },
    { id: 'tags' as Page, label: 'Tags', icon: Tag },
  ];

  const objectivesSubmenuItems = [
    { id: 'objectives-daily' as Page, label: 'Daily' },
    { id: 'objectives-weekly' as Page, label: 'Weekly' },
    { id: 'objectives-monthly' as Page, label: 'Monthly' },
    { id: 'objectives-yearly' as Page, label: 'Yearly' },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setShowMobileSidebar(false);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  const SidebarContent = () => (
    <>
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg text-neutral-900">Objectives</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'objectives-all' && currentPage.startsWith('objectives-'));
          
          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    setShowObjectivesSubmenu(!showObjectivesSubmenu);
                  }
                  handleNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
              
              {item.hasSubmenu && showObjectivesSubmenu && (
                <div className="ml-11 mt-1 space-y-1">
                  {objectivesSubmenuItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigate(subItem.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        currentPage === subItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden text-neutral-600 hover:text-neutral-900"
            >
              {showMobileSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg text-neutral-900">Objectives</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              {showNotifications && (
                <NotificationsPanel
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onNotificationsUpdate={onNotificationsUpdate}
                />
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm text-white">
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-sm text-neutral-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-neutral-600">{currentUser.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleNavigate('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      handleNavigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <div className="border-t border-neutral-200 my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-neutral-200 lg:bg-white lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileSidebar(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
