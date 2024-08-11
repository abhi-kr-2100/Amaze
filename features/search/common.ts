import AStarSearch from "./AStarSearch";
import BFSSearch from "./BFSSearch";
import DFSSearch from "./DFSSearch";
import ManhattanGreedyBestFirstSearch from "./GreedyBestFirstSearch";

export const SearchNameToSearch = {
  ["DFS" as SearchName]: DFSSearch,
  ["BFS" as SearchName]: BFSSearch,
  ["ManhattanGreedyBestFirstSearch" as SearchName]:
    ManhattanGreedyBestFirstSearch,
  ["AStar" as SearchName]: AStarSearch,
};

export const SearchNameToFriendlyName: { [key in SearchName]: string } = {
  DFS: "Depth First Search",
  BFS: "Breadth First Search",
  ManhattanGreedyBestFirstSearch:
    "Greedy Best First Search (Manhattan Distance)",
  AStar: "A* Search",
};

export const SEARCH_NAMES: SearchName[] = [
  "DFS",
  "BFS",
  "ManhattanGreedyBestFirstSearch",
  "AStar",
];

export type SearchName =
  | "DFS"
  | "BFS"
  | "ManhattanGreedyBestFirstSearch"
  | "AStar";
