// utils/filterCatalog.ts
import CatalogItem from "../lib/types";

const filterCatalog = (catalog: CatalogItem[], filters: string[]) => {
  return catalog.filter((item) =>
    filters.some((filter) => item.labels.includes(filter))
  );
};

export default filterCatalog;
