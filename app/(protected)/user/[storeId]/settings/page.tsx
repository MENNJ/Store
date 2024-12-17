"use client";
import { settings } from "@/actions/Auth/settings";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { useTransition, useState } from "react";
import *  as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { FormSuccess } from "@/components/auth/form-success"
import { FormError } from "@/components/auth/form-error"
import { UserRole } from "@prisma/client";
import React from "react";
import MyUpload from "@/components/userimgupload";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, User } from "lucide-react";


const SettingsPage = () => {

    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [ispending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            image: user?.image || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                        setSuccess(undefined);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                        setError(undefined);
                    }
                })
                .catch(() => setError("出了什么问题!"));
        });
    };



    return (
        <Card className="md:w-[600px] w-[350px] ">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    用户设置
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Label htmlFor="input-10">名称</Label>
                                                    <div className="relative">
                                                        <Input {...field} id="input-10" disabled={ispending} className="peer pe-9" placeholder="名称" type="name" />
                                                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                                            <User size={16} strokeWidth={2} aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MyUpload
                                                    onChange={(url) => {
                                                        field.onChange(url);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>

                            </div>
                            {user?.isOAuth === false && (<>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Label htmlFor="input-10">名称</Label>
                                                    <div className="relative">
                                                        <Input {...field} id="input-10" disabled={ispending} className="peer pe-9" placeholder="******@******.com" type="email" />
                                                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                                            <Mail size={16} strokeWidth={2} aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Label htmlFor="input-10">密码</Label>
                                                    <div className="relative">
                                                        <Input {...field} id="input-10" disabled={ispending} autoComplete="off" className="peer pe-9" placeholder="******" type="password" />
                                                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                                            <KeyRound size={16} strokeWidth={2} aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Label htmlFor="input-10">新密码</Label>
                                                    <div className="relative">
                                                        <Input {...field} id="input-10" disabled={ispending} className="peer pe-9" placeholder="******" type="password" />
                                                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                                            <KeyRound size={16} strokeWidth={2} aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                            )}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            角色
                                        </FormLabel>
                                        <Select
                                            disabled={ispending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="选择角色" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>
                                                    管理员
                                                    
                                                </SelectItem>
                                                <SelectItem value={UserRole.USER}>
                                                    用户
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {user?.isOAuth === false && (
                                <FormField
                                    control={form.control}
                                    name="isTwoFactorEnabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-x-0.5">
                                                <FormLabel>
                                                    双重身份验证
                                                </FormLabel>
                                                <FormDescription>
                                                    为您的帐户启用双因素身份验证.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    disabled={ispending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            disabled={ispending}
                            type="submit"
                        >
                            保存
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
export default SettingsPage