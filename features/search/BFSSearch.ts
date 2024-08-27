import { RectangleName } from "@/components/rectangles/common";
import { Coord2D } from "../maze/common";
import GeneralizableAStarBasedSearch from "./GeneralizableAStarBasedSearch";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { CostFn, HeuristicFn } from "./common";

export default class BFSSearch implements ISearch {
  #bfs: GeneralizableAStarBasedSearch;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    this.#bfs = new GeneralizableAStarBasedSearch(
      maze,
      agents,
      treasures,
      this.nextCoordIdxFn,
      this.heuristicsFn,
      this.costFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#bfs[Symbol.iterator]();
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

    return 0;
  }

  heuristicsFn(a: Coord2D, treasure: Coord2D) {
    return 0;
  }

  costFn(toVisit: Coord2D, coordToParent: Map<string, Coord2D | undefined>) {
    return 0;
  }
}
