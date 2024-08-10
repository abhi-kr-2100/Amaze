import { isRectPathType, RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { Coord2D } from "../maze/common";
import shuffle from "lodash/shuffle";

export default class BFSSearch implements ISearch {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "BFSSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
  }

  [Symbol.iterator](): BFSIterator {
    return new BFSIterator(this.#maze, [this.#agent], [this.#treasure]);
  }
}

class BFSIterator implements Iterator<SingleMazeDiff[], any, undefined> {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store coord.toString() instead
  #visitedRectCoords: Set<string> = new Set();
  #coordToParent: Map<string, Coord2D | undefined> = new Map();
  #toVisitQueue: Coord2D[] = [];

  #done: boolean = false;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "BFSSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];

    this.#toVisitQueue.push(this.#agent);
    this.#coordToParent.set(this.#agent.toString(), undefined);
  }

  next(...args: [] | [undefined]): IteratorResult<SingleMazeDiff[], any> {
    if (this.#done) {
      return { value: undefined, done: true };
    }

    while (
      this.#toVisitQueue.length !== 0 &&
      this.#visitedRectCoords.has(this.#toVisitQueue[0].toString())
    ) {
      this.#toVisitQueue.shift();
    }

    if (this.#toVisitQueue.length === 0) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("EXHAUSTED");
      return { value: diffs, done: false };
    }

    const [r, c] = this.#toVisitQueue.shift()!;
    if (r === this.#treasure[0] && c === this.#treasure[1]) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("FOUND", [r, c]);
      return { value: diffs, done: false };
    }

    this.#visitedRectCoords.add([r, c].toString());

    shuffle([this.#leftOf, this.#downOf, this.#rightOf, this.#upOf])
      .filter((direction) => this.#canVisit(direction([r, c])))
      .forEach((direction) => {
        const nextCoord = direction([r, c]);
        const key = nextCoord.toString();

        if (!this.#coordToParent.has(key)) {
          this.#coordToParent.set(key, [r, c]);
        }

        this.#toVisitQueue.push(nextCoord);
      });

    const diffs = this.#getDiffsForContext("NOT_FOUND", [r, c]);
    return {
      value: diffs,
      done: false,
    };
  }

  #getDiffsForContext(
    extraContext: "FOUND" | "NOT_FOUND" | "EXHAUSTED",
    currentRectCoord?: Coord2D
  ): SingleMazeDiff[] {
    switch (extraContext) {
      case "EXHAUSTED":
        return [];
      case "NOT_FOUND": {
        if (currentRectCoord === undefined) {
          throw new Error(
            "BFSSearch.#getDiffsForContext: NOT_FOUND at undefined coord."
          );
        }

        const rect = this.#maze[currentRectCoord[0]][currentRectCoord[1]];
        return [
          {
            coord: currentRectCoord,
            newRect: isRectPathType(rect) ? "PathAbandoned" : rect,
          },
        ];
      }
      case "FOUND": {
        if (currentRectCoord === undefined) {
          throw new Error(
            "BFSSearch.#getDiffsForContext: current coord can't be undefined in case of FOUND"
          );
        }

        const path = this.#getPathTill(currentRectCoord);
        return path
          .filter(([r, c]) => isRectPathType(this.#maze[r][c]))
          .map((coord) => ({
            coord,
            newRect: "PathTaken",
          }));
      }
    }
  }

  #getPathTill(coord: Coord2D): Coord2D[] {
    let path: Coord2D[] = [];
    for (
      let currentCoord: Coord2D | undefined = coord;
      currentCoord !== undefined;

    ) {
      path.push(currentCoord);
      const key = currentCoord.toString();

      if (!this.#coordToParent.has(key)) {
        throw new Error("BFSSearch.#getPathTill: unreached coordinate");
      }

      const parent = this.#coordToParent.get(key);
      currentCoord = parent;
    }

    return path.toReversed();
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
      this.#maze[r][c] !== "Wall"
    );
  }
}
