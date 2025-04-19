class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null;
        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
        this.isVisited = false;
        this.isPath = false;
    }
}

class Pathfinder {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.cellSize = 30;
        this.grid = [];
        this.startNode = null;
        this.endNode = null;
        this.isDrawing = false;
        this.currentTool = 'wall';
        this.isPathfinding = false;
        this.speed = 5; // Default speed (1-10)
        
        this.initializeGrid();
        this.setupEventListeners();
        this.draw();
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.gridSize; row++) {
            const currentRow = [];
            for (let col = 0; col < this.gridSize; col++) {
                currentRow.push(new Node(row, col));
            }
            this.grid.push(currentRow);
        }
        
        // Set start and end nodes
        this.startNode = this.grid[5][5];
        this.endNode = this.grid[this.gridSize - 5][this.gridSize - 5];
        this.startNode.isStart = true;
        this.endNode.isEnd = true;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());

        document.getElementById('startBtn').addEventListener('click', () => this.startPathfinding());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGrid());
        document.getElementById('gridSize').addEventListener('change', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.initializeGrid();
            this.draw();
        });

        // Tool selection
        document.getElementById('wallTool').addEventListener('click', () => this.setTool('wall'));
        document.getElementById('startTool').addEventListener('click', () => this.setTool('start'));
        document.getElementById('endTool').addEventListener('click', () => this.setTool('end'));
        document.getElementById('eraserTool').addEventListener('click', () => this.setTool('eraser'));
        
        // Speed control
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        speedSlider.addEventListener('input', () => {
            this.speed = parseInt(speedSlider.value);
            speedValue.textContent = this.speed;
        });
    }

    setTool(tool) {
        this.currentTool = tool;
        
        // Update active button
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`${tool}Tool`).classList.add('active');
    }

    handleMouseDown(e) {
        if (this.isPathfinding) return;
        
        this.isDrawing = true;
        this.handleMouseMove(e);
    }

    handleMouseMove(e) {
        if (!this.isDrawing || this.isPathfinding) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            const node = this.grid[row][col];
            
            switch (this.currentTool) {
                case 'wall':
                    if (!node.isStart && !node.isEnd) {
                        node.isWall = true;
                        node.isVisited = false;
                        node.isPath = false;
                    }
                    break;
                case 'start':
                    if (this.startNode) {
                        this.startNode.isStart = false;
                    }
                    node.isStart = true;
                    node.isWall = false;
                    node.isVisited = false;
                    node.isPath = false;
                    this.startNode = node;
                    break;
                case 'end':
                    if (this.endNode) {
                        this.endNode.isEnd = false;
                    }
                    node.isEnd = true;
                    node.isWall = false;
                    node.isVisited = false;
                    node.isPath = false;
                    this.endNode = node;
                    break;
                case 'eraser':
                    if (!node.isStart && !node.isEnd) {
                        node.isWall = false;
                        node.isVisited = false;
                        node.isPath = false;
                    }
                    break;
            }
            
            this.draw();
        }
    }

    handleMouseUp() {
        this.isDrawing = false;
    }

    resetGrid() {
        this.isPathfinding = false;
        this.initializeGrid();
        this.draw();
        this.showMessage('', '');
    }

    draw() {
        this.canvas.width = this.gridSize * this.cellSize;
        this.canvas.height = this.gridSize * this.cellSize;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const node = this.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                // Determine cell color
                let fillColor = '#fff'; // Default white
                
                if (node.isWall) {
                    fillColor = '#333'; // Dark gray for walls
                } else if (node.isStart) {
                    fillColor = '#4CAF50'; // Green for start
                } else if (node.isEnd) {
                    fillColor = '#f44336'; // Red for end
                } else if (node.isPath) {
                    fillColor = '#FFC107'; // Yellow for path
                } else if (node.isVisited) {
                    fillColor = '#2196F3'; // Blue for visited
                }
                
                // Draw cell
                this.ctx.fillStyle = fillColor;
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                
                // Draw border
                this.ctx.strokeStyle = '#ddd';
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                // Draw start/end icons
                if (node.isStart) {
                    this.drawIcon(x, y, 'S', '#fff');
                } else if (node.isEnd) {
                    this.drawIcon(x, y, 'E', '#fff');
                }
            }
        }
    }
    
    drawIcon(x, y, text, color) {
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + this.cellSize / 2, y + this.cellSize / 2);
    }
    
    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = 'message';
        
        if (type === 'error') {
            messageElement.classList.add('error');
        } else if (type === 'success') {
            messageElement.classList.add('success');
        }
    }

    async startPathfinding() {
        if (this.isPathfinding) return;
        
        this.isPathfinding = true;
        this.showMessage('', '');
        
        // Reset visited and path states
        for (let row of this.grid) {
            for (let node of row) {
                node.isVisited = false;
                node.isPath = false;
            }
        }
        
        const algorithm = document.getElementById('algorithm').value;
        let pathFound = false;
        
        if (algorithm === 'astar') {
            pathFound = await this.aStar();
        } else {
            pathFound = await this.dijkstra();
        }
        
        if (!pathFound) {
            this.showMessage('No path found to the destination!', 'error');
        } else {
            this.showMessage('Path found successfully!', 'success');
        }
        
        this.isPathfinding = false;
    }

    async aStar() {
        const openSet = [this.startNode];
        const closedSet = new Set();
        let visitedCount = 0;
        let batchSize = Math.max(1, Math.floor(10 / this.speed)); // Adjust batch size based on speed
        
        while (openSet.length > 0) {
            let current = this.getLowestFScore(openSet);
            
            if (current === this.endNode) {
                this.reconstructPath(current);
                return true;
            }
            
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(current);
            
            const neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (closedSet.has(neighbor)) continue;
                
                const tentativeG = current.g + 1;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                    neighbor.h = this.heuristic(neighbor, this.endNode);
                } else if (tentativeG >= neighbor.g) {
                    continue;
                }
                
                neighbor.parent = current;
                neighbor.g = tentativeG;
                neighbor.f = neighbor.g + neighbor.h;
                
                if (!neighbor.isStart && !neighbor.isEnd) {
                    neighbor.isVisited = true;
                    visitedCount++;
                    
                    // Only update visualization periodically for better performance
                    if (visitedCount % batchSize === 0) {
                        this.draw();
                        await new Promise(resolve => setTimeout(resolve, 100 / this.speed));
                    }
                }
            }
        }
        
        // Final draw to ensure all visited cells are shown
        this.draw();
        return false; // No path found
    }

    async dijkstra() {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        let visitedCount = 0;
        let batchSize = Math.max(1, Math.floor(10 / this.speed)); // Adjust batch size based on speed
        
        for (let row of this.grid) {
            for (let node of row) {
                distances.set(node, Infinity);
                unvisited.add(node);
            }
        }
        distances.set(this.startNode, 0);
        
        while (unvisited.size > 0) {
            let current = this.getMinDistance(unvisited, distances);
            
            if (current === this.endNode) {
                this.reconstructPath(current);
                return true;
            }
            
            unvisited.delete(current);
            
            const neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (!unvisited.has(neighbor)) continue;
                
                const distance = distances.get(current) + 1;
                
                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, current);
                    
                    if (!neighbor.isStart && !neighbor.isEnd) {
                        neighbor.isVisited = true;
                        visitedCount++;
                        
                        // Only update visualization periodically for better performance
                        if (visitedCount % batchSize === 0) {
                            this.draw();
                            await new Promise(resolve => setTimeout(resolve, 100 / this.speed));
                        }
                    }
                }
            }
        }
        
        // Final draw to ensure all visited cells are shown
        this.draw();
        return false; // No path found
    }

    getNeighbors(node) {
        const neighbors = [];
        // Remove diagonal movements, only allow 4-directional movement
        const directions = [
            [-1, 0],  // up
            [0, -1],  // left
            [0, 1],   // right
            [1, 0]    // down
        ];
        
        for (let [dx, dy] of directions) {
            const newRow = node.row + dx;
            const newCol = node.col + dy;
            
            if (newRow >= 0 && newRow < this.gridSize && 
                newCol >= 0 && newCol < this.gridSize) {
                const neighbor = this.grid[newRow][newCol];
                if (!neighbor.isWall) {
                    neighbors.push(neighbor);
                }
            }
        }
        
        return neighbors;
    }

    heuristic(node, end) {
        return Math.abs(node.row - end.row) + Math.abs(node.col - end.col);
    }

    getLowestFScore(openSet) {
        return openSet.reduce((lowest, current) => 
            current.f < lowest.f ? current : lowest
        );
    }

    getMinDistance(unvisited, distances) {
        return Array.from(unvisited).reduce((min, current) => 
            distances.get(current) < distances.get(min) ? current : min
        );
    }

    async reconstructPath(node) {
        let current = node;
        const path = [];
        
        while (current.parent) {
            path.push(current);
            current = current.parent;
        }
        
        // Animate the path with faster updates
        for (let i = path.length - 1; i >= 0; i--) {
            const pathNode = path[i];
            if (!pathNode.isStart && !pathNode.isEnd) {
                pathNode.isPath = true;
                this.draw();
                await new Promise(resolve => setTimeout(resolve, 100 / this.speed));
            }
        }
    }
}

// Initialize the pathfinder when the page loads
window.onload = () => {
    const canvas = document.getElementById('gridCanvas');
    new Pathfinder(canvas);
}; 