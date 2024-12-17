"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import {
    Image,
    Product
}
    from "@prisma/client";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    detailed: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
})

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null; 
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const title = initialData ? "编辑产品." : "创建产品.";
    const description = initialData ? "编辑产品." : "添加新产品.";
    const toastMessage = initialData ? "产品更新." : "创建的产品.";
    const action = initialData ? "保存更改" : "创建";
    if (!params) return null;
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            detailed: '',
            isFeatured: false,
            isArchived: false,

        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/store/${params.storeId}/products`);
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
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/store/${params.storeId}/products`);
            toast({
                description: "产品已删除",
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
    }


    // 处理文件上传
    const handleFileUpload = async (files: File[]) => {
        // 设置文件
        setFiles(files);

        // 获取第一个文件
        const file = files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/stores/product-upload", {
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
            form.setValue("images", [{ url: result.data }]); // Ensure the value matches the schema

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
                        name="images"
                        render={({ field }) => (
                            <FileUpload
                                title="商品图"
                                subtitle="点击上传商品图"
                                multiple={true}
                                onChange={handleFileUpload}
                            />
                        )}
                    />

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>商品名</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="产品名称" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="detailed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>商品详细信息</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="商品详细信息" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>价格</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.999" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex felx-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            是否是特色
                                        </FormLabel>
                                        <FormDescription>
                                            该产品将在主页上展示.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex felx-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            存档
                                        </FormLabel>
                                        <FormDescription>
                                            这个产品不会出现在商店的任何地方.
                                        </FormDescription>
                                    </div>
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