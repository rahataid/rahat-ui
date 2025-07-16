'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import { ChevronLeft, ChevronRight, Home, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { CarouselDemo } from '../../components/carousel.demo';

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

  const stats = [
    {
      icon: Users,
      label: 'Total Respondents',
      value: '250',
    },
    {
      icon: Home,
      label: 'Total no. of Family Members',
      value: '300',
    },
  ];

  const progressMetrics = [
    {
      title: 'PREPAREDNESS',
      percentage: 65,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      title: 'READINESS',
      percentage: 65,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'ACTIVATION',
      percentage: 65,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className=" p-5">
      <Heading
        title="Project Dashboard"
        description="Overview of your system"
        titleStyle={'text-xl xl:text-3xl'}
      />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
        <div className="space-y-6 col-span-1 lg:col-span-1 ">
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4">
              Project Name Goes Here
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              This project enables early actions based on risk forecasts to
              reduce the impact of potential crises. It focuses on preparedness,
              timely response, and protecting vulnerable communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-6">
            {stats.map((stat, index) => (
              <DataCard
                title={stat.label}
                Icon={stat.icon}
                className="rounded-sm h-auto"
                number={stat.value}
                key={stat.label}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {progressMetrics.map((metric, index) => (
              <Card
                key={index}
                className={`${metric.bgColor} ${metric.borderColor} border rounded-sm h-auto`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {metric.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {metric.percentage}% completed
                        </span>
                      </div>

                      <Progress
                        value={metric.percentage}
                        className={`h-2 ${metric.bgColor}`}
                        indicatorColor={metric.color}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative order-first lg:order-last col-span-1">
          <CarouselDemo />
        </div>
      </div>
    </div>
  );
};

export default Main;
