import BFSSearch from "./BFSSearch";
import DFSSearch from "./DFSSearch";

export const SearchNameToSearch = {
  ["DFS" as SearchName]: DFSSearch,
  ["BFS" as SearchName]: BFSSearch,
};

export const SearchNameToFriendlyName: { [key in SearchName]: string } = {
  DFS: "Depth First Search",
  BFS: "Breadth First Search",
};

export const SEARCH_NAMES = ["DFS", "BFS"];

export type SearchName = "DFS" | "BFS";
