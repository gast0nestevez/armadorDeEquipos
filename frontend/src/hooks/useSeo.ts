import { useEffect } from 'react';

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
};

const SITE_URL: string = 'https://armador-de-equipos.vercel.app';

const setAttribute: (selector: string, attribute: 'content' | 'href', value: string) => void = (
  selector: string,
  attribute: 'content' | 'href',
  value: string
): void => {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
};

const useSeo = ({ title, description, path, indexable = true }: SeoOptions): void => {
  useEffect((): void => {
    const url: string = `${SITE_URL}${path}`;

    document.title = title;
    setAttribute('meta[name="description"]', 'content', description);
    setAttribute(
      'meta[name="robots"]',
      'content',
      indexable ? 'index, follow' : 'noindex, nofollow'
    );
    setAttribute('link[rel="canonical"]', 'href', url);
    setAttribute('meta[property="og:title"]', 'content', title);
    setAttribute('meta[property="og:description"]', 'content', description);
    setAttribute('meta[property="og:url"]', 'content', url);
    setAttribute('meta[name="twitter:title"]', 'content', title);
    setAttribute('meta[name="twitter:description"]', 'content', description);
  }, [title, description, path, indexable]);
};

export type { SeoOptions };

export { useSeo };
