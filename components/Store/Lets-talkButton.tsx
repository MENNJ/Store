import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast"
import { useParams, useRouter } from "next/navigation";
import usePreviewModal from "@/hooks/store/use-preview-modal";
interface LetsTalkButtonProps {
    userId: string;
}
const LetsTalkButton: React.FC<LetsTalkButtonProps> = ({
    userId
}) => {
    const { toast } = useToast()
    const router = useRouter();
    const params = useParams();
    const previewModal = usePreviewModal();

    const createConversation = async () => {
        try {
            const conversation_id = await axios.post('/api/conversations', { userId });
            router.refresh();
            toast({
                description: "成功创建对话",
                action: (
                    <ToastAction altText="Goto schedule to undo">收回</ToastAction>
                ),
            })
            previewModal.onClose();
            router.push(`/home/${params.storeId}/conversations?conversation_id=${conversation_id.data.conversation_id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                description: "出了点问题.",
                action: <ToastAction altText="Try again">再试一次</ToastAction>,
            })
        }
    };

    return (
        <Button
            onClick={createConversation}
            className="flex items-center gap-x-2 w-auto rounded-full border border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 font-semibold hover:opacity-75 transition bg-gray-200 text-black"
        >
            聊一聊
        </Button>
    );
}

export default LetsTalkButton;
