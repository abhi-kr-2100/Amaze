import { isRectPathType, RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { Coord2D } from "../maze/common";
import shuffle from "lodash/shuffle";

export default class DFSSearch implements ISearch {
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
        "DFSSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];
  }

  [Symbol.iterator](): DFSIterator {
    return new DFSIterator(this.#maze, [this.#agent], [this.#treasure]);
  }
}

class DFSIterator implements Iterator<SingleMazeDiff[], any, undefined> {
  #maze: RectangleName[][];
  #agent: Coord2D;
  #treasure: Coord2D;

  #done: boolean = false;

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store coord.toString() instead
  #visitedRectCoords: Set<string> = new Set();

  // information about parent lets us reconstruct the path
  #toVisitStack: CoordWithParent[] = [];
  #currentPath: CoordWithParent[] = [];

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "DFSSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];

    this.#toVisitStack.push({ coord: this.#agent });
  }

  next(...args: [] | [undefined]): IteratorResult<SingleMazeDiff[], any> {
    if (this.#done) {
      return { value: undefined, done: true };
    }

    if (this.#toVisitStack.length === 0) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("EXHAUSTED");
      this.#currentPath = [];

      return {
        value: diffs,
        done: false,
      };
    }

    const {
      coord: [r, c],
      parent,
    } = this.#toVisitStack.pop()!;
    this.#currentPath.push({ coord: [r, c], parent });

    if (r === this.#treasure[0] && c === this.#treasure[1]) {
      this.#done = true;

      const diffs = this.#getDiffsForContext("FOUND");
      this.#currentPath = [];

      return {
        value: diffs,
        done: false,
      };
    }

    this.#visitedRectCoords.add([r, c].toString());

    const toVisitNext = shuffle([
      this.#leftOf,
      this.#downOf,
      this.#rightOf,
      this.#upOf,
    ]).filter((direction) => this.#canVisit(direction([r, c])));

    toVisitNext.forEach((direction) =>
      this.#toVisitStack.push({ coord: direction([r, c]), parent: [r, c] })
    );

    if (toVisitNext.length === 0) {
      const diffs = this.#getDiffsForContext("STUCK");
      const numToAbandon = this.#getCoordsToAbandonOnStuck().length;
      this.#currentPath.splice(-numToAbandon);

      return {
        value: diffs,
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
      !this.#visitedRectCoords.has([r, c].toString())
    );
  }

  #getDiffsForContext(
    extraContext: "EXHAUSTED" | "FOUND" | "STUCK"
  ): SingleMazeDiff[] {
    if (this.#currentPath.length === 0) {
      return [];
    }

    if (extraContext === "STUCK") {
      const toAbandon = this.#getCoordsToAbandonOnStuck();
      return toAbandon
        .filter((coord) => isRectPathType(this.#maze[coord[0]][coord[1]]))
        .map((coord) => ({
          coord,
          newRect: "PathAbandoned",
        }));
    }

    return this.#currentPath
      .filter(({ coord: [r, c] }) => isRectPathType(this.#maze[r][c]))
      .map(({ coord }) => ({
        coord,
        newRect: extraContext === "FOUND" ? "PathTaken" : "PathAbandoned",
      }));
  }

  /**
   * When the visit stack is exhausted or when the treasure is found,
   * we can, reject or accept the entire path. However, when we're
   * stuck, but we can go backtrack, we must calculate how many steps
   * back.
   *
   * Here's the goal: go back to the parent of an unvisited rect in
   * #toVisitStack. The parent is guaranteed to have occurred on the
   * current path. Hence, we can safely backtrack to the parent. */
  #getCoordsToAbandonOnStuck(): Coord2D[] {
    let toAbandon = [];

    const nextVisit = this.#toVisitStack.findLast(({ coord }) =>
      this.#canVisit(coord)
    );

    if (nextVisit === undefined) {
      return this.#currentPath.map(({ coord }) => coord);
    }

    const targetParent = nextVisit.parent;

    for (let i = 1; i <= this.#currentPath.length; ++i) {
      const { coord: currCoord, parent: currParent } = this.#currentPath.at(
        -i
      )!;
      if (
        currCoord[0] === targetParent?.[0] &&
        currCoord[1] === targetParent?.[1]
      ) {
        break;
      }

      toAbandon.push(currCoord);
    }

    return toAbandon;
  }
}

interface CoordWithParent {
  coord: Coord2D;
  parent?: Coord2D;
}
