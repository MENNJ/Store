import * as React from "react";
import { Product } from "@/types";
import LetsTalkButton from "@/components/Store/Lets-talkButton";
import BuyitnowButton from "@/components/Store/Buy-it-nowButton";

interface InfoProps {
    data: Product;
}

const Buy: React.FC<InfoProps> = ({ data }) => {
    return (
        <div className="w-full justify-between mt-6 flex items-center gap-x-6">
            <LetsTalkButton userId={data.userId} />
            <BuyitnowButton data={data} />
        </div>
    );
};

export default Buy;
