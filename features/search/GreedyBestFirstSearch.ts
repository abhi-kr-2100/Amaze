import { RectangleName } from "@/components/rectangles/common";
import { Coord2D } from "../maze/common";
import GeneralizableAStarBasedSearch from "./GeneralizableAStarBasedSearch";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { CostFn, HeuristicFn } from "./common";

export default class GreedyBestFirstSearch implements ISearch {
  #greedyBestFirstSearch: GeneralizableAStarBasedSearch;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    this.#greedyBestFirstSearch = new GeneralizableAStarBasedSearch(
      maze,
      agents,
      treasures,
      this.nextCoordIdxFn,
      this.manhattanDistanceHeuristicsFn,
      this.costFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#greedyBestFirstSearch[Symbol.iterator]();
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

    let min = heuristicFn(visitable[0], goal);
    let minIdx = 0;
    for (let i = 1; i < visitable.length; ++i) {
      const v = heuristicFn(visitable[i], goal);
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
    return 0;
  }
}
