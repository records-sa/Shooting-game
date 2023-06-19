// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// 이미지 불러오기
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;


function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src = "images/background.png";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

// 방향키를 누르면 일어나는 이벤트 함수
let keysDown = {};
function setupKeyboardListener(){
  document.addEventListener("keydown", function(event){
    keysDown[event.key] = true;
  })
  document.addEventListener("keyup", function(){
    delete keysDown[event.key];
  })
}

// 이미지를 보여주는 함수 만들기
function render(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)
}

// 배경화면 이미지를 계속 호출해서 화면에 보이도록 하는 함수 만들고 호출하기
function main(){
  render();
  requestAnimationFrame(main);
}

loadImage();
setupKeyboardListener();
main();

// 방향키를 누르면

// 우주선의 x, y 좌표가 바뀌고

// 다시 render 그려줌

