let canvas = document.getElementById('mycanvas')
let ctx = canvas.getContext('2d')
let x = canvas.width/2;
let y = canvas.height-30;
let ballRadius = 10;
let dx = 2;
let dy = -2;
let lotto = '0123456789ABCDEF' //定義隨機顏色
let color = '#00cc99'
let paddleWidth = 75;
let paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth)/2;
let pressedLeft = false;
let pressedRight = false;
let speed = 10;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWitch = 75;
let brickHeight = 20;
let birckPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;


let bricks = [];
for(let c = 0; c<brickColumnCount; c++){
	bricks[c] = [];
	for(let r = 0; r<brickRowCount; r++){
		bricks[c][r] = {x: 0, y: 0, status: 1};
	}
}

//事件監聽
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler (e) {
	if(e.keyCode === 39){
		pressedRight = true;
	}else if(e.keyCode === 37){
		pressedLeft = true;
	}
}

function keyUpHandler (e) {
	if(e.keyCode === 39){
		pressedRight = false;
	}else if(e.keyCode === 37){
		pressedLeft = false;
	}
}

function mouseMoveHandler(e){	
	let relativeX = e.clientX  - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
	for(let c=0; c<brickColumnCount; c++){
		for(let r=0; r<brickRowCount; r++){
			let b = bricks[c][r];
			if(b.status === 1){
				if(x>b.x && x< b.x+brickWitch && y+ballRadius>b.y && y<b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					if(score === brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
				}
			}
		}
	}
}

function drawBall () {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2, false)
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle () {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#000';
	ctx.fill();
	ctx.closePath();
}

function drawBricks (){
	for(let c=0; c<brickColumnCount; c++){
		for(let r =0; r<brickRowCount; r++){
			if(bricks[c][r].status === 1){
				let brickX = (c*(brickWitch+birckPadding))+brickOffsetLeft;
				let brickY = (r*(brickHeight+birckPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWitch, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore () {
	ctx.font = '16px Arial';
	ctx.fillSytle = '#0095dd';
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = "0095dd";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw () {
	ctx.clearRect(0, 0,canvas.width, canvas.height);	
	drawBall();
	drawPaddle();
	drawBricks();
	collisionDetection();
	drawScore();
	drawLives();
	//球的移動
	if(x+dx>canvas.width-ballRadius || x+dx<ballRadius){		
		dx=-dx;
	} 
	if(y+dy<ballRadius){
		dy=-dy;
	}else if(y+dy>canvas.height-ballRadius-paddleHeight-1){
		if( x > paddleX && x < paddleX+paddleWidth+1){
			changeColor();
			dy=-dy;
			if(y< canvas.height+ballRadius) y-=5//為了解決奇怪的bug		
		}else{
			if(y+dy>canvas.height-ballRadius){
				clearInterval(draw);
				lives--;
				if(!lives){
					alert("Gamer Over");
					document.location.reload();
				}else {
					x = canvas.width/2;
					y = canvas.height-30;
					dx = 2;
					dy = -2;
					paddleX = (canvas.width-paddleWidth)/2;
				}
				return;
			}
		}
	}
	x+=dx;
	y+=dy;

	//球拍移動
	if(pressedLeft && paddleX > 0){
		paddleX -= 7
	}else if(pressedRight && paddleX < canvas.width-paddleWidth){
		paddleX += 7
	}
}

function changeColor() {
	color = '#';
	for(let i = 0; i<6; i++){
		color+= lotto[Math.floor(Math.random()*16)]
	}	
	return color;
}


setInterval(draw, speed);
