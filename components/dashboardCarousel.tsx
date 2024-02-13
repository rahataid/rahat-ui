import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const imageArray = [
  { id: 1, image: '/rahat-logo.png' },
  { id: 2, image: '/rahat-logo.png' },
  { id: 3, image: '/rahat-logo.png' },
  { id: 4, image: '/rahat-logo.png' },
  { id: 5, image: '/rahat-logo.png' },
];

export function DashBoardCarousel() {
  return (
    <Carousel className="sm:ml-10 w-auto h-auto">
      <CarouselContent>
        {imageArray.map((img) => (
          <CarouselItem key={img.id}>
            <div>
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <img src={img.image} />
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
