'use client';

import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className='relative'>
      <div className='absolute left-[2.1875rem] top-0 h-full w-px bg-muted' />
      <ol className='relative space-y-8'>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={step.title}
              className={`relative flex gap-6 ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick?.(stepNumber)}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                      ? 'border-primary'
                      : 'border-muted bg-muted'
                }`}
              >
                {isCompleted ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <span className={isCurrent ? 'text-primary' : 'text-muted-foreground'}>
                    {stepNumber}
                  </span>
                )}
              </div>
              <div>
                <h3
                  className={`text-base font-semibold ${
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </h3>
                <p className='text-sm text-muted-foreground'>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
