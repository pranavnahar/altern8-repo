import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { images } from './Logos';

const CarouselImage = () => {
  return (
    <div className="relative">
      <Carousel className="flex items-center overflow-hidden">
        <CarouselPrevious className="absolute left-0 z-10" />
        <CarouselContent className="flex space-x-4">
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex-shrink-0">
              <Image
                src={`/Bank logos/${image}`}
                alt={`Slide ${index}`}
                layout="intrinsic"
                width={150}
                height={150}
                objectFit="contain"
                className="image"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-0 z-10" />
      </Carousel>
    </div>
  );
};

export default CarouselImage;
