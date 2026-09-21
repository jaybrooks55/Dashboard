export interface BibleImage {
  src: string;
  alt: string;
  credit: string;
}

export interface TimelineEntry {
  id: string;
  era: string;
  approxDate: string;
  title: string;
  reference: string;
  excerpt: string;
  summary: string;
  image: BibleImage;
}

export interface BiblePerson {
  id: string;
  name: string;
  testament: "Old" | "New";
  role: string;
  era: string;
  summary: string;
  keyReference: string;
  image: BibleImage;
}

export interface LineagePerson {
  name: string;
  note?: string;
}

export interface Lineage {
  title: string;
  reference: string;
  explanation: string;
  generations: LineagePerson[];
}
