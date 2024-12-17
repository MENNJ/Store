import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
interface UseImageUploadProps {
  userId?: string;
  onUpload?: (url: string) => void;
}


export function useImageUpload({ userId, onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && userId) {
        setFileName(file.name);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        previewRef.current = url;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        try {
          const response = await fetch("/api/stores/storebg", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            router.refresh();
            router.push(`/home/${userId}`);

          } else {
            console.error("Error uploading image");
          }
        } catch (error) {
          console.error("Error uploading image", error);
        }
      }
    },
    [userId, onUpload]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}
