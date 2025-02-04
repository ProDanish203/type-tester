"use client";
import React from "react";
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
import { ArrowRightLeft } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface MultiplayerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
      <DialogTrigger
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <ArrowRightLeft size={14} />
        <span>Switch to Multiplayer</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multiplayer</DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between gap-2 w-full">
              Join a game with your friends or random players all over the
              globe.
              <Badge className="bg-green-500">
                <span>100</span> Online Users
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="flex gap-y-2 flex-col justify-center">
            <Label htmlFor="username">Enter Username</Label>
            <Input id="username" required minLength={1} maxLength={30} />
          </div>

          <div className="flex gap-y-2 flex-col justify-center">
            <Label htmlFor="roomId">Enter Room Id</Label>
            <Input id="roomId" required minLength={1} maxLength={30} />
          </div>

          <Separator />

          <div className="flex gap-y-2 flex-col justify-center">
            <Label htmlFor="createRoom">Create New Room</Label>
            <Button variant={"secondary"}>Create</Button>
          </div>

          <div className="flex items-center gap-x-2">
            <DialogClose
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Cancel
            </DialogClose>

            <Button>Join Room</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
