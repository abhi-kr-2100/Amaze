import { Coord2D } from "../maze/common";
import AStarSearch from "./AStarSearch";
import BFSSearch from "./BFSSearch";
import DFSSearch from "./DFSSearch";
import GreedyBestFirstSearch from "./GreedyBestFirstSearch";

export const SearchNameToSearch = {
  ["DFS" as SearchName]: DFSSearch,
  ["BFS" as SearchName]: BFSSearch,
  ["GreedyBestFirstSearch" as SearchName]: GreedyBestFirstSearch,
  ["AStar" as SearchName]: AStarSearch,
};

export const SearchNameToFriendlyName: { [key in SearchName]: string } = {
  DFS: "Depth First Search",
  BFS: "Breadth First Search",
  GreedyBestFirstSearch: "Greedy Best First Search",
  AStar: "A* Search",
};

export const SEARCH_NAMES: SearchName[] = [
  "DFS",
  "BFS",
  "GreedyBestFirstSearch",
  "AStar",
];

export type SearchName = "DFS" | "BFS" | "GreedyBestFirstSearch" | "AStar";

export type HeuristicFn = (coord: Coord2D, goal: Coord2D) => number;
export type CostFn = (
  toVisit: Coord2D,
  coordToParent: Map<string, Coord2D | undefined>
) => number;
export type NextCoordIdxFn = (
  visitable: Coord2D[],
  goal: Coord2D,
  coordToParent: Map<string, Coord2D | undefined>,
  h: HeuristicFn,
  g: CostFn
) => number;
