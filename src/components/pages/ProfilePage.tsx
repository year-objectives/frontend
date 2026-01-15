import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Lock } from 'lucide-react';
import type { User as UserType } from '../../App';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  currentUser: UserType;
  onUserUpdate: (user: UserType) => void;
}

export function ProfilePage({ currentUser, onUserUpdate }: ProfilePageProps) {
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onUserUpdate({
      ...currentUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
    });

    toast.success('Profile updated successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Mock password update
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-neutral-900 mb-2">Profile & Settings</h1>
        <p className="text-neutral-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-lg text-white">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-lg text-neutral-900">Personal Information</h2>
              <p className="text-sm text-neutral-600">Update your profile details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
              
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Update */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h2 className="text-lg text-neutral-900">Change Password</h2>
              <p className="text-sm text-neutral-600">Update your password to keep your account secure</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <div className="flex justify-end">
              <Button type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h2 className="text-lg text-neutral-900">Account Information</h2>
              <p className="text-sm text-neutral-600">View your account details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-600">Account ID</span>
              <span className="text-sm text-neutral-900">{currentUser.id}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-600">Account Status</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-neutral-600">Member Since</span>
              <span className="text-sm text-neutral-900">January 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
