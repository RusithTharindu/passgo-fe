import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RenewPassportStatus } from '@/types/passportRenewalTypes';

interface StatusBadgeProps {
  status: RenewPassportStatus;
  className?: string;
}

const statusConfig = {
  [RenewPassportStatus.PENDING]: {
    label: 'Pending',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600 bg-amber-50',
  },
  [RenewPassportStatus.VERIFIED]: {
    label: 'Verified',
    variant: 'outline',
    className: 'border-green-500 text-green-600 bg-green-50',
  },
  [RenewPassportStatus.REJECTED]: {
    label: 'Rejected',
    variant: 'outline',
    className: 'border-red-500 text-red-600 bg-red-50',
  },
  [RenewPassportStatus.READY_TO_COLLECT]: {
    label: 'Ready to Collect',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600 bg-blue-50',
  },
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    // Fallback for unknown status
    return (
      <Badge
        variant='outline'
        className={cn('border-gray-500 text-gray-600 bg-gray-50', className)}
      >
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant='outline' className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
