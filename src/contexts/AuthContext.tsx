import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../services/api';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addToWatchlist: (animeId: string) => Promise<void>;
  removeFromWatchlist: (animeId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur si un token existe
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token && apiService.isAuthenticated()) {
        try {
          await refreshProfile();
        } catch (error) {
          console.error('Failed to refresh profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fonction pour se connecter
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour s'inscrire
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.register(data);
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger le profil utilisateur
  const refreshProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setUser(null);
      setIsAuthenticated(false);
      apiService.removeAuthToken();
      throw error;
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    apiService.removeAuthToken();
    
    // Optionnel : appeler l'API de logout
    apiService.logout().catch(console.error);
  };

  // Ajouter à la watchlist
  const addToWatchlist = async (animeId: string) => {
    try {
      const response = await apiService.addToWatchlist(animeId);
      if (response.success) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      throw error;
    }
  };

  // Retirer de la watchlist
  const removeFromWatchlist = async (animeId: string) => {
    try {
      const response = await apiService.removeFromWatchlist(animeId);
      if (response.success) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    addToWatchlist,
    removeFromWatchlist,
    refreshProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};