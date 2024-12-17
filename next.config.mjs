import withPlaiceholder from '@plaiceholder/next';
/**@type{import('next').NextConfig}*/
const nextConfig = {
  productionBrowserSourceMaps: false,
  transpilePackages: ['@plaiceholder/next'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.netbian.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'pic3.zhimg.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com.cn',
      },
      {
        protocol: 'https',
        hostname: 'store.storeimages.cdn-apple.com',
      }

    ],
  },
};
export default withPlaiceholder(nextConfig)
