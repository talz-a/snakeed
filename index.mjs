const TILE_SIZE = 80;
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const MOVEMENT_SPEED = 40;
const MOVE_INTERVAL = 200;
const CELL1_COLOR = '#cccccc';
const CELL2_COLOR = '#999999';
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
    Direction[Direction["Count"] = 4] = "Count";
})(Direction || (Direction = {}));
const DIRECTION_VECTORS = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];
function drawBackground(ctx) {
    const cols = Math.ceil(GAME_WIDTH / TILE_SIZE);
    const rows = Math.ceil(GAME_HEIGHT / TILE_SIZE);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const color = (row + col) % 2 === 0 ? CELL1_COLOR : CELL2_COLOR;
            ctx.fillStyle = color;
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }
}
let lastMoveTime = 0;
function updatePosition(ctx, position, direction, timestamp) {
    const direction_vector = DIRECTION_VECTORS[direction];
    // Only move if enough time has passed
    if (timestamp - lastMoveTime >= MOVE_INTERVAL) {
        // Move one full tile instead of MOVEMENT_SPEED
        position.x += direction_vector.x * TILE_SIZE;
        position.y += direction_vector.y * TILE_SIZE;
        // Update the last move time
        lastMoveTime = timestamp;
    }
    // Snap to the nearest tile (still useful for edge cases)
    const snappedX = Math.round(position.x / TILE_SIZE) * TILE_SIZE;
    const snappedY = Math.round(position.y / TILE_SIZE) * TILE_SIZE;
    position.x = snappedX;
    position.y = snappedY;
    // Draw the object
    ctx.fillStyle = '#0099b0';
    ctx.fillRect(position.x, position.y, TILE_SIZE, TILE_SIZE);
}
(() => {
    const gameCanvas = document.getElementById("game");
    if (!gameCanvas)
        throw new Error("No canvas with id `game` is found");
    const ctx = gameCanvas.getContext("2d");
    if (!ctx)
        throw new Error("2D context is not supported for you...");
    let position = { x: 0, y: 0 };
    let direction = Direction.Right;
    window.addEventListener("keypress", (e) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if (direction !== Direction.Down)
                    direction = Direction.Up;
                break;
            case "ArrowDown":
            case "KeyS":
                if (direction !== Direction.Up)
                    direction = Direction.Down;
                break;
            case "ArrowLeft":
            case "KeyA":
                if (direction !== Direction.Right)
                    direction = Direction.Left;
                break;
            case "ArrowRight":
            case "KeyD":
                if (direction !== Direction.Left)
                    direction = Direction.Right;
                break;
        }
    });
    let prevTimestamp = 0;
    let fps = 0;
    const frame = (timestamp) => {
        const deltaTime = Math.min((timestamp - prevTimestamp) / 1000, 0.1);
        prevTimestamp = timestamp;
        fps = Math.round(1 / deltaTime);
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBackground(ctx);
        // ctx.fillStyle = 'white';
        // ctx.fillRect(0, 0, 200, 100);
        // ctx.font = '25px Arial';
        // ctx.fillStyle = 'black';
        // ctx.fillText("FPS: " + fps, 10, 30);
        updatePosition(ctx, position, direction, timestamp);
        window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(timestamp => {
        prevTimestamp = timestamp;
        window.requestAnimationFrame(frame);
    });
})();
export {};
//# sourceMappingURL=index.mjs.map