import BFSSearch from "./BFSSearch";
import DFSSearch from "./DFSSearch";
import ManhattanGreedyBestFirstSearch from "./GreedyBestFirstSearch";

export const SearchNameToSearch = {
  ["DFS" as SearchName]: DFSSearch,
  ["BFS" as SearchName]: BFSSearch,
  ["ManhattanGreedyBestFirstSearch" as SearchName]:
    ManhattanGreedyBestFirstSearch,
};

export const SearchNameToFriendlyName: { [key in SearchName]: string } = {
  DFS: "Depth First Search",
  BFS: "Breadth First Search",
  ManhattanGreedyBestFirstSearch:
    "Greedy Best First Search (Manhattan Distance)",
};

export const SEARCH_NAMES: SearchName[] = [
  "DFS",
  "BFS",
  "ManhattanGreedyBestFirstSearch",
];

export type SearchName = "DFS" | "BFS" | "ManhattanGreedyBestFirstSearch";
