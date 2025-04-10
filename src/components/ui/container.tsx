import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
  as?: React.ElementType;
}

/**
 * A reusable container component that provides consistent padding and max-width
 * across the application.
 *
 * @param children Content to display inside the container
 * @param className Additional classes to apply
 * @param fluid Whether to use full width (true) or constrained width (false)
 * @param as The HTML element to render as (defaults to div)
 */
export function Container({
  children,
  className,
  fluid = false,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={cn('w-full px-4 mx-auto', fluid ? 'max-w-none' : 'max-w-7xl', className)}>
      {children}
    </Component>
  );
}
