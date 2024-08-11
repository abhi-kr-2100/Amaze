import { RectangleName } from "@/components/rectangles/common";
import { Coord2D, CoordToKey } from "../maze/common";
import { CostFn, HeuristicFn } from "./common";
import GeneralizableAStarBasedSearch from "./GeneralizableAStarBasedSearch";
import ISearch, { SingleMazeDiff } from "./ISearch";

export default class AStarSearch implements ISearch {
  #aStarSearch: GeneralizableAStarBasedSearch;

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

    this.#aStarSearch = new GeneralizableAStarBasedSearch(
      maze,
      agents,
      treasures,
      this.nextCoordIdxFn,
      this.manhattanDistanceHeuristicsFn,
      this.costFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#aStarSearch[Symbol.iterator]();
  }

  nextCoordIdxFn(
    visitable: Coord2D[],
    goal: Coord2D,
    coordToParent: Map<string, Coord2D | undefined>,
    heuristicFn: HeuristicFn,
    costFn: CostFn
  ) {
    if (visitable.length === 0) {
      return -1;
    }

    let min =
      heuristicFn(visitable[0], goal) + costFn(visitable[0], coordToParent);
    let minIdx = 0;
    for (let i = 1; i < visitable.length; ++i) {
      const v =
        heuristicFn(visitable[i], goal) + costFn(visitable[i], coordToParent);
      if (v < min) {
        min = v;
        minIdx = i;
      }
    }

    return minIdx;
  }

  manhattanDistanceHeuristicsFn(a: Coord2D, treasure: Coord2D) {
    return Math.abs(a[0] - treasure[0]) + Math.abs(a[1] - treasure[1]);
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
}
