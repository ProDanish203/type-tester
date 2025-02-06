"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  onlineUsers: string[];
  joinedUsers: string[];
  setJoinedUsers: any;
  players: string[];
  setPlayers: any;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);

  const username: string | null =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  useEffect(() => {
    const newSocket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL!, {
      query: { username: username || "" },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      const onlineUsers = username
        ? users.filter((user: string) => user !== username)
        : users;
      setOnlineUsers(onlineUsers);
    });

    return () => {
      newSocket.close();
    };
  }, [username]);

  const value = {
    socket,
    onlineUsers,
    joinedUsers,
    setJoinedUsers,
    players,
    setPlayers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
