import { PassportRenewalsList } from '@/components/molecules/passport-renewals-list';
import { Container } from '@/components/ui/container';

export default function PassportRenewalPage() {
  return (
    <Container>
      <div className='py-8'>
        <PassportRenewalsList />
      </div>
    </Container>
  );
}
