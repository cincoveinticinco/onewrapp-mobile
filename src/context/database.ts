import { createContext } from 'react';
import AppDataBase from '../RXdatabase/database';

interface DatabaseDefaultContext{
    db: AppDataBase | null
}

const DatabaseContext = createContext<DatabaseDefaultContext>({
  db: null,
});

export default DatabaseContext;
