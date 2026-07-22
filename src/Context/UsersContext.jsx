import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const UsersContext = createContext(null);

// Placeholder data so the Admin panel has something to show before a
// real backend exists. Shape matches what GET /api/admin/users should
// return once it's built.
const MOCK_USERS = [
  { id: 'user-1', name: 'Ahmed Mostafa', email: 'ahmed@example.com', phone: '01012345678', joinedAt: '2026-03-14', isAdmin: false },
  { id: 'user-2', name: 'Sara Ali', email: 'sara@example.com', phone: '01098765432', joinedAt: '2026-04-02', isAdmin: false },
  { id: 'user-3', name: 'Mohamed Youssef', email: 'mohamed@example.com', phone: '01055512345', joinedAt: '2026-05-20', isAdmin: false },
];

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with a real API call, e.g. GET /api/admin/users
    const loadUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUsers(MOCK_USERS);
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const value = useMemo(() => ({ users, isLoading }), [users, isLoading]);

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used inside a <UsersProvider>');
  }
  return context;
}