# Amaze: The Amazing Maze Visualizer

Amaze is a powerful, multiplatform maze search visualizer built with React Native. It provides an interactive and educational tool for exploring various pathfinding algorithms in maze-like environments.

![Screenshot of Amaze](https://raw.githubusercontent.com/abhi-kr-2100/Amaze/master/assets/images/Screenshot.png?token=GHSAT0AAAAAACWRP6DXQLHTZ4VE3ZUAGDZGZWPID6A)

## Features

- **Multiple Search Algorithms**: Supports Depth-First Search (DFS), Breadth-First Search (BFS), Greedy Best-First Search, and A* Search.
- **Multiplatform**: Built with React Native, ensuring compatibility across different platforms.
- **Extensible**: Easily extendable architecture to implement additional search algorithms.
- **Interactive**: Users can create custom mazes or use generated ones to test different algorithms.

## Installation

```bash
# Clone the repository
git clone https://github.com/abhi-kr-2100/Amaze

# Navigate to the project directory
cd Amaze

# Install dependencies
npm install

# Run the app
npm start

# Once the app is built, press w to open it in a web browser
```

## Supported Algorithms

### Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking. It's memory-efficient but doesn't guarantee the shortest path.

### Breadth-First Search (BFS)

BFS explores all the neighboring nodes at the present depth before moving to the nodes at the next depth level. It guarantees the shortest path in unweighted graphs.

### Greedy Best-First Search

This algorithm uses a heuristic to estimate the cost from the current node to the goal, always choosing the node that appears to be closest to the goal.

### A* Search

A* combines the strengths of Dijkstra's algorithm and Greedy Best-First Search. It uses both the cost to reach the node and a heuristic estimate of the cost to the goal.

## Extending Amaze

To add a new search algorithm:

1. Create a new file in the `features/search` directory.
2. Implement the algorithm by implementing the `ISearch` interface.
3. Add the new algorithm to the options in the UI.
