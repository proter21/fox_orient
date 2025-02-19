"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "/images/WorldChamp2022.jpg",
  "https://i.ibb.co/NWhLhrb/World-Champ-Ceremony2022.jpg",
  "/images/evr2022.jpg",
];

export default function AutoplayCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-screen mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full">
        {images.map((src, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="h-full">
              <Card className="h-full">
                <CardContent className="flex h-full items-center justify-center p-0">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    style={{ objectFit: "cover" }}
                    className="rounded-none"
                    width={1500}
                    height={500}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
