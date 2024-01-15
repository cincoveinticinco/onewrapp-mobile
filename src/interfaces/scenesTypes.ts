export interface Character {
  categoryName: string;
  characterName: string;
  characterNum: number;
}

export interface Extra {
  categoryName: string | null;
  extraName: string;
}

export interface Element {
  categoryName: string;
  elementName: string;
}

export interface Note {
  email: string;
  note: string;
}

export interface Scene {
  id: string;
  projectId: string;
  episodeNumber: number;
  sceneNumber: string;
  sceneType: 'scene' | 'protection';
  protectionType: 'voice Off' | 'image' | 'stock image' | 'video' | 'stock video' | 'multimedia' | 'other' | null;
  intOrExtOption: 'INT' | 'EXT' | 'INT/EXT' | 'EXT/INT' | null;
  dayOrNightOption: 'day' | 'night' | 'sunset' | 'sunrise' | null;
  locationName: string | null;
  setName: string;
  scriptDay: string | null;
  year: string | null;
  synopsis: string | null;
  page: number;
  pages: number;
  estimatedSeconds: number | null;
  characters: Character[];
  extras: Extra[] | null; // Extra[] | null; ??
  elements: Element[];
  notes: Note[];
  updatedAt: string;
}