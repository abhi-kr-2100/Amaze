import { RectangleName } from "@/components/rectangles/common";
import ISearch, { SingleMazeDiff } from "./ISearch";

export default class DFSSearch implements ISearch {
  #maze: RectangleName[][];
  #agent: [number, number];
  #treasure: [number, number];

  constructor(
    maze: RectangleName[][],
    agents: [number, number][],
    treasures: [number, number][]
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
  #agent: [number, number];
  #treasure: [number, number];

  // Coords (JS arrays) can't be compared for equality reliably.
  // Store coord.toString() instead
  #visitedRectCoords: Set<string> = new Set();

  #toVisitStack: [number, number][] = [];

  constructor(
    maze: RectangleName[][],
    agents: [number, number][],
    treasures: [number, number][]
  ) {
    if (agents.length !== 1 && treasures.length !== 1) {
      throw new Error(
        "DFSSearch: only single agent, single treasure search is supported."
      );
    }

    this.#maze = maze;
    this.#agent = agents[0];
    this.#treasure = treasures[0];

    this.#toVisitStack.push(this.#agent);
  }

  next(...args: [] | [undefined]): IteratorResult<SingleMazeDiff[], any> {
    console.log("next:");
    if (this.#toVisitStack.length === 0) {
      console.log("#toVisitStack exhausted");
      return {
        value: undefined,
        done: true,
      };
    }

    const [r, c] = this.#toVisitStack.pop()!;
    console.log(`visiting ${r},${c}`);
    if (r === this.#treasure[0] && c === this.#treasure[1]) {
      console.log(`treasure found`);
      return {
        value: [{ coord: [r, c], newRect: this.#maze[r][c] }],
        done: true,
      };
    }

    this.#visitedRectCoords.add([r, c].toString());

    [this.#upOf, this.#downOf, this.#leftOf, this.#rightOf]
      .filter((direction) => this.#canVisit(direction([r, c])))
      .forEach((direction) => {
        const toVisit = direction([r, c]);
        console.log(`to visit next ${toVisit}`);
        this.#toVisitStack.push(toVisit);
      });

    return {
      value: [
        {
          coord: [r, c],
          newRect:
            r === this.#agent[0] && c === this.#agent[1]
              ? this.#maze[r][c]
              : "Visited",
        },
      ],
      done: false,
    };
  }

  #upOf(coord: [number, number]): [number, number] {
    return [coord[0] - 1, coord[1]];
  }

  #downOf(coord: [number, number]): [number, number] {
    return [coord[0] + 1, coord[1]];
  }

  #leftOf(coord: [number, number]): [number, number] {
    return [coord[0], coord[1] - 1];
  }

  #rightOf(coord: [number, number]): [number, number] {
    return [coord[0], coord[1] + 1];
  }

  #canVisit(coord: [number, number]) {
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

  return?(value?: any): IteratorResult<SingleMazeDiff[], any> {
    return {
      value,
      done: true,
    };
  }

  throw?(e?: any): IteratorResult<SingleMazeDiff[], any> {
    throw new Error("Method not implemented.");
  }
}
