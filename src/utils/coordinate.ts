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
export const deserializeCoords = (coord: CellCoordinates): [number, number] => {
  const parts = coord.split(',');

  // Ensure we have exactly two parts
  if (parts.length !== 2) {
    throw new Error(`Invalid coordinate string: "${coord}"`);
  }

  const [xStr, yStr] = parts;

  // Check for empty strings
  if (xStr === '' || yStr === '') {
    throw new Error(`Invalid coordinate string: "${coord}"`);
  }

  const x = Number(xStr);
  const y = Number(yStr);

  // Ensure both parts are valid numbers
  if (isNaN(x) || isNaN(y)) {
    throw new Error(`Invalid coordinate string: "${coord}"`);
  }

  return [x, y];
};