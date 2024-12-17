"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const title = initialData ? "编辑广告牌." : "创建广告牌.";
    const description = initialData ? "编辑广告牌." : "添加一个新的广告牌.";
    const toastMessage = initialData ? "广告牌更新." : " 创建的广告牌.";
    const action = initialData ? "保存更改" : "创建";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/store/${params.storeId}/billboards`);
            toast({
                description: toastMessage,
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "出了点问题.",
                action: <ToastAction altText="Try again">再试一次</ToastAction>,
            })
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/store/${params.storeId}/billboards`);
            toast({
                description: "广告牌已删除",
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                description: "确保您首先使用广告牌删除了所有类别.",
                action: <ToastAction altText="Try again">再试一次</ToastAction>,
            })
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const handleFileUpload = async (files: File[]) => {
        setFiles(files);

        const file = files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/stores/billboard-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    description: "上传失败！",
                    action: <ToastAction altText="Try again">再试一次</ToastAction>,
                })
            }
            const result = await response.json();

            form.setValue("imageUrl", result.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };


    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex inter-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FileUpload
                                title="上传图片&视频"
                                subtitle="点击上传图片&视频"
                                multiple={false}
                                onChange={handleFileUpload}
                            />
                        )}
                    />

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>广告标语</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="广告标语 ." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >
                        {action}
                    </Button>
                </form>
            </Form>

        </>
    );
};