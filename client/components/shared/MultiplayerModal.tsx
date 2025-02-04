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
        className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-md cursor-pointer"
      >
        <ArrowRightLeft size={14} />
        <span>Switch to Multiplayer</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 w-full">
            <span>Join Multiplayer</span>
            <Badge className="bg-green-500 hover:bg-green-600 flex gap-x-2 py-2 rounded-full">
              <span>100</span> Online Users
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Join a game with your friends or random players all over the globe.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="flex gap-y-3 flex-col justify-center">
            <Label htmlFor="username">Enter Username</Label>
            <Input id="username" required minLength={1} maxLength={30} />
          </div>

          <div className="flex gap-y-3 flex-col justify-center">
            <Label htmlFor="roomId">Enter Room Id</Label>
            <Input id="roomId" required minLength={1} maxLength={30} />
          </div>

          <Separator />
          <p className="text-center text-lg">OR</p>
          <div className="flex gap-y-3 flex-col justify-center">
            <Button variant={"secondary"} className="mb-2">
              Create New Room
            </Button>
          </div>

          <div className="flex items-center justify-end gap-x-2 mt-2">
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
