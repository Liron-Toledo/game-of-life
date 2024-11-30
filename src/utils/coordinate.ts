export type CellCoordinates = string; // Format: "x,y"

/**
 * Serializes x and y coordinates into a string.
 * @param x - The x-coordinate.
 * @param y - The y-coordinate.
 * @returns A string representing the coordinates.
 */
export const serializeCoords = (x: number, y: number): CellCoordinates => `${x},${y}`;

/**
 * Deserializes a coordinate string back into numeric x and y values.
 * @param coord - The serialized coordinate string.
 * @returns A tuple containing the x and y coordinates.
 */
export const deserializeCoords = (coord: CellCoordinates): [number, number] =>
  coord.split(',').map(Number) as [number, number];