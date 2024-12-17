"use client";

// 导入Currency组件
import Currency from "@/components/ui/currency";
// 导入Product类型
import { Product } from "@/types";
// 导入React库
import * as React from "react";
// 导入Buy组件
import Buy from "@/components/Store/Buy";
// 导入useCurrentUser钩子
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Ellipsis } from 'lucide-react';
import useUserById from "@/actions/Store/useUserById";
import { useRouter } from "next/navigation";
interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const Buyers = useCurrentUser();
  const { user } = useUserById(data.userId)
  const isOwner = Buyers?.id === data.userId;
  const router = useRouter();

  const ClicktoProduct = () => {
    router.push(`/home/${data.userId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage onClick={ClicktoProduct} className="object-cover cursor-pointer" src={user?.image || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{user?.name}</p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
        </div>
        <div className="mr-3">
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <Ellipsis />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>卖家个人信息</DialogTitle>
                <DialogDescription>
                  这里展示卖家的个人信息包括头像、昵称和邮箱。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {user?.id}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    关闭
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-3">
        <h1 className="text-3xl font-bold font-mono text-gray-900 dark:text-slate-100">{data.name}</h1>
        <div className="flex items-center gap-x-2 text-2xl text-rose-500 dark:text-slate-100">
          <Currency value={data?.price} />
        </div>
        <p className="text-sm text-zinc-500">{data.detailed}</p>
      </div>
      {!isOwner && <Buy data={data} />}
    </div>
  );
}

// 导出Info组件
export default Info;
