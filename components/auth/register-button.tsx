"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/auth/register-form";

interface RegisterButtonProps {
  mode?: "modal" | "redirect",
  asChild?: boolean;
};

const RegisterButton = ({
  mode = "redirect",
  asChild
}: RegisterButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/register");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <RegisterForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
        注册
      </button>
    </span>
  );
};

export default RegisterButton;