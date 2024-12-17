import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import { Drawer } from "antd";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import React, { useState } from "react";
import { parsePhoneNumber } from "libphonenumber-js/min";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import AddressSelector from "./AddressSelector";
import PhoneNumberInput from "./PhoneNumberInput";
import { CountryCode } from "libphonenumber-js/core";

interface InfoProps {
  data: Product;
}

const BuyitnowButton: React.FC<InfoProps> = ({ data }) => {
  const user = useCurrentUser();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [open, setOpen] = useState(false);  
  const [value, setValue] = useState("");
  const [country, setCountry] = useState<CountryCode>('CN');

  const handleToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      variant,
      description,
      action: (
        <ToastAction altText="Goto schedule to undo">撤销</ToastAction>
      ),
    });
  };

  const onAddressChange = (value: any) => setSelectedAddress(value);

  const showDrawer = () => setOpen(true); 

  const closeDrawer = () => setOpen(false);

  const validatePhoneNumber = (value: string) => {
    const phoneNumber = parsePhoneNumber(value, country);
    const nationalNumber = phoneNumber?.nationalNumber;
    return nationalNumber ? nationalNumber : null;
  };

  const handlePurchase = async () => {
    if (!user || !selectedAddress || !value) {
      handleToast("错误", "请提供所有必要的信息", "destructive");
      return;
    }

    const nationalNumber = validatePhoneNumber(value);
    if (!nationalNumber) {
      handleToast("错误", "请输入有效的电话号码", "destructive");
      return;
    }

    try {
      await axios.post("/api/checkout", {
        productId: data.id,
        userId: user.id,
        address: selectedAddress,
        phone: nationalNumber,
      });

      handleToast("成功", "购买成功");
      closeDrawer();
    } catch (error) {
      console.error("Error making purchase:", error);
      handleToast("错误", "购买出错，请稍后再试", "destructive");
    }
  };

  return (
    <>
      <Button className="rounded-full" variant="outline" onClick={showDrawer}>
        立即购买
      </Button>
      <Drawer
        title="购买商品"
        placement="right"
        onClose={closeDrawer}
        open={open}
        width={400}
      >
        <div className="mx-auto w-full max-w-sm">
          <div className="pb-4">
            <div className="flex w-full space-x-4 px-4">
              <img
                src={data.images[0].url}
                alt="Image"
                className="object-cover w-1/4 rounded-md"
              />
              <div className="w-full">
                <p className="text-lg">{data.name}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{data.detailed}</p>
                <Currency value={data?.price} />
              </div>
            </div>
          </div>

          <AddressSelector
            selectedAddress={selectedAddress}
            onAddressChange={onAddressChange}
          />

          <PhoneNumberInput
            value={value}
            onChange={setValue}
            onCountryChange={setCountry}
            country={country as CountryCode}
          />

          <div className="mt-4">
            <Button onClick={handlePurchase} className="bg-orange-500 text-base w-full">确认购买</Button>
            <Button className="w-full mt-2" variant="outline" onClick={closeDrawer}>
              取消
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default BuyitnowButton;
