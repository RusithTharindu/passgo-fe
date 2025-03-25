import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  content: string;
  className?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  content,
  className,
}: ServiceCardProps) {
  return (
    <Card className={`border-2 border-[#dcdcdc] mx-auto w-full ${className}`}>
      <CardHeader className='text-center'>
        <CardTitle className='flex items-center justify-center gap-2 text-[#112e51]'>
          <Icon className='h-5 w-5 text-[#0071bc]' />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='text-center'>
        <p className='text-sm text-gray-600'>{content}</p>
        <Button variant='link' className='mt-4 p-0 text-[#0071bc]'>
          Learn more
        </Button>
      </CardContent>
    </Card>
  );
}
