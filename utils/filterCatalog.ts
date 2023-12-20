// utils/filterCatalog.ts
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

const filterCatalog = (catalog: CatalogItem[], filters: string[]) => {
  return catalog.filter((item) =>
    filters.some((filter) => item.labels.includes(filter))
  );
};

export default filterCatalog;
