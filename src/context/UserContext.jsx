import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get("/profile");
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
