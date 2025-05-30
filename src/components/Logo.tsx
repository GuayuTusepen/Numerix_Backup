import Image from 'next/image';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const imageSizes = {
    sm: { width: 120, height: 30 }, // Adjusted for typical navbar height
    md: { width: 180, height: 45 }, // A medium default
    lg: { width: 240, height: 60 }, // For splash screens, larger displays
  };

  const selectedSize = imageSizes[size];

  return (
    <div className="flex items-center" data-ai-hint="Numerix app logo">
      <Image
        src="/Logos/NumerixLogo.png" // Assuming this will be the path to your new logo
        alt="Numerix Logo"
        width={selectedSize.width}
        height={selectedSize.height}
        priority // Good for LCP elements like a logo in the navbar or splash
      />
    </div>
  );
}
