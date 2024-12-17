
import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/lib/auth/auth";

const ServerPage = async () => {
    const user= await currentUser();
    return (
       <UserInfo
       label="服务器组件"     
       user={user}
       />
    );
}

export default ServerPage