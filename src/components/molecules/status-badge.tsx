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
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant='outline' className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
