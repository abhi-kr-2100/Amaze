import { RectangleName } from "@/components/rectangles/common";

export type SingleMazeDiff = {
  coord: [number, number];
  newRect: RectangleName;
};

export interface SearchConstructor {
  new (
    maze: RectangleName[][],
    agents: [number, number][],
    treasures: [number, number][]
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
