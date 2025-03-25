import { FooterLinkGroup } from './footer-link-group';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-[#112e51] py-6 text-white'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-center md:text-left'>
          <FooterLinkGroup
            title='About'
            links={[
              { text: 'About Us', href: '#' },
              { text: 'Careers', href: '#' },
              { text: 'Press', href: '#' },
            ]}
          />
          <FooterLinkGroup
            title='Resources'
            links={[
              { text: 'Forms', href: '#' },
              { text: 'Travel Advisories', href: '#' },
              { text: 'International Travel', href: '#' },
            ]}
          />
          <FooterLinkGroup
            title='Policies'
            links={[
              { text: 'Privacy Policy', href: '#' },
              { text: 'Terms of Service', href: '#' },
              { text: 'Accessibility', href: '#' },
            ]}
          />
          <div className='sm:col-span-2 md:col-span-1 mx-auto md:mx-0 w-full'>
            <FooterLinkGroup
              title='Connect'
              links={[
                { text: 'Facebook', href: '#' },
                { text: 'Twitter', href: '#' },
                { text: 'Instagram', href: '#' },
              ]}
            />
          </div>
        </div>
        <div className='mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/60'>
          <p className='mt-2'>© {currentYear} PassGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
