import { createContext } from 'react';
import { AppDataBase } from '../RXdatabase/database';

interface DatabaseDefaultContext{
    db: AppDataBase | null
}

export const DatabaseContext = createContext<DatabaseDefaultContext>({
  db: null,
});
