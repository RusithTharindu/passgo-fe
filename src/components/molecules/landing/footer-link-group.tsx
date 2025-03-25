import Link from 'next/link';

interface FooterLinkGroupProps {
  title: string;
  links: {
    text: string;
    href: string;
  }[];
}

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className='mx-auto md:mx-0 w-full'>
      <h3 className='mb-4 text-lg font-medium'>{title}</h3>
      <ul className='space-y-2 text-sm'>
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className='text-white/80 hover:text-white'>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
