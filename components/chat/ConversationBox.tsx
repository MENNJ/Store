'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

interface Message {
    type: string;
    message: string;
    sent_at: string;
}

interface ConversationBoxProps {
    data: {
        conversation_id: string;
        user1: {
            id: string;
            name: string;
            image?: string;
        };
        user2: {
            id: string;
            name: string;
            image?: string;
        };
        messages: Message[] | null;
        user2_id: string;
    };
    curConversation: string | null;
    setCurConversation: (conversationId: string) => void;
}

const ConversationBox = ({ data, curConversation, setCurConversation }: ConversationBoxProps) => {
    const user = useCurrentUser();
    let showUser = data.user2_id === user?.id ? data.user1 : data.user2;
    let newestMsg: Message | null = null;

    if (data?.messages) {
        newestMsg = data?.messages[data?.messages?.length - 1] || null;
    }

    return (
        <div onClick={async () => {
            if (curConversation === data.conversation_id) { return; }
            setCurConversation(data.conversation_id);
        }}
            className="w-full relative flex bg-slate-50 dark:bg-zinc-700 items-center space-x-3 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-400 rounded-lg transition cursor-pointer"
        >
            <Avatar>
                <AvatarImage className="object-cover" src={showUser?.image || 'https://github.com/shadcn.png'} alt="@shadcn" />
                <AvatarFallback>{showUser?.name}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-semibold text-gray-800 dark:text-gray-100">{showUser?.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-200 font-light">
                            {newestMsg ? moment(newestMsg.sent_at).fromNow() : ''}
                        </p>
                    </div>
                    <p className="truncate text-sm">
                        {newestMsg && (newestMsg.type === 'IMAGE' ? '[图片]' : newestMsg.message)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConversationBox;
