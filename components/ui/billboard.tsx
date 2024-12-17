"use client";

import type { Billboard } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface BillboardProps {
  data: Billboard[];
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="w-full xl:p-8 lg:p-6 md:p-5 sm:p-4 p-2">
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {data.map((billboard) => (
            <CarouselItem key={billboard.id} className="lg:basis-4/5">
              <Card className="rounded-2xl">
                <CardContent className="flex aspect-video items-center justify-center p-0">
                  <video
                    autoPlay
                    muted
                    loop
                    src={billboard.imageUrl}
                    className="w-full h-full object-cover rounded-2xl"
                    width={500}
                    height={500}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Billboard;
