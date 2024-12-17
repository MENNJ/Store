import { Cascader } from "antd";
import { options } from "@/types";

interface AddressSelectorProps {
    selectedAddress: any;
    onAddressChange: (value: any) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ selectedAddress, onAddressChange }) => {
    return (
        <>
            <label className="text-sm font-semibold">选择地址</label>
            <Cascader
                options={options}
                onChange={onAddressChange}
                value={selectedAddress}
                placeholder="请选择地址"
                className="w-full h-10 mt-2"
            />
        </>
    );
};

export default AddressSelector;
