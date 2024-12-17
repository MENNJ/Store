'use client';
import ConversationBox from "./ConversationBox";

interface Message {
    type: string;
    message: string;
    sent_at: string;
}

interface Conversation {
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
}

interface ConversationListProps {
    conversations: Conversation[];
    curConversation: string | null;
    setCurConversation: (conversationId: string) => void;
}


const ConversationList = ({
    conversations,
    curConversation,
    setCurConversation
}: ConversationListProps) => {
    return (
        <aside className="hidden md:block lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-gray-200">
            <div className="px-5">
                <div className="flex justify-center mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">对话列表</div>
                </div>
                <div className="grid w-60 gap-1">
                    {conversations.map((item) => (
                        <ConversationBox
                            key={item.conversation_id}
                            data={item}
                            curConversation={curConversation}
                            setCurConversation={setCurConversation}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default ConversationList;

