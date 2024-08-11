export type Coord2D = [number, number];

const RC_SEP = "|";

export function CoordToKey([r, c]: Coord2D) {
  return `${r}${RC_SEP}${c}`;
}

export function KeyToCoord(key: string): Coord2D {
  return key.split(RC_SEP).map(Number) as Coord2D;
}
