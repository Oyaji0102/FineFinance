import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);

  React.useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser({
           id: payload.sub, 
           name: payload.sub.split('@')[0], 
           email: payload.sub,
           role: payload.is_admin ? 'admin' : 'user', 
           premium: payload.is_premium
        });
        setToken(savedToken);
      } catch(e) {
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    
    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
       method: 'POST',
       body: formData
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Giriş başarısız. Şifre veya E-posta hatalı.");
    }
    
    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem('access_token', data.access_token);
    
    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
    const userObj = { 
       id: payload.sub, 
       name: payload.sub.split('@')[0], 
       email: payload.sub,
       role: payload.is_admin ? 'admin' : 'user', 
       premium: payload.is_premium 
    };
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
