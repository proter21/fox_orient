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
      className="w-full h-full relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full">
        {images.map((src, index) => (
          <CarouselItem key={index} className="h-full relative">
            <div className="w-full h-full">
              <Card className="w-full h-full border-0">
                <CardContent className="p-0 w-full h-[100vh] relative">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    fill
                    priority
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
