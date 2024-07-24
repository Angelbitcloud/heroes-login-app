export interface ComicDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: ComicDataContainer;
}

export interface ComicDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Comic[];
}

export interface Comic {
  id: number;
  title: string;
  description: string;
  thumbnail: Image;
  dates: ComicDate[];
  prices: ComicPrice[];
}

export interface Image {
  path: string;
  extension: string;
}

export interface ComicDate {
  type: string;
  date: string;
}

export interface ComicPrice {
  type: string;
  price: number;
}
