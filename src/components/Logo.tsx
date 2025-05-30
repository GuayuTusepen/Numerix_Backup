
import Image from 'next/image';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const imageSizes = {
    sm: { width: 120, height: 30 }, // Ajustado para la altura típica de la barra de navegación
    md: { width: 180, height: 45 }, // Un tamaño mediano por defecto
    lg: { width: 240, height: 60 }, // Para pantallas de carga, pantallas más grandes
  };

  const selectedSize = imageSizes[size];

  return (
    <div className="flex items-center" data-ai-hint="Numerix app logo">
      <Image
        src="/Logos/logo_numerix.png" // Asegúrate de que esta ruta sea correcta
        alt="Numerix Logo"
        width={selectedSize.width}
        height={selectedSize.height}
        priority // Bueno para elementos LCP como un logo en la barra de navegación o pantalla de carga
        // Añade esto para depurar si la imagen no carga:
        onError={(e) => {
          console.error('Error al cargar el logo:', e.target.id);
          // Puedes cambiar el src a un placeholder si falla, por ejemplo:
          // e.target.src = 'https://placehold.co/100x40.png?text=ErrorLogo';
        }}
        id={`numerix-logo-${size}`}
      />
    </div>
  );
}
