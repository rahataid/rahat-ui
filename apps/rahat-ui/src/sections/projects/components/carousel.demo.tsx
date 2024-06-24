import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@rahat-ui/shadcn/src/components/ui/carousel';

const imageList = [
  { src: '/svg/aa-project.svg' },
  { src: '/projects/aa1.jpg' },
  { src: '/projects/aa2.jpg' },
];

export function CarouselDemo() {
  return (
    <Carousel
      className="max-w-[550px] shadow-md rounded-sm bg-card p-2"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {imageList?.map((item, index) => (
          <CarouselItem key={index}>
            <Image
              className="rounded h-full object-cover"
              src={item.src}
              alt="project"
              height={100}
              width={550}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
      <CarouselNext className="right-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
    </Carousel>
  );
}
