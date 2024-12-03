(function () {
    const canvas = document.getElementById("maze");
    const ctx = canvas.getContext("2d");

    // Maze parameters
    const size = 20; // Cell size
    const cols = Math.floor(500 / size); // Number of columns (adjusted for 500px width)
    const rows = Math.floor(400 / size); // Number of rows (adjusted for 400px height)
    const borderWidth = 2;

    canvas.width = 500;
    canvas.height = 400;

    const cells = [];
    let stack = [];
    let current;

    // Initialize cells
    function initCells() {
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < cols; x++) {
                row.push({ x, y, visited: false, walls: { top: true, right: true, bottom: true, left: true } });
            }
            cells.push(row);
        }
        current = cells[0][0];
    }

    // Draw a single cell
    function drawCell(cell) {
        const x = cell.x * size;
        const y = cell.y * size;

        ctx.fillStyle = cell.visited ? "#ddd" : "#fff";
        ctx.fillRect(x, y, size, size);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = borderWidth;

        if (cell.walls.top) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
            ctx.stroke();
        }
        if (cell.walls.right) {
            ctx.beginPath();
            ctx.moveTo(x + size, y);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
        if (cell.walls.bottom) {
            ctx.beginPath();
            ctx.moveTo(x, y + size);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
        if (cell.walls.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + size);
            ctx.stroke();
        }
    }

    // Draw the maze
    function drawMaze() {
        cells.flat().forEach(drawCell);

        // Highlight the current cell
        if (current) {
            ctx.fillStyle = "red";
            ctx.fillRect(current.x * size, current.y * size, size, size);
        }
    }

    // Get unvisited neighbors
    function getNeighbors(cell) {
        const { x, y } = cell;
        const neighbors = [];

        if (y > 0 && !cells[y - 1][x].visited) neighbors.push(cells[y - 1][x]);
        if (x < cols - 1 && !cells[y][x + 1].visited) neighbors.push(cells[y][x + 1]);
        if (y < rows - 1 && !cells[y + 1][x].visited) neighbors.push(cells[y + 1][x]);
        if (x > 0 && !cells[y][x - 1].visited) neighbors.push(cells[y][x - 1]);

        return neighbors;
    }

    // Remove walls between two cells
    function removeWalls(a, b) {
        if (a.x === b.x) {
            if (a.y > b.y) {
                a.walls.top = false;
                b.walls.bottom = false;
            } else {
                a.walls.bottom = false;
                b.walls.top = false;
            }
        } else if (a.y === b.y) {
            if (a.x > b.x) {
                a.walls.left = false;
                b.walls.right = false;
            } else {
                a.walls.right = false;
                b.walls.left = false;
            }
        }
    }

    // Maze generation step
    function generateMaze() {
        current.visited = true;

        const neighbors = getNeighbors(current);
        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        }

        drawMaze();

        // Slow down the maze generation by adding a delay
        if (stack.length > 0) {
            setTimeout(generateMaze, 50); // Delay between steps (100 ms)
        }
    }

    // Start the maze generator
    function start() {
        initCells();
        drawMaze();
        generateMaze();
    }

    start();
})();
