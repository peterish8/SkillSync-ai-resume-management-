'use client';

import ScrollFloat from './ScrollFloat';

interface FeaturesHeadingProps {
  line1: string;
  line2: string;
}

export default function FeaturesHeading({ line1, line2 }: FeaturesHeadingProps) {
  return (
    <div className="text-center mb-16">
      <p className="text-sm font-semibold text-[#3ECF8E] uppercase tracking-wider mb-3">Built for job seekers</p>
      <div className="mb-4">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          containerClassName="mb-0"
          textClassName="text-3xl md:text-4xl lg:text-[56px] font-bold text-white tracking-tight leading-tight"
        >
          {line1}
        </ScrollFloat>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          containerClassName="mt-0"
          textClassName="text-3xl md:text-4xl lg:text-[56px] font-bold tracking-tight leading-tight gradient-text"
        >
          {line2}
        </ScrollFloat>
      </div>
      <p className="text-[#B3B3B3] text-lg max-w-lg mx-auto">
        Powerful tools designed to give you an unfair advantage in your job search.
      </p>
    </div>
  );
}
