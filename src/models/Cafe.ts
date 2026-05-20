export interface Cafe {
  id: string | number;
  name: string;
  category: string;
  priceRange: string;
  latlong: string;
  shortDescription: string;
  rating: string;
  isFavorited: string;
  image: string;
  menuId: string;
  description1: string;
  description2: string;
  distance?: string;
}

export interface Menu {
  id: string | number;
  name: string;
  description: string;
  image: string;
}

export interface CafeResponse {
  message?: string;
  data: Cafe[];
}

export interface MenuResponse {
  message?: string;
  data: Menu | Menu[];
}
