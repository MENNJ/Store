"use client"
import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

const ClientPage = () => {
    const user=  useCurrentUser();
    return (
       <UserInfo
       label="客户端组件"     
       user={user}
       />
    );
}

export default ClientPage