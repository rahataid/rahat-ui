'use client';

import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@rahat-ui/shadcn/src/components/ui/carousel';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import { Home, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ResilienceOverview from './component/resilienceOverview';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import SocialProtectionBenefits from './component/socialProtectionBenefits';
import CommunicationAnalytics from './component/communicationAnalytics';

const Main = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: '/images/humanitarian-image.png',
      alt: 'Woman carrying child in humanitarian context',
    },
    // Add more images here as needed
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 p-5">
      <Heading
        title="Project Dashboard"
        description="Overview of your system"
        titleStyle={'text-xl xl:text-3xl'}
      />

      <ResilienceOverview />
      <BeneficiaryDemographics />
      <SocialProtectionBenefits />
      <CommunicationAnalytics />
    </div>
  );
};

export default Main;
