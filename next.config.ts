import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // No es estrictamente necesario añadir 'domains' para imágenes locales servidas desde `public`,
    // pero remotePatterns se mantiene por si aún se usan placeholders en otros lugares.
    // Si solo usaras imágenes locales, esta sección de `images` podría simplificarse o incluso eliminarse
    // si no hay optimizaciones específicas requeridas para dominios externos.
  },
};

export default nextConfig;
