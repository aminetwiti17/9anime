import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        await refreshProfile();
      } catch (err) {
        setError('Erreur lors du chargement du profil utilisateur');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        username: user.username || '',
        email: user.email || ''
      });
    }
    // eslint-disable-next-line
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center text-white">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Veuillez vous connecter</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <p className="text-gray-400">{user.email}</p>
        </div>
        {/* Affichage dynamique de la watchlist et de l'historique */}
        <div className="flex justify-between mt-8">
          <div className="text-center">
            <div className="text-sm text-gray-400">Watchlist</div>
            <div className="text-2xl font-bold text-primary-400">{user.watchlist?.length ?? 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Historique</div>
            <div className="text-2xl font-bold text-primary-400">{user.watch_history?.length ?? 0}</div>
          </div>
        </div>
        {/* Formulaire d'édition (optionnel) */}
        {/* ... */}
      </div>
    </div>
  );
};