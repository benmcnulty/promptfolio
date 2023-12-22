// lib/types.ts
interface CatalogItem {
  name: string;
  description: string;
  link: string;
  image: string;
  alt: string;
  listed: Date;
  labels: string[];
  tags: string[];
  media: string[];
}

export default CatalogItem;
