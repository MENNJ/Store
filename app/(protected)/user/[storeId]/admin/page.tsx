"use client"
import { admin } from "@/actions/Auth/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

export const AdminPage = () => {
    const { toast } = useToast()

    const onServerActionClick = () => {
        admin()
            .then((data) => {
                if (data.error) {
                    toast({
                        variant: "destructive",
                        description: `${data.error}`,
                        action: <ToastAction altText="Try again">收回</ToastAction>,
                    })
                }
                if (data.success) {
                    toast({
                        description: `${data.success}`,
                        action: (
                            <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                        ),
                    })
                }
            })
    }


    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((response) => {
                if (response.ok) {
                    toast({
                        description: "路径允许访问",
                        action: (
                            <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                        ),
                    })
                } else {
                    toast({
                        variant: "destructive",
                        description: "禁止API路线",
                        action: <ToastAction altText="Try again">收回</ToastAction>,
                    })

                }
            })
    }
    return (
        <Card className="md:w-[600px] w-[280px] ">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    管理
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="允许您查看此内容!" />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        仅管理API路由
                    </p>
                    <Button onClick={onApiRouteClick}>
                        点击测试
                    </Button>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        仅管理服务器操作
                    </p>
                    <Button onClick={onServerActionClick}>
                        点击测试
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default AdminPage