import { isRectPathType, RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { Coord2D, CoordToKey, KeyToCoord } from "../maze/common";
import shuffle from "lodash/shuffle";

export default class AStarSearch implements ISearch {
  #aStarSearch: AStarSearchBase;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "AStar: only single agent, single treasure search is supported."
      );
    }

    this.#aStarSearch = new AStarSearchBase(
      maze,
      agents,
      treasures,
      this.manhattanDistanceHeuristicsFn,
      this.costFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#aStarSearch[Symbol.iterator]();
  }

  costFn(toVisit: Coord2D, coordToParent: Map<string, Coord2D | undefined>) {
    // -1 because the cost when toVisit is the source, the cost should be zero
    let pathLength = -1;

    for (
      let c: Coord2D | undefined = toVisit;
      c !== undefined;
      c = coordToParent.get(CoordToKey(c))
    ) {
      ++pathLength;
    }

    return pathLength;
  }

  manhattanDistanceHeuristicsFn(a: Coord2D, treasure: Coord2D) {
    return Math.abs(a[0] - treasure[0]) + Math.abs(a[1] - treasure[1]);
  }
}

export class AStarSearchBase implements ISearch {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #heuristicFn: (a: Coord2D, treasure: Coord2D) => number;
  #costFn: (
    toVisit: Coord2D,
    coordToParent: Map<string, Coord2D | undefined>
  ) => number;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    heuristicFn: (a: Coord2D, treasure: Coord2D) => number,
    costFn: (
      toVisit: Coord2D,
      coordToParent: Map<string, Coord2D | undefined>
    ) => number
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "AStar: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#heuristicFn = heuristicFn;
    this.#costFn = costFn;
  }

  [Symbol.iterator](): AStarSearchIterator {
    return new AStarSearchIterator(
      this.#maze,
      [this.#agent],
      [this.#treasure],
      this.#heuristicFn,
      this.#costFn
    );
  }
}

class AStarSearchIterator
  implements Iterator<SingleMazeDiff[], any, undefined>
{
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #heuristicFn: (a: Coord2D, treasure: Coord2D) => number;
  #costFn: (
    toVisit: Coord2D,
    coordToParent: Map<string, Coord2D | undefined>
  ) => number;

  #done: boolean = false;

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store a string version of the coords instead
  visitedRectCoords: Set<string> = new Set();
  coordToParent: Map<string, Coord2D | undefined> = new Map();

  // information about parent lets us reconstruct the path
  toVisitStack: Coord2D[] = [];

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    heuristicFn: (a: Coord2D, treasure: Coord2D) => number,
    costFn: (
      toVisit: Coord2D,
      coordToParent: Map<string, Coord2D | undefined>
    ) => number
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "AStar: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#heuristicFn = heuristicFn;
    this.#costFn = costFn;

    this.toVisitStack.push(this.#agent);
    this.coordToParent.set(CoordToKey(this.#agent), undefined);
  }

  next(...args: [] | [undefined]): IteratorResult<SingleMazeDiff[], any> {
    if (this.#done) {
      return { value: undefined, done: true };
    }

    if (this.toVisitStack.length === 0) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("EXHAUSTED");

      return {
        value: diffs,
        done: false,
      };
    }

    const minFnCoordIdx = this.#getIndexOfBestCoord(this.toVisitStack);
    const [r, c] = this.toVisitStack.splice(minFnCoordIdx, 1)[0]!;

    if (r === this.#treasure[0] && c === this.#treasure[1]) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("FOUND", [r, c]);

      return {
        value: diffs,
        done: false,
      };
    }

    this.visitedRectCoords.add(CoordToKey([r, c]));

    const toVisitNext = shuffle([
      this.#leftOf,
      this.#downOf,
      this.#rightOf,
      this.#upOf,
    ]).filter((direction) => this.#canVisit(direction([r, c])));

    toVisitNext.forEach((direction) => {
      const nextCoord = direction([r, c]);
      const key = CoordToKey(nextCoord);

      if (!this.coordToParent.has(key)) {
        this.coordToParent.set(key, [r, c]);
      }

      this.toVisitStack.push(nextCoord);
    });

    if (toVisitNext.length === 0) {
      const difss = this.#getDiffsForContext("STUCK", [r, c]);

      return {
        value: difss,
        done: false,
      };
    }

    return {
      value: [],
      done: false,
    };
  }

  return?(value?: any): IteratorResult<SingleMazeDiff[], any> {
    return {
      value,
      done: true,
    };
  }

  throw?(e?: any): IteratorResult<SingleMazeDiff[], any> {
    throw new Error("Method not implemented.");
  }

  #upOf(coord: Coord2D): Coord2D {
    return [coord[0] - 1, coord[1]];
  }

  #downOf(coord: Coord2D): Coord2D {
    return [coord[0] + 1, coord[1]];
  }

  #leftOf(coord: Coord2D): Coord2D {
    return [coord[0], coord[1] - 1];
  }

  #rightOf(coord: Coord2D): Coord2D {
    return [coord[0], coord[1] + 1];
  }

  #canVisit(coord: Coord2D) {
    const [r, c] = coord;

    return (
      r >= 0 &&
      c >= 0 &&
      r < this.#maze.length &&
      this.#maze.length > 0 &&
      c < this.#maze[0].length &&
      this.#maze[r][c] !== "Wall" &&
      !this.visitedRectCoords.has(CoordToKey([r, c]))
    );
  }

  #getIndexOfBestCoord(coords: Coord2D[]) {
    if (coords.length === 0) {
      return -1;
    }

    let min =
      this.#heuristicFn(coords[0], this.#treasure) +
      this.#costFn(coords[0], this.coordToParent);
    let minIdx = 0;
    for (let i = 1; i < coords.length; ++i) {
      const v =
        this.#heuristicFn(coords[i], this.#treasure) +
        this.#costFn(coords[i], this.coordToParent);
      if (v < min) {
        min = v;
        minIdx = i;
      }
    }

    return minIdx;
  }

  #getDiffsForContext(
    extraContext: "EXHAUSTED" | "FOUND" | "STUCK",
    currentCoord?: Coord2D
  ): SingleMazeDiff[] {
    switch (extraContext) {
      case "STUCK": {
        return [];
      }
      case "EXHAUSTED": {
        return [...this.visitedRectCoords]
          .map(KeyToCoord)
          .filter(([r, c]) => isRectPathType(this.#maze[r][c]))
          .map((coord) => ({
            coord,
            newRect: "PathAbandoned",
          }));
      }
      case "FOUND": {
        let path = new Set<string>();
        for (
          let c = currentCoord;
          c !== undefined;
          c = this.coordToParent.get(CoordToKey(c))!
        ) {
          path.add(CoordToKey(c));
        }
        const pathDiffs: SingleMazeDiff[] = [...path]
          .map(KeyToCoord)
          .filter(([r, c]) => isRectPathType(this.#maze[r][c]))
          .map((coord) => ({
            coord,
            newRect: "PathTaken",
          }));

        let abandoned = this.visitedRectCoords.difference(path);
        const abandonedDiffs: SingleMazeDiff[] = [...abandoned]
          .map(KeyToCoord)
          .filter(([r, c]) => isRectPathType(this.#maze[r][c]))
          .map((coord) => ({
            coord,
            newRect: "PathAbandoned",
          }));

        return [...abandonedDiffs, ...pathDiffs];
      }
    }
  }
}
