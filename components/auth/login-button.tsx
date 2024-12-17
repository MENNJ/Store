"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";

interface LoginButtonProps {
  mode?: "modal" | "redirect",
  asChild?: boolean;
};

const LoginButton = ({
  mode = "redirect",
  asChild
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white font-Jaro text-sm">
        登录
      </button>
    </span>
  );
};


export default LoginButton;