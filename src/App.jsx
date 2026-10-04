import { useEffect, useState } from "react";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import Login from "./features/auth/Login.jsx";
import { getCurrentUser, login, logout } from "./features/auth/auth.service.js";
import { isApiMode } from "./lib/api/config.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(isApiMode);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isApiMode) return undefined;

    let isMounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch((error) => {
        if (isMounted && error.status !== 401) setAuthError(error.message);
      })
      .finally(() => {
        if (isMounted) setIsInitializing(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin(email, password, role) {
    setIsLoggingIn(true);
    setAuthError("");

    try {
      setUser(await login({ email, password, role }));
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (isInitializing) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Carregando sua sessão...</main>;
  }

  return user ? (
    <Dashboard
      email={user.email}
      name={user.name}
      role={user.role}
      onLogout={handleLogout}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      error={authError}
      isLoading={isLoggingIn}
      isApiMode={isApiMode}
    />
  );
}
