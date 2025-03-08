const TILE_SIZE = 80;
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const MOVE_DURATION = 200;
const MOVE_INTERVAL = 200;
const CELL1_COLOR = '#cccccc';
const CELL2_COLOR = '#999999';
const PLAYER_COLOR = '#0099b0';
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
function emod(a, b) {
    return (a % b + b) % b;
}
function drawBackground(ctx) {
    const cols = Math.ceil(GAME_WIDTH / TILE_SIZE);
    const rows = Math.ceil(GAME_HEIGHT / TILE_SIZE);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? CELL1_COLOR : CELL2_COLOR;
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}
function drawPlayer(ctx, position) {
    ctx.fillStyle = PLAYER_COLOR;
    const wrappedX = emod(position.x, GAME_WIDTH);
    const wrappedY = emod(position.y, GAME_HEIGHT);
    ctx.fillRect(wrappedX, wrappedY, TILE_SIZE, TILE_SIZE);
    if (wrappedX < TILE_SIZE) {
        ctx.fillRect(wrappedX + GAME_WIDTH, wrappedY, TILE_SIZE, TILE_SIZE);
    }
    else if (wrappedX > GAME_WIDTH - TILE_SIZE) {
        ctx.fillRect(wrappedX - GAME_WIDTH, wrappedY, TILE_SIZE, TILE_SIZE);
    }
    if (wrappedY < TILE_SIZE) {
        ctx.fillRect(wrappedX, wrappedY + GAME_HEIGHT, TILE_SIZE, TILE_SIZE);
    }
    else if (wrappedY > GAME_HEIGHT - TILE_SIZE) {
        ctx.fillRect(wrappedX, wrappedY - GAME_HEIGHT, TILE_SIZE, TILE_SIZE);
    }
}
function updatePosition(state, timestamp) {
    const directionVector = DIRECTION_VECTORS[state.direction];
    if (timestamp - state.lastMoveTime >= MOVE_INTERVAL && !state.targetPosition) {
        state.targetPosition = {
            x: state.position.x + directionVector.x * TILE_SIZE,
            y: state.position.y + directionVector.y * TILE_SIZE,
        };
        state.startPosition = { ...state.position };
        state.moveStartTime = timestamp;
        state.lastMoveTime = timestamp;
    }
    if (state.targetPosition && state.startPosition) {
        const elapsed = timestamp - state.moveStartTime;
        const progress = Math.min(elapsed / MOVE_DURATION, 1);
        state.position.x = state.startPosition.x + (state.targetPosition.x - state.startPosition.x) * progress;
        state.position.y = state.startPosition.y + (state.targetPosition.y - state.startPosition.y) * progress;
        if (elapsed >= MOVE_DURATION) {
            state.position = { ...state.targetPosition };
            state.targetPosition = null;
            state.startPosition = null;
        }
    }
}
(() => {
    const gameCanvas = document.getElementById("game");
    if (!gameCanvas)
        throw new Error("No canvas with id `game` is found");
    const ctx = gameCanvas.getContext("2d");
    if (!ctx)
        throw new Error("2D context is not supported");
    const playerState = {
        position: { x: 0, y: 0 },
        direction: Direction.Right,
        lastMoveTime: 0,
        moveStartTime: 0,
        targetPosition: null,
        startPosition: null,
    };
    let prevTimestamp = 0;
    let fps = 0;
    window.addEventListener("keypress", (e) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if (playerState.direction !== Direction.Down)
                    playerState.direction = Direction.Up;
                break;
            case "ArrowDown":
            case "KeyS":
                if (playerState.direction !== Direction.Up)
                    playerState.direction = Direction.Down;
                break;
            case "ArrowLeft":
            case "KeyA":
                if (playerState.direction !== Direction.Right)
                    playerState.direction = Direction.Left;
                break;
            case "ArrowRight":
            case "KeyD":
                if (playerState.direction !== Direction.Left)
                    playerState.direction = Direction.Right;
                break;
        }
    });
    const gameLoop = (timestamp) => {
        const deltaTime = Math.min((timestamp - prevTimestamp) / 1000, 0.1);
        prevTimestamp = timestamp;
        fps = Math.round(1 / deltaTime);
        updatePosition(playerState, timestamp);
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBackground(ctx);
        drawPlayer(ctx, playerState.position);
        window.requestAnimationFrame(gameLoop);
    };
    window.requestAnimationFrame(timestamp => {
        prevTimestamp = timestamp;
        window.requestAnimationFrame(gameLoop);
    });
})();
export {};
//# sourceMappingURL=index.mjs.map