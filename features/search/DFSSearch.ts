import { RectangleName } from "@/components/rectangles/common";
import { Coord2D } from "../maze/common";
import GeneralizableAStarBasedSearch from "./GeneralizableAStarBasedSearch";
import ISearch, { SingleMazeDiff } from "./ISearch";
import { CostFn, HeuristicFn } from "./common";

export default class DFSSearch implements ISearch {
  #dfs: GeneralizableAStarBasedSearch;

  constructor(
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ) {
    if (agents.length !== 1 || treasures.length !== 1) {
      throw new Error(
        "DFS: only single agent, single treasure search is supported."
      );
    }

    this.#dfs = new GeneralizableAStarBasedSearch(
      maze,
      agents,
      treasures,
      this.nextCoordIdxFn,
      this.heuristicsFn,
      this.costFn
    );
  }

  [Symbol.iterator](): Iterator<SingleMazeDiff[], any, undefined> {
    return this.#dfs[Symbol.iterator]();
  }

  nextCoordIdxFn(
    visitable: Coord2D[],
    goal: Coord2D,
    coordToParent: Map<string, Coord2D | undefined>,
    heuristicFn: HeuristicFn,
    costFn: CostFn
  ) {
    return visitable.length - 1;
  }

  heuristicsFn(a: Coord2D, treasure: Coord2D) {
    return 0;
  }

  costFn(toVisit: Coord2D, coordToParent: Map<string, Coord2D | undefined>) {
    return 0;
  }
}
