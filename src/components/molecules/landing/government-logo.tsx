import Image from 'next/image';
import passgoLogo from '../../../../public/assets/logo/passgo-logo.png';

export function GovernmentLogo() {
  return (
    <div className='flex flex-col md:flex-row items-center gap-3 mb-2'>
      <Image src={passgoLogo} width={50} height={50} alt='Government Seal' />
      <div>
        <h1 className='text-lg font-bold text-white'>
          Affiliated with the Department of Immigration and Emigration of Sri Lanka
        </h1>
        <p className='text-xs text-white/80'> Passport Services</p>
      </div>
    </div>
  );
}
