"use client";

import { useCharacterLimit } from "@/hooks/store/use-character-limit";
import { ImagePlus, X } from "lucide-react";
import { User } from "@/types";
import ProfileBgImg from "@/public/profile-bg.jpg";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import Image from "next/image";
import { useState } from "react";
import { useImageUpload } from "@/hooks/store/use-image-upload";

interface storeBackgroundProps {
    user: User;
}

export default function StoreBackground({ user }: storeBackgroundProps) {
    const maxLength = 180;
    const { } = useCharacterLimit({
        maxLength,
    });

    return (
        <>
            <ProfileBg user={user} />
            <Avatar user={user} />
        </>
    );
}

function ProfileBg({ user }: storeBackgroundProps) {
    const User = useCurrentUser();
    const showButtons = user.id !== User?.id;
    const [hideDefault, setHideDefault] = useState(false);
    const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({ userId: user.id });

    const currentImage = previewUrl || (!hideDefault ? ProfileBgImg : null);

    const handleImageRemove = () => {
        handleRemove();
        setHideDefault(true);
    };

    return (
        <div className="h-auth w-full max-h-[60vh] aspect-video">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                {currentImage && (
                    <Image
                        className="h-full w-full object-cover rounded-t-3xl"
                        src={user.bgimage || currentImage}
                        alt={previewUrl ? "上传图片预览" : "默认配置文件背景"}
                        width={512}
                        height={96}
                    />
                )}

                {!showButtons && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                            onClick={handleThumbnailClick}
                            aria-label={currentImage ? "改变形象" : "上传图片"}
                        >
                            <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
                        </button>
                        {currentImage && (
                            <button
                                type="button"
                                className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                                onClick={handleImageRemove}
                                aria-label="Remove image"
                            >
                                <X size={16} strokeWidth={2} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                aria-label="Upload image file"
            />
        </div>
    );
}

function Avatar({ user }: storeBackgroundProps) {
    return (
        <div className="-mt-8 xl:px-16 lg:px-12 md:px-8 sm:px-6 px-4 pb-0 flex items-end">
            <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
                <img
                    className="h-full w-full object-cover"
                    src={user.image || 'https://ui.shadcn.com/avatars/01.png'}
                    alt="External Image"
                    width={256}
                    height={256}
                />
            </div>
            <p className="flex flex-col m-2 mb-0 leading-tight">
                <p className="font-bold">{user.name || "无用户名"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </p>
        </div>
    );
}

