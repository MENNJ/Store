'use client';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { cloneDeep, remove } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import ConversationList from "@/components/chat/ConversationList";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { socket } from "@/socket";
import { ImageUp, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

interface Message {
  message_id: string;
  sender_id: string;
  message: string;
  type: "TEXT" | "IMAGE";
  sent_at: string;
  sender?: {
    id: string;
    name: string;
    image: string;
  };
}

interface Conversation {
  conversation_id: string;
  user1: { id: string; name: string; image?: string };
  user2: { id: string; name: string; image?: string };
  messages: Message[];
  user2_id: string;
}

export default function UsersLayout() {
  const chatRef = useRef<HTMLDivElement>(null);
  const user = useCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [curConversation, setCurConversation] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation_id");
  const curConversationItem = conversations.find((item) => item.conversation_id === curConversation);

  useEffect(() => {
    setCurConversation(conversationId);
    fetchConversations();
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/api/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations", error);
    }
  };

  const handleSendMsg = (type: "TEXT" | "IMAGE", msg: string) => {
    if (!socket.connected || !curConversationItem || !msg.trim()) return; // Prevent empty messages

    const toId = curConversationItem.user1_id === user?.id ? curConversationItem.user2_id : curConversationItem.user1_id;
    const toUser = curConversationItem.user1_id === user?.id ? curConversationItem.user2 : curConversationItem.user1;

    socket.emit("chat", {
      comment: msg,
      type,
      conversationItem: curConversationItem,
      messageItem: {
        conversation_id: curConversation,
        sender_id: user?.id,
        message: msg,
        type,
      },
      toUser,
      to: toId,
      from: user?.id,
      fromUser: user,
      conversation_id: curConversation,
    });

    setComment("");
  };

  useEffect(() => {
    if (!user) return;

    socket.on("chat", (payload: any) => {
      const { conversation_id, messageItem, conversationItem } = payload;
      const updatedConversations = cloneDeep(conversations);
      const existingConversation = updatedConversations.find((v) => v.conversation_id === conversation_id);

      if (existingConversation) {
        existingConversation.messages.push(messageItem);
        remove(updatedConversations, (item) => item.conversation_id === conversation_id);
        updatedConversations.unshift(existingConversation);
      } else {
        conversationItem.messages.push(messageItem);
        updatedConversations.unshift(conversationItem);
      }

      setConversations(updatedConversations);
    });

    return () => {
      socket.off("chat");
    };
  }, [user, conversations]);

  useEffect(() => {
    if (curConversationItem?.messages?.length && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [curConversationItem]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/stores/product-upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      handleSendMsg("IMAGE", result.data);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMsg("TEXT", comment);
    }
  };

  return (
    <div className="flex">
      <ConversationList
        conversations={conversations}
        curConversation={curConversation}
        setCurConversation={setCurConversation}
      />

      <div className="w-full h-[calc(100vh-5.5rem)]">
        <div className="h-16 w-full border-gray-200">
          <p className="p-5 text-lg font-bold">
            {curConversationItem?.user1_id === user?.id
              ? curConversationItem?.user2.name
              : curConversationItem?.user1.name}
          </p>
        </div>

        <div ref={chatRef} className="w-full h-[calc(100%-80px-64px)] overflow-y-auto p-5 bg-gray-100">
          {curConversationItem?.messages?.map((item) => (
            <div
              key={item.message_id}
              className={clsx("flex mb-3", item.sender_id === user?.id && "justify-end")}
            >
              {item.sender_id !== user?.id && (
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={item?.sender?.image || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{item.sender?.name}</AvatarFallback>
                </Avatar>
              )}

              <div className={clsx("ml-5 rounded-xl", item.sender_id === user?.id ? "bg-green-300 ml-0 mr-5" : "bg-white mr-0 ml-5", { "p-0": item.type === "IMAGE", "": item.type !== "IMAGE" })} >
                {item.type === "IMAGE" ? (
                  <img className="rounded-xl 2xl:w-[400px] xl:w-[350px] lg:w-[300px] md:[250px] sm:w-[200px] w-[150px]" src={item.message} alt="Image" />
                ) : (
                  <p className="p-2.5">
                    {item.message}
                  </p>
                )}
              </div>

              {item.sender_id === user?.id && (
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={user?.image || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{user?.name}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        <div className="h-20 flex items-center pr-4 border-gray-200">
          <div className="relative mx-4 cursor-pointer">
            <input
              className="flex-1 absolute left-0 top-0 z-50 w-8 h-8 opacity-0 cursor-pointer m-0"
              accept="image/*"
              onChange={handleFileChange}
              type="file"
            />
            <ImageUp size={32} />
          </div>
          <div className="space-y-2 w-full">
            <div className="relative">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                id="input-19"
                className="pe-9 rounded-full"
                placeholder="输入消息"
                type="text"
              />
              <button
                onClick={() => handleSendMsg("TEXT", comment)}
                disabled={!comment.trim()}
                className="absolute inset-y-0 right-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
