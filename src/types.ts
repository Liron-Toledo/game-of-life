export interface CellType {
    isAlive: boolean;
    color: string;
}

export type GridType = CellType[][];