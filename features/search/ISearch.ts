import { RectangleName } from "@/components/rectangles/common";
import { Coord2D } from "../maze/common";

export type SingleMazeDiff = {
  coord: Coord2D;
  newRect: RectangleName;
};

export interface SearchConstructor {
  new (
    maze: RectangleName[][],
    agents: Coord2D[],
    treasures: Coord2D[]
  ): ISearch;
}

/**
 * Agents search a maze for one or more treasures. The byproduct of a
 * search is a sequence of states.
 *
 * A state is a maze with rectangles that indicate how the search
 * progressed. For example, all visited rectangles may be replced
 * with a special `VisitedRectangle`.
 */
export default interface ISearch extends Iterable<SingleMazeDiff[]> {}
