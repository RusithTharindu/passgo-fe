interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
}

export function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className='flex flex-col items-center space-y-2 text-center mx-auto w-full max-w-xs'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#0071bc] text-white'>
        {number}
      </div>
      <h3 className='text-lg font-bold text-[#112e51]'>{title}</h3>
      <p className='text-sm text-gray-600'>{description}</p>
    </div>
  );
}
