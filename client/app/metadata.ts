import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Giftorium - Your Premier Gift Shopping Destination',
    template: '%s | Giftorium'
  },
  description: 'Discover unique and thoughtful gifts for every occasion at Giftorium. From handcrafted items to luxury presents, find the perfect gift that shows you care.',
  keywords: ['gifts', 'gift shop', 'online gifts', 'unique presents', 'gift ideas', 'luxury gifts', 'handcrafted gifts'],
  authors: [{ name: 'Giftorium Team' }],
  creator: 'Giftorium',
  publisher: 'Giftorium',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giftorium.vercel.app',
    siteName: 'Giftorium',
    title: 'Giftorium - Your Premier Gift Shopping Destination',
    description: 'Discover unique and thoughtful gifts for every occasion at Giftorium. From handcrafted items to luxury presents, find the perfect gift that shows you care.',
    images: [
      {
        url: 'https://giftorium.vercel.app/landing.jpg',
        width: 1200,
        height: 630,
        alt: 'Giftorium - Premium Gift Shopping Experience'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giftorium - Your Premier Gift Shopping Destination',
    description: 'Discover unique and thoughtful gifts for every occasion at Giftorium',
    images: ['https://giftorium.vercel.app/landing.jpg'],
    creator: '@giftorium'
  },
  alternates: {
    canonical: 'https://giftorium.vercel.app'
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/placeholder-logo.svg',
    apple: '/placeholder-logo.svg'
  }
};

export function generateMetadata({
  title,
  description,
  images,
  path
}: {
  title?: string;
  description?: string;
  images?: string[];
  path?: string;
}): Metadata {
  return {
    ...defaultMetadata,
    title: title,
    description: description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title,
      description: description,
      images: images ? images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: title
      })) : defaultMetadata.openGraph?.images,
      url: path ? `https://giftorium.vercel.app${path}` : defaultMetadata.openGraph?.url
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title,
      description: description,
      images: images || defaultMetadata.twitter?.images
    },
    alternates: {
      canonical: path ? `https://giftorium.vercel.app${path}` : defaultMetadata.alternates?.canonical
    }
  };
}