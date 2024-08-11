import { isRectPathType, RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { Coord2D } from "../maze/common";
import shuffle from "lodash/shuffle";

export default class ManhattanGreedyBestFirstSearch implements ISearch {
  #bestFirstSearch: BestFirstSearch;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "BestFirstSearch: only single agent, single treasure search is supported."
      );
    }

    this.#bestFirstSearch = new BestFirstSearch(
      maze,
      agents,
      treasures,
      this.manhattanDistanceHeuristicsFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#bestFirstSearch[Symbol.iterator]();
  }

  manhattanDistanceHeuristicsFn(a: Coord2D, treasure: Coord2D) {
    return Math.abs(a[0] - treasure[0]) + Math.abs(a[1] - treasure[1]);
  }
}

export class BestFirstSearch implements ISearch {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #heuristicFn: (a: Coord2D, treasure: Coord2D) => number;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    heuristicFn: (a: Coord2D, treasure: Coord2D) => number
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "BestFirstSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#heuristicFn = heuristicFn;
  }

  [Symbol.iterator](): BestFirstSearchIterator {
    return new BestFirstSearchIterator(
      this.#maze,
      [this.#agent],
      [this.#treasure],
      this.#heuristicFn
    );
  }
}

class BestFirstSearchIterator
  implements Iterator<SingleMazeDiff[], any, undefined>
{
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #heuristicFn: (a: Coord2D, treasure: Coord2D) => number;

  #done: boolean = false;

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store coord.toString() instead
  visitedRectCoords: Set<string> = new Set();
  coordToParent: Map<string, Coord2D | undefined> = new Map();

  // information about parent lets us reconstruct the path
  toVisitStack: Coord2D[] = [];

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    heuristicFn: (a: Coord2D, treasure: Coord2D) => number
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "BestFirstSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#heuristicFn = heuristicFn;

    this.toVisitStack.push(this.#agent);
    this.coordToParent.set(this.#agent.toString(), undefined);
  }

  next(...args: [] | [undefined]): IteratorResult<SingleMazeDiff[], any> {
    if (this.#done) {
      return { value: undefined, done: true };
    }

    if (this.toVisitStack.length === 0) {
      this.#done = true;

      return {
        value: [],
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

    this.visitedRectCoords.add([r, c].toString());

    shuffle([this.#leftOf, this.#downOf, this.#rightOf, this.#upOf])
      .filter((direction) => this.#canVisit(direction([r, c])))
      .forEach((direction) => {
        const nextCoord = direction([r, c]);
        const key = nextCoord.toString();

        if (!this.coordToParent.has(key)) {
          this.coordToParent.set(key, [r, c]);
        }

        this.toVisitStack.push(nextCoord);
      });

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
      !this.visitedRectCoords.has([r, c].toString())
    );
  }

  #getIndexOfBestCoord(coords: Coord2D[]) {
    if (coords.length === 0) {
      return -1;
    }

    let min = this.#heuristicFn(coords[0], this.#treasure);
    let minIdx = 0;
    for (let i = 1; i < coords.length; ++i) {
      const v = this.#heuristicFn(coords[i], this.#treasure);
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
    let path = [];
    for (
      let c = currentCoord;
      c !== undefined;
      c = this.coordToParent.get(c.toString())!
    ) {
      path.push(c);
    }

    return path
      .filter((c) => isRectPathType(this.#maze[c[0]][c[1]]))
      .map((coord) => ({
        coord,
        newRect: "PathTaken",
      }));
  }
}
