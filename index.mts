type Vector2 = { x: number; y: number; }

enum Direction {
    Left = 0,
    Right,
    Up,
    Down,
    Count,
}

const DIRECTION_VECTORS: Vector2[] = [
    { x: -1,  y:  0  },
    { x:  1,  y:  0  },
    { x:  0,  y: -1  },
    { x:  0,  y:  1  },
];

(() => {
    const gameCanvas = document.getElementById("game") as HTMLCanvasElement | null;
    if (!gameCanvas) throw new Error("No canvas with id `game` is found");

    const ctx = gameCanvas.getContext("2d");
    if (!ctx) throw new Error("2D context is not supported for you...");

    const tileSize = 80;
    const GAME_WIDTH = 1280;
    const GAME_HEIGHT = 720;


    ctx.strokeStyle = "red";
    for (let x = 0; x < GAME_WIDTH; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y < GAME_HEIGHT; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0 , y);
        ctx.lineTo(GAME_WIDTH, y);
        ctx.stroke();
    }

    let position: Vector2 = { x: 0, y : 0 };
    let direction: Direction = Direction.Right;

    window.addEventListener("keypress", (e) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if (direction !== Direction.Down) direction = Direction.Up;
                break;
            case "ArrowDown":
            case "KeyS":
                if (direction !== Direction.Up) direction = Direction.Down;
                break;
            case "ArrowLeft":
            case "KeyA":
                if (direction !== Direction.Right) direction = Direction.Left;
                break;
            case "ArrowRight":
            case "KeyD":
                if (direction !== Direction.Left) direction = Direction.Right;
                break;
        }
    })


    let prevTimestamp = 0;
    let fps = 0;
    const frame = (timestamp: number) => {
        const deltaTime = Math.min((timestamp - prevTimestamp) / 1000, 0.1);
        prevTimestamp = timestamp;
        fps = Math.round(1 / deltaTime);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 200, 100);
        ctx.font = '25px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText("FPS: " + fps, 10, 30);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(timestamp => {
        prevTimestamp = timestamp;
        window.requestAnimationFrame(frame);
    })

})()
