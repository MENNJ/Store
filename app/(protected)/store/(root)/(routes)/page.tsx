"use client"

import { useStoreModal } from "@/hooks/store/use-store-modal";

import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOPen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
export default SetupPage;