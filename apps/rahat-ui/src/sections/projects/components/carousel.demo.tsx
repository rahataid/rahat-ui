import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@rahat-ui/shadcn/src/components/ui/carousel';

const imageList = [
  { src: '/projects/aa_1.jpg' },
  { src: '/projects/aa_2.jpg' },
  { src: '/projects/aa_3.jpg' },
];

export function CarouselDemo() {
  return (
    <Carousel
      className="w-full shadow-md rounded-sm bg-card p-2"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {imageList?.map((item, index) => (
          <CarouselItem key={index} className="relative w-full h-96">
            <Image
              src={item.src}
              alt={`project-${index}`}
              fill
              className="rounded object-cover"
              sizes="(min-width: 740px) 33vw, 100vw"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
      <CarouselNext className="right-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
    </Carousel>
    // <Carousel
    //   className="max-w-[560px] shadow-md rounded-sm bg-card p-2"
    //   opts={{ loop: true }}
    // >
    //   <CarouselContent>
    //     {imageList?.map((item, index) => (
    //       <CarouselItem key={index}>
    //         <Image
    //           className="rounded h-full object-cover"
    //           src={item.src}
    //           alt="project"
    // height={110}
    // width={550}
    //         />
    //       </CarouselItem>
    //     ))}
    //   </CarouselContent>
    //   <CarouselPrevious className="left-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
    //   <CarouselNext className="right-2 bg-transparent text-gray-300 border-none hover:bg-transparent hover:text-white" />
    // </Carousel>
  );
}
