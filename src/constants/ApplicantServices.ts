import { ServiceCardType } from '@/types/commonTypes';

// TODO: Change the applicant routes to the actual routes

export const ApplicantServices: ServiceCardType[] = [
  {
    id: 1,
    title: 'New Passport Request',
    description:
      'Apply for a new passport with our streamlined process. Complete your application online and track its progress in real-time.',
    image: '/assets/images/applicant-home/img-1.jpg',
    link: '/applicant/passport/new',
    imagePosition: 'right',
    linkText: 'Apply New Passport',
  },
  {
    id: 2,
    title: 'Check Application Status',
    description:
      'Track the status of your passport application anytime, anywhere. Get real-time updates on your application process.',
    image: '/assets/images/applicant-home/img-2.png',
    link: '/applicant/status',
    imagePosition: 'left',
    linkText: 'Check Application Status',
  },
  {
    id: 3,
    title: 'Book an Appointment',
    description:
      'Schedule your passport interview or document submission at your convenience. Choose from available time slots.',
    image: '/assets/images/applicant-home/img-3.jpg',
    link: '/applicant/appointment',
    imagePosition: 'right',
    linkText: 'Book an Appointment',
  },
  {
    id: 4,
    title: 'Passport Renewal Request',
    description:
      'Renew your passport before it expires. Our simplified renewal process makes it easy to update your travel documents.',
    image: '/assets/images/applicant-home/img-4.webp',
    link: '/applicant/passport/renewal',
    imagePosition: 'left',
    linkText: 'Renew Passport',
  },
];
