//TODO: remove after merge

'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useAuthStore } from '@rumsan/react-query/auth';

export function ExternalProjectCard({ project }) {
  const { token } = useAuthStore();
  const handleSubmit = async () => {
    try {
      const baseUrl = project.baseUrl || 'http://localhost:3000';
      const redirectPath = project.redirectPath || '/dashboard';
      const magicLink = `${baseUrl}/magic-link?access-token=${token}&redirect=/${redirectPath}`;
      console.log('Magic link:', magicLink);
      window.open(magicLink, '_blank'); // Open the magic link in a new tab
    } catch (error) {
      console.error("Error constructing magic link:", error);
      alert("Failed to construct magic link");
    }
  };

  return (
    <Card
      onClick={handleSubmit}
      className="cursor-pointer rounded-md border shadow"
    >
      <div className="p-4">
        <div className="rounded-md bg-secondary flex justify-center">
          <Image
            className="object-contain"
            src={project.image || '/rahat-logo.png'}
            alt={project.name}
            height={200}
            width={200}
          />
        </div>
      </div>
      <CardContent>
        <p className="font-bold text-md text-primary mb-1">{project.name}</p>
        <Badge
          variant="outline"
          className="border-primary text-primary cursor-auto bg-secondary mb-2"
        >
          {project.type || 'External'}
        </Badge>
        <p className="text-sm text-gray-500">{project.description}</p>
      </CardContent>
    </Card>
  );
}
