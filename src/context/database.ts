import { AppDataBase } from "../RXdatabase/database";
import { createContext } from "react";

interface DatabaseDefaultContext{
    db: AppDataBase | null
}

export const DatabaseContext = createContext<DatabaseDefaultContext>({
    db: null,
})