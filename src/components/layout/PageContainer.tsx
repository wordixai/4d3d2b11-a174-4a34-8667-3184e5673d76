import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, hsl(174, 72%, 46%), transparent)',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, hsl(36, 90%, 55%), transparent)',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
