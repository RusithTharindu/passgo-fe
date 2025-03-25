import Image from 'next/image';

export function GovernmentLogo() {
  return (
    <div className='flex flex-col md:flex-row items-center gap-3 mb-2'>
      <div className='h-10 w-10 bg-white p-1 rounded-sm'>
        <Image
          src='/favicon.ico'
          width={40}
          height={40}
          alt='Government Seal'
          className='h-8 w-aut'
        />
      </div>
      <div>
        <h1 className='text-lg font-bold'>Department of Immigration and Emigration of Sri Lanka</h1>
        <p className='text-xs text-white/80'>Passport Services</p>
      </div>
    </div>
  );
}
