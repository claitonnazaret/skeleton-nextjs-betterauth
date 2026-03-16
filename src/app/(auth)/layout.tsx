import { Card } from '@/src/components/ui/card';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs">
        <Card className="w-full sm:max-w-lg">{children}</Card>
      </div>
    </div>
  );
}
