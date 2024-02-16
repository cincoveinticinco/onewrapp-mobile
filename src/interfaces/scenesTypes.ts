export interface Character {
  categoryName: string;
  characterName: string;
  characterNum: string | null;
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
  email: string | null;
  note: string | null;
}

export interface Scene {
  id?: string | null;
  projectId?: number | null;
  episodeNumber?: string | null;
  sceneNumber?: string | null;
  sceneType?: string | null;
  protectionType?: string| null;
  intOrExtOption?: string | null;
  dayOrNightOption?: string | null;
  locationName?: string | null;
  setName?: string | null;
  scriptDay?: string | null;
  year?: string | null;
  synopsis?: string | null;
  page?: number | null;
  pages?: number | null;
  estimatedSeconds?: number | null;
  characters?: Character[] | null;
  extras?: Extra[] | null;
  elements?: Element[] | null;
  notes?: Note[] | null;
  updatedAt?: string | null;
}
