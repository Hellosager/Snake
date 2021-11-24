const qudratWidth = 10;
const LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down";

var gameLoopId;
var canvasElement;
var canvasContext;
var scoreElement;
var gamePaused;
var score;
var xMax, yMax;
var foodLevelUp = 1;
var tickspeed = 100;
var tickspeedMin = 10;
var discoSnakeEnabled;
var colours = ["blue", "yellow", "green", "red", "orange"];


var snake = [{x:10, y:10, direction: RIGHT}, {x:20, y:10, direction: RIGHT}, {x:30, y:10, direction: RIGHT}, {x:40, y:10, direction: RIGHT}, {x:50, y:10, direction: RIGHT}, {x:60, y:10, direction: RIGHT}, {x:70, y:10, direction: RIGHT}];
var food = {x:0, y:0};


window.onload = init;

function init() {
    canvasElement = document.getElementById("gamecanvas");
    canvasContext = canvasElement.getContext("2d");
    canvasContext.fillStyle = "yellow";
    scoreElement = document.getElementById("score");
    score = 0;
    gamePaused = false;
    discoSnakeEnabled = false;
    xMax = canvasElement.width / qudratWidth;
    yMax = canvasElement.height / qudratWidth;

    food.x = getRandomCoordinate(xMax) * qudratWidth;
    food.y = getRandomCoordinate(yMax) * qudratWidth;


    document.addEventListener("keypress", handleKeyPressed);

    startGame();
}

function startGame() {
    console.log("starting Game");
    gameLoopId = setInterval(gametick, tickspeed);
}

function gametick() {
    // render / draw
    if(!gamePaused) {
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        var snakeHead = snake[snake.length-1];
        handleFoodCollision(snakeHead);
        handleWallCollision(snakeHead);
        handleSnakeCollision(snakeHead);
        drawSnake();
        drawFood();
    }
}

function drawSnake() {
    for(var snakeElement = 0; snakeElement < snake.length; snakeElement++) {
        var snakeElementDirection = snake[snakeElement].direction;

        if(snakeElementDirection == LEFT) {
            snake[snakeElement].x -= qudratWidth;
        } else if(snakeElementDirection == UP) {
            snake[snakeElement].y -= qudratWidth;
        } else if(snakeElementDirection == RIGHT){
            snake[snakeElement].x += qudratWidth;
        } else if(snakeElementDirection == DOWN) {
            snake[snakeElement].y += qudratWidth;
        }

        if(snakeElement < snake.length-1) {
            snake[snakeElement].direction = snake[snakeElement+1].direction;
        }
        
        if(discoSnakeEnabled) {
            canvasContext.fillStyle = colours[getRandomCoordinate(colours.length-1)];
        }
        canvasContext.fillRect(snake[snakeElement].x, snake[snakeElement].y, qudratWidth, qudratWidth);
    }
}

function drawFood() {
    canvasContext.fillRect(food.x, food.y, qudratWidth, qudratWidth);
}

function handleFoodCollision(snakeHead) {

    var fieldAhead = {x: 0, y:0};
    var snakeElementDirection = snakeHead.direction;
    
    if(snakeElementDirection == LEFT) {
        fieldAhead.x = snakeHead.x - qudratWidth;
        fieldAhead.y = snakeHead.y;
    } else if(snakeElementDirection == UP) {
        fieldAhead.x = snakeHead.x;
        fieldAhead.y = snakeHead.y - qudratWidth;
    } else if(snakeElementDirection == RIGHT){
        fieldAhead.x = snakeHead.x + qudratWidth;
        fieldAhead.y = snakeHead.y;
    } else if(snakeElementDirection == DOWN) {
        fieldAhead.x = snakeHead.x;
        fieldAhead.y = snakeHead.y + qudratWidth;
    }

    if(fieldAhead.x == food.x && fieldAhead.y == food.y) {
        snake.push({x:fieldAhead.x, y:fieldAhead.y, direction: snakeHead.direction});
        score++;
        scoreElement.innerHTML = score;        

        food.x = getRandomCoordinate(xMax) * qudratWidth;
        food.y = getRandomCoordinate(yMax) * qudratWidth;
        console.log("x: " + food.x + " y: " + food.y)

        if(score % foodLevelUp == 0 && tickspeed > tickspeedMin) { // = Vielfaches von foodLevelup
            tickspeed -= 10;
        }
    }
}

function handleWallCollision(snakeHead) {
    if(!(snakeHead.x < canvasElement.width && snakeHead.x >= 0)
    || !(snakeHead.y < canvasElement.height && snakeHead.y >= 0)) { // snake left canvas left or right
        gameOver();
    }
}

function handleSnakeCollision(snakeHead) {
    for(var snakeElement = 0; snakeElement < snake.length-2; snakeElement++) {
        console.log("check for collision with snake");
        if(snakeHead.x == snake[snakeElement].x && snakeHead.y == snake[snakeElement].y) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameLoopId);
    setTimeout(restartGame, 3000);
}

function restartGame() {
    snake = [{x:10, y:10, direction: RIGHT}, {x:20, y:10, direction: RIGHT}, {x:30, y:10, direction: RIGHT}, {x:40, y:10, direction: RIGHT}, {x:50, y:10, direction: RIGHT}, {x:60, y:10, direction: RIGHT}, {x:70, y:10, direction: RIGHT}];
    food.x = getRandomCoordinate(xMax) * qudratWidth;
    food.y = getRandomCoordinate(yMax) * qudratWidth;
    score = 0;
    tickspeed == 100;
    discoSnakeEnabled = false;
    canvasContext.fillStyle = "yellow";
    scoreElement.innerHTML = score;
    startGame();
}

function getRandomCoordinate(max) {
    return Math.floor(Math.random() * max);
}

function handleKeyPressed(e) {

    var snakeHead = snake[snake.length-1];

    if(e.keyCode == 97 && snakeHead.direction != RIGHT && snakeHead.direction != LEFT && !gamePaused) {
        // LEFT
        snake[snake.length-1].direction = LEFT;
    } else if(e.keyCode == 119 && snakeHead.direction != DOWN && snakeHead.direction != UP && !gamePaused) {
        // UP
        snake[snake.length-1].direction = UP;
    } else if(e.keyCode == 100 && snakeHead.direction != RIGHT && snakeHead.direction != LEFT && !gamePaused) {
        // RIGHT
        snake[snake.length-1].direction = RIGHT;
    } else if(e.keyCode == 115 && snakeHead.direction != DOWN && snakeHead.direction != UP && !gamePaused){
        // DOWN
        snake[snake.length-1].direction = DOWN;
    } else if(e.keyCode == 112 || e.keyCode == 32) { // P for pause + space
        gamePaused = !gamePaused;
    } else if(e.keyCode == 120) { // x was pressed
        discoSnakeEnabled = !discoSnakeEnabled;
        if(!discoSnakeEnabled) {
            canvasContext.fillStyle = "yellow";
        }
    }
}