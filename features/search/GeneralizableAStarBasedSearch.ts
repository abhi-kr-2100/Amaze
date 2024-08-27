import { isRectPathType, RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { Coord2D, CoordToKey, KeyToCoord } from "../maze/common";
import shuffle from "lodash/shuffle";
import { CostFn, HeuristicFn, NextCoordIdxFn } from "./common";
import { InvalidAgentOrTreasureCountError } from "./errors";

export default class GeneralizableAStarBasedSearch implements ISearch {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #nextCoordIdxFn: NextCoordIdxFn;

  #heuristicFn: HeuristicFn;
  #costFn: CostFn;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    nextCoordIdxStrategy: NextCoordIdxFn,
    heuristicFn: HeuristicFn,
    costFn: CostFn
  ) {
    if (agents.length !== 1 || treasures.length !== 1) {
      throw new InvalidAgentOrTreasureCountError(
        "Search: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#nextCoordIdxFn = nextCoordIdxStrategy;
    this.#heuristicFn = heuristicFn;
    this.#costFn = costFn;
  }

  [Symbol.iterator](): GeneralizableAStarBasedSearchIterator {
    return new GeneralizableAStarBasedSearchIterator(
      this.#maze,
      [this.#agent],
      [this.#treasure],
      this.#nextCoordIdxFn,
      this.#heuristicFn,
      this.#costFn
    );
  }
}

class GeneralizableAStarBasedSearchIterator
  implements Iterator<SingleMazeDiff[], any, undefined>
{
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #nextCoordIdxFn: NextCoordIdxFn;

  #heuristicFn: HeuristicFn;
  #costFn: CostFn;

  #done: boolean = false;

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store a string version of the coords instead.
  visitedRectCoords: Set<string> = new Set();
  coordToParent: Map<string, Coord2D | undefined> = new Map();

  toVisitStack: Coord2D[] = [];

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[],
    nextCoordIdxFn: NextCoordIdxFn,
    heuristicFn: HeuristicFn,
    costFn: CostFn
  ) {
    if (agents.length !== 1 || treasures.length !== 1) {
      throw new InvalidAgentOrTreasureCountError(
        "SearchIterator: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
    this.#nextCoordIdxFn = nextCoordIdxFn;
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

    const coordToVisitIdx = this.#nextCoordIdxFn(
      this.toVisitStack,
      this.#treasure,
      this.coordToParent,
      this.#heuristicFn,
      this.#costFn
    );
    const [r, c] = this.toVisitStack.splice(coordToVisitIdx, 1)[0]!;

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

        let abandoned = setDifference(this.visitedRectCoords, path);
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

// The Hermes JS engine doesn't seem to support Set.difference() yet.
function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  return new Set([...set1].filter((x) => !set2.has(x)));
}
