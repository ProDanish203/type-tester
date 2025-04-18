"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Loader2Icon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import { cn, getUsername } from "@/lib/utils";
import { useSocket } from "@/store/SocketProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GameState } from "@/types/types";

interface MultiplayerModalProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  isJoin?: boolean;
  paramsRoomId?: string;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  open,
  setOpen,
  isJoin,
  paramsRoomId,
}) => {
  const { onlineUsers, socket, setJoinedUsers, setPlayers, setGameState } =
    useSocket();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(paramsRoomId || "");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUsername = getUsername();
    setUsername(storedUsername || "");
  }, []);

  const saveUsername = (e: FormEvent) => {
    e.preventDefault();
    if (typeof window === "undefined" || !socket) return;
    if (!username) return toast.error("Please enter a username.");

    localStorage.setItem("username", username);
    socket.emit("addUser", { username });
    setCurrentStep(1);
  };

  const handleUserJoined = (data: {
    roomId: string;
    username: string;
    usersInRoom: string[];
    gameState: GameState;
  }) => {
    if (typeof window === "undefined") return;
    const { username, roomId, usersInRoom, gameState } = data;
    setPlayers(usersInRoom);
    setGameState(gameState);

    const storedUsername = getUsername();
    setJoinedUsers((prev: string) => {
      if (storedUsername !== username && !prev.includes(username)) {
        toast.success(`${username} joined the room. Let's play!`, {
          id: username,
        });
        return [...prev, username];
      }
      return prev;
    });

    router.push(`/multiplayer/${roomId}`);
  };

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (typeof window === "undefined" || !socket) return;
      if (!username || !roomId)
        return toast.error("Please fill in all fields.");
      localStorage.setItem("roomId", roomId);
      socket.emit("joinRoom", { roomId, username });
      socket.on("userJoinedRoom", handleUserJoined);

      router.push(`/multiplayer/${roomId}`);
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.log(err);
    }
  };

  const handleCreateRoom = () => {
    if (!socket || !username) return;
    setIsLoading(true);
    socket.emit("createRoom", { username });

    socket.on("roomCreated", (data: { roomId: string; username: string }) => {
      const { roomId, username } = data;
      localStorage.setItem("username", username);
      localStorage.setItem("roomId", roomId);
      setPlayers([username]);
      router.push(`/multiplayer/${roomId}`);
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("roomId");
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
      {!isJoin && (
        <DialogTrigger
          onClick={() => setOpen && setOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-md cursor-pointer"
        >
          <ArrowRightLeft size={14} />
          <span>Switch to Multiplayer</span>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 w-full">
            <span>Join Multiplayer</span>
            <Badge className="bg-green-500 hover:bg-green-600 flex gap-x-1 py-2 rounded-full">
              <span className="font-bold">{onlineUsers.length}</span> Online{" "}
              {onlineUsers.length > 1 ? "Players" : "Player"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Join a game with your friends or random players all over the globe.
          </DialogDescription>
        </DialogHeader>
        {currentStep === 0 ? (
          <form onSubmit={saveUsername} className="flex flex-col gap-4">
            <div className="flex gap-y-3 flex-col justify-center">
              <Label htmlFor="username">Enter Username</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                minLength={1}
                maxLength={30}
              />
            </div>

            <div className="flex items-center justify-end gap-x-2 mt-2">
              {isJoin ? (
                <Button
                  onClick={handleCancel}
                  type="button"
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Cancel
                </Button>
              ) : (
                <DialogClose
                  type="button"
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Cancel
                </DialogClose>
              )}

              <Button type="submit">Next</Button>
            </div>
          </form>
        ) : currentStep === 1 ? (
          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <div className="flex gap-y-3 flex-col justify-center">
              <Label htmlFor="username">Enter Username</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                minLength={1}
                maxLength={30}
              />
            </div>

            <div className="flex gap-y-3 flex-col justify-center">
              <Label htmlFor="roomId">Enter Room Id</Label>
              <Input
                id="roomId"
                required
                value={roomId}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setRoomId(e.target.value)
                }
                minLength={1}
                maxLength={30}
                className={cn("", isJoin && "cursor-not-allowed")}
                disabled={isJoin}
              />
            </div>
            {!isJoin && (
              <>
                <Separator />
                <p className="text-center text-lg">OR</p>
                <div className="flex gap-y-3 flex-col justify-center">
                  <Button
                    type="button"
                    onClick={handleCreateRoom}
                    variant={"secondary"}
                    className="mb-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2Icon className="animate-spin stroke-white" />
                    ) : (
                      "Create Room"
                    )}
                  </Button>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-x-2 mt-2">
              {isJoin ? (
                <Button
                  onClick={handleCancel}
                  type="button"
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Cancel
                </Button>
              ) : (
                <DialogClose
                  type="button"
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Cancel
                </DialogClose>
              )}

              <Button
                type="submit"
                disabled={isLoading && roomId.length > 0}
                className="min-w-24"
              >
                {isLoading && roomId.length > 0 ? (
                  <Loader2Icon className="animate-spin stroke-black" />
                ) : (
                  "Join Room"
                )}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
