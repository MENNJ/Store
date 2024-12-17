"use client";

// 导入zod库，用于表单验证
import * as z from "zod";
// 导入axios库，用于发送HTTP请求
import axios from "axios";
// 导入react-hook-form库，用于表单处理
import { useForm } from "react-hook-form";
// 导入zodResolver库，用于将zod验证器与react-hook-form结合使用
import { zodResolver } from "@hookform/resolvers/zod";
// 导入useState钩子，用于管理组件状态
import { useState } from "react";
// 导入自定义的useStoreModal钩子，用于管理模态框状态
import { useStoreModal } from "@/hooks/store/use-store-modal";
// 导入自定义的Modal组件
import { Modal } from "@/components/ui/modal";
// 导入自定义的Form组件
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
// 导入自定义的Input组件
import { Input } from "@/components/ui/input";
// 导入自定义的Button组件
import { Button } from "@/components/ui/button";
// 导入react-hot-toast库，用于显示提示信息
import { toast } from "react-hot-toast";

// 定义表单验证规则
const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {

  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });


  // 定义表单提交函数
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 设置loading状态为true
      setLoading(true);
      // 发送POST请求，创建新商店
      const response = await axios.post("/api/stores", values);
      // 重定向到新创建的商店页面
      window.location.assign(`/store/${response.data.id}`);
    } catch (error) {
      // 发生错误时显示提示信息
      toast.error("出了什么问题.");
    } finally {
      // 设置loading状态为false
      setLoading(false);
    }
  }

  return (
    <Modal
      title="创建存储"
      description="添加一个新商店来管理产品和类别"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>店名</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="输入店名"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}>
                  取消
                </Button>
                <Button disabled={loading} type="submit">继续</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};