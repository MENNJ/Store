// 导入zustand库中的create函数
import { create } from "zustand";

// 定义useStoreModalStore接口，包含isOpen、onOPen和onClose三个属性
interface useStoreModalStore {
    isOpen: boolean;
    onOPen: () => void;
    onClose: () => void;
};

// 使用zustand库中的create函数创建useStoreModal函数，并传入useStoreModalStore接口
export const useStoreModal = create<useStoreModalStore>((set) => ({
    // 初始状态为false
    isOpen: false,
    // 打开模态框，将isOpen属性设置为true
    onOPen: () => set({ isOpen: true }),
    // 关闭模态框，将isOpen属性设置为false
    onClose: () => set({ isOpen: false }),
}));

