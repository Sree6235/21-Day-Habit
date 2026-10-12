import React, { useEffect, useRef, useState } from 'react';

export const EyeMascot: React.FC = () => {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Pupil cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const eyes = [leftEyeRef.current, rightEyeRef.current];

      eyes.forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;

        const angle = Math.atan2(deltaY, deltaX);
        const maxRadius = 6; // Pupil movement boundary to prevent clipping
        const distance = Math.min(Math.hypot(deltaX, deltaY) / 12, maxRadius);

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        const pupil = eye.querySelector<HTMLDivElement>('.pupil');
        if (pupil) {
          pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Natural intermittent blink cycle (every ~4.5 seconds)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 p-1 select-none filter drop-shadow-[0_0_8px_rgba(0,255,178,0.2)]"
      title="Focused on your 21-day consistency"
      aria-label="Habit Tracker Eye Mascot"
    >
      {/* Left Eye */}
      <div
        ref={leftEyeRef}
        className={`w-8 h-8 rounded-full bg-slate-50 border border-emerald-400/30 flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(0,255,178,0.25)] transition-transform duration-100 ease-in-out ${
          isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'
        }`}
      >
        <div className="pupil w-3.5 h-3.5 rounded-full bg-[#0d131f] relative pointer-events-none transition-transform duration-75 ease-out shadow-inner">
          {/* Neon catchlight dot */}
          <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#00ffb2] shadow-[0_0_4px_#00ffb2]" />
        </div>
      </div>

      {/* Right Eye */}
      <div
        ref={rightEyeRef}
        className={`w-8 h-8 rounded-full bg-slate-50 border border-emerald-400/30 flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(0,255,178,0.25)] transition-transform duration-100 ease-in-out ${
          isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'
        }`}
      >
        <div className="pupil w-3.5 h-3.5 rounded-full bg-[#0d131f] relative pointer-events-none transition-transform duration-75 ease-out shadow-inner">
          {/* Neon catchlight dot */}
          <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#00ffb2] shadow-[0_0_4px_#00ffb2]" />
        </div>
      </div>
    </div>
  );
};

export default EyeMascot;
