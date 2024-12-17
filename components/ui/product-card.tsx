"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand } from "lucide-react";
import { useRouter } from "next/navigation";
import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/store/use-preview-modal";
import { Product } from "@/types";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const previewModal = usePreviewModal();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/home/${data.userId}/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  return (
    <div onClick={handleClick} className="bg-white dark:bg-zinc-700 group cursor-pointer rounded-2xl border p-3 space-y-2">
      <div className="aspect-square rounded-2xl bg-gray-100 relative">
        <Image
          src={data.images?.[0]?.url}
          alt="Product image"
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority 
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} />}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <p className="font-bold text-base sm:text-lg md:text-xl xl:text-2xl">{data.name}</p>
        <p className="text-sm text-zinc-500 my-1 xl:line-clamp-4 lg:line-clamp-3 md:line-clamp-2 sm:line-clamp-1 line-clamp-1">{data.detailed}</p>
        <Currency className="text-base sm:text-lg md:text-xl xl:text-2xl font-semibold" value={data?.price} />
      </div>
    </div>
  );
};

export default ProductCard;
