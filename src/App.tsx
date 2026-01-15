import { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/pages/Dashboard';
import { ObjectivesPage } from './components/pages/ObjectivesPage';
import { TagsPage } from './components/pages/TagsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { Toaster } from 'sonner@2.0.3';

export type ObjectiveType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Accomplishment {
  id: string;
  objectiveId: string;
  description: string;
  done: boolean;
  doneDate: string;
}

export interface Objective {
  id: string;
  name: string;
  description: string;
  type: ObjectiveType;
  targetAmount: number;
  dueDate: string;
  tagIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type Page = 'dashboard' | 'objectives-all' | 'objectives-daily' | 'objectives-weekly' | 'objectives-monthly' | 'objectives-yearly' | 'reports' | 'tags' | 'profile' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize mock data
  useEffect(() => {
    if (isAuthenticated) {
      // Mock tags
      const mockTags: Tag[] = [
        { id: '1', name: 'Health', color: '#10b981' },
        { id: '2', name: 'Career', color: '#3b82f6' },
        { id: '3', name: 'Learning', color: '#8b5cf6' },
        { id: '4', name: 'Finance', color: '#f59e0b' },
        { id: '5', name: 'Personal', color: '#ec4899' },
      ];
      setTags(mockTags);

      // Mock objectives
      const mockObjectives: Objective[] = [
        {
          id: '1',
          name: 'Morning Workout',
          description: 'Complete 30-minute morning workout',
          type: 'daily',
          targetAmount: 1,
          dueDate: '2026-01-07',
          tagIds: ['1'],
          createdAt: '2026-01-01',
        },
        {
          id: '2',
          name: 'Read for 30 minutes',
          description: 'Read technical books or articles',
          type: 'daily',
          targetAmount: 1,
          dueDate: '2026-01-07',
          tagIds: ['3'],
          createdAt: '2026-01-01',
        },
        {
          id: '3',
          name: 'Complete project milestone',
          description: 'Finish the authentication module',
          type: 'weekly',
          targetAmount: 1,
          dueDate: '2026-01-12',
          tagIds: ['2'],
          createdAt: '2026-01-05',
        },
        {
          id: '4',
          name: 'Save $500',
          description: 'Monthly savings goal',
          type: 'monthly',
          targetAmount: 500,
          dueDate: '2026-01-31',
          tagIds: ['4'],
          createdAt: '2026-01-01',
        },
        {
          id: '5',
          name: 'Learn React Advanced Patterns',
          description: 'Complete advanced React course',
          type: 'yearly',
          targetAmount: 1,
          dueDate: '2026-12-31',
          tagIds: ['2', '3'],
          createdAt: '2026-01-01',
        },
      ];
      setObjectives(mockObjectives);

      // Mock accomplishments
      const mockAccomplishments: Accomplishment[] = [
        {
          id: '1',
          objectiveId: '1',
          description: 'Completed 30-min cardio',
          done: true,
          doneDate: '2026-01-07',
        },
        {
          id: '2',
          objectiveId: '2',
          description: 'Read chapter 5 of Clean Code',
          done: true,
          doneDate: '2026-01-06',
        },
        {
          id: '3',
          objectiveId: '2',
          description: 'Read article on React performance',
          done: true,
          doneDate: '2026-01-07',
        },
        {
          id: '4',
          objectiveId: '4',
          description: 'Saved $150 this week',
          done: true,
          doneDate: '2026-01-05',
        },
      ];
      setAccomplishments(mockAccomplishments);

      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          message: 'Your daily objective "Morning Workout" is due today',
          read: false,
          createdAt: '2026-01-07T08:00:00',
        },
        {
          id: '2',
          message: 'You completed "Read for 30 minutes"! Great job!',
          read: false,
          createdAt: '2026-01-07T10:30:00',
        },
        {
          id: '3',
          message: 'Weekly objective deadline approaching',
          read: true,
          createdAt: '2026-01-06T14:00:00',
        },
      ];
      setNotifications(mockNotifications);
    }
  }, [isAuthenticated]);

  const handleLogin = (username: string, password: string) => {
    // Mock login
    setCurrentUser({
      id: '1',
      firstName: 'Alex',
      lastName: 'Johnson',
      username: username,
      email: 'alex.johnson@example.com',
    });
    setIsAuthenticated(true);
  };

  const handleRegister = (firstName: string, lastName: string, username: string, email: string, password: string) => {
    // Mock register
    setCurrentUser({
      id: '1',
      firstName,
      lastName,
      username,
      email,
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setObjectives([]);
    setAccomplishments([]);
    setTags([]);
    setNotifications([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {authView === 'login' ? (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <MainLayout
      currentUser={currentUser!}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      notifications={notifications}
      onNotificationsUpdate={setNotifications}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          objectives={objectives}
          accomplishments={accomplishments}
          tags={tags}
          onNavigate={setCurrentPage}
        />
      )}
      {(currentPage === 'objectives-all' || 
        currentPage === 'objectives-daily' || 
        currentPage === 'objectives-weekly' || 
        currentPage === 'objectives-monthly' || 
        currentPage === 'objectives-yearly') && (
        <ObjectivesPage
          currentPage={currentPage}
          objectives={objectives}
          accomplishments={accomplishments}
          tags={tags}
          onObjectivesUpdate={setObjectives}
          onAccomplishmentsUpdate={setAccomplishments}
          onTagsUpdate={setTags}
        />
      )}
      {currentPage === 'tags' && (
        <TagsPage
          tags={tags}
          onTagsUpdate={setTags}
        />
      )}
      {currentPage === 'reports' && (
        <ReportsPage
          objectives={objectives}
          accomplishments={accomplishments}
          tags={tags}
        />
      )}
      {(currentPage === 'profile' || currentPage === 'settings') && (
        <ProfilePage
          currentUser={currentUser!}
          onUserUpdate={setCurrentUser}
        />
      )}
      <Toaster position="top-right" />
    </MainLayout>
  );
}
