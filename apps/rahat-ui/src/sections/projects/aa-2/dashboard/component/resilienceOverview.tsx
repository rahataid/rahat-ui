import { useProjectStore } from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@rahat-ui/shadcn/src/components/ui/carousel';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Home, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {
  benefStats: any[];
  triggeersStats: any[];
};

const ResilienceOverview = ({ benefStats, triggeersStats, projectId }: any) => {
  const project = useProjectStore((p) => p.singleProject);
  const getStat = (name: string) =>
    benefStats?.find((stat: any) => stat.name === name)?.data?.count ?? 0;

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
      label: 'Total Respondents',
      value: getStat('TOTAL_RESPONDENTS'),
    },
    {
      icon: <Home className="w-5 h-5 text-muted-foreground" />,
      label: 'Total no. of Family Members',
      value: getStat('TOTAL_NUMBER_FAMILY_MEMBERS'),
    },
  ];

  const activitiesData = triggeersStats?.find((stat: any) =>
    stat.name.startsWith(`ACTIVITIES_${projectId.toUpperCase()}`),
  )?.data;

  const progressMetrics =
    activitiesData?.map((item: any) => {
      const phaseName = item.phase?.name ?? 'UNKNOWN';
      const percentage = parseFloat(item.completedPercentage);
      const colors: any = {
        PREPAREDNESS: {
          color: 'bg-teal-500',
          bgColor: 'bg-teal-50',
          borderColor: 'border-teal-200',
        },
        READINESS: {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        },
        ACTIVATION: {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        },
      };

      return {
        title: phaseName,
        percentage,
        ...(colors[phaseName] || {}),
      };
    }) ?? [];

  const imageList = [
    { src: '/projects/project0.png' },
    { src: '/projects/project1.png' },
    { src: '/projects/project2.png' },
    { src: '/projects/project3.png' },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  min-h-[400px] gap-4">
      {/* Left Content Section */}
      <div className="flex flex-col justify-between space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-xl  font-bold text-gray-900">{project?.name}</h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
            {project?.description}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => {
            return (
              <div className="flex items-center gap-6 py-4" key={stat.label}>
                <div className="relative rounded-full p-3 bg-gray-100">
                  {stat.icon}
                </div>

                <div className=" flex flex-col">
                  <h3 className="text-base text-muted-foreground">
                    {stat.label}
                  </h3>
                  <h2 className="text-xl font-bold">{stat.value}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Right Image Section */}
      <div className="relative h-full min-h-[280px] lg:min-h-[400px]">
        <Carousel
          className="w-full shadow-md rounded-sm bg-card p-2 h-full"
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {imageList?.map((item, index) => (
              <CarouselItem
                key={index}
                className="relative w-full h-full min-h-[280px] overflow-hidden rounded-sm lg:min-h-[380px]"
              >
                <Image
                  src={item.src || '/placeholder.svg'}
                  alt={`project-${index}`}
                  fill
                  className=" object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 border-none hover:text-gray-900 shadow-md" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-700 border-none hover:text-gray-900 shadow-md" />
        </Carousel>
      </div>
    </div>
  );
};

export default ResilienceOverview;
