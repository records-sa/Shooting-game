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
let gameOver = false;    // true 면 게임이 끝남, false 면 게임이 안 끝남
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

// 처음 총알의 x, y좌표와 총알이 발사하도록 y좌표 값을 업데이트하는 함수
let bulletList = [];    // 총알들을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function() {
    this.x = spaceshipX + 8;
    this.y = spaceshipY;
    this.alive = true;    // true면 살아있는 총알, false면 죽은 총알

    bulletList.push(this);
  }
  this.update = function() {
    this.y -= 7;
  }

  this.checkHit = function () {
    for(let i = 0; i < enemyList.length; i++) {
      if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  }
  
}


// 적군의 위치를 랜덤하게 지정해주는 함수
function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random()*(max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
// 적군을 생성해주는 함수
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function() {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);
    enemyList.push(this);
  }
  this.update = function() {
    this.y += 3;    // 적군의 속도 조절

    if(this.y >= canvas.height - 48) {
      gameOver = true;    // 적군이 바닥에 닿으면 게임 오버
    }
  }
}
 
function loadImage() {
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
function setupKeyboardListener() {
  document.addEventListener("keydown", function(event){
    keysDown[event.key] = true;
  })
  document.addEventListener("keyup", function(){
    delete keysDown[event.key];    // 방향키를 떼면 이벤트 삭제

    if(event.keyCode == 32) {
      createBullet();    // 스페이스바를 누르면 총알 생성
    }
  })
}

// 총알을 생성하는 함수
function createBullet() {
  let b = new Bullet();    // 총알 하나 생성
  b.init();    // 총알 좌표를 초기화 해주는 함수를 호출
}

// 적군을 생성하는 함수
function createEnemy() {
  const interval = setInterval(function() {        // 원하는 시간마다 함수를 호출하게 하는 메서드: setIntgerval(호출하고 싶은 함수, 시간)
    let e = new Enemy();
    e.init();
  }, 1000);   // 단위가 ms 이므로 1s = 1000ms
}

// 방향키를 누르면 우주선의 x, y 좌표가 바뀌는 함수
// 우주선이 오른쪽으로 간다: x 좌표의 값이 증가
// 우주선이 왼쪽으로 간다: x 좌표의 값이 감소
function update() {
  if('ArrowRight' in keysDown) {
    spaceshipX += 5;    // 우주선의 움직임 속도
  }    // right
  if('ArrowLeft' in keysDown) {
    spaceshipX -= 5;
  }    // left

  // 우주선이 게임 밖으로 나가는 것 방지하기
  if(spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if(spaceshipX >= 336) {    // spaceshipX >= canvas.width - 64
    spaceshipX = 336;
  }

  // 총알의 y좌표 업데이트하는 함수 호출
  for(let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  // 적군의 y좌표 업데이트하는 함수 호출
  for(let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

// 이미지를 보여주는 함수 만들기
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for(let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for(let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

// 배경화면 이미지를 계속 호출해서 화면에 보이도록 하는 함수 만들고 호출하기
function main() {
  if(!gameOver) {
    update();    // 좌표값을 업데이트하고
    render();    // 그려줌
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 400, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();


// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사(y 좌표가 줄어들게 함)
// 2. 총알이 발사할 때 x값: 스페이스바를 누른 순간의 우주선의 좌표, y 값: --
// 3. 총알이 여러개가 발사될 수 있으므로 총알을 저장해둘 수 있는 총알 리스트, 배열 만들기
// 4. 총알들은 x, y 좌표 값이 있어야 함
// 5. 총알 배열들 가지고 render


// 적군 만들기
// 1. 적군의 x, y좌표 값, init, update 함수 생성
// 2. 적군의 위치를 랜덤하게, 1초 마다 생성되도록 함
// 3. 적군이 생성되면 아래로 내려오게 함
// 4. 적군이 바닥에 닿으면 게임 오버
// 5. 적군과 총알이 만나면 적군이 사라지고 점수 1점 획득
//    총알의 y 좌표 값이 적군의 y 좌표 값보다 작아야 함
//    총알의 x 좌표 값이 적군의 x 좌표 값 보다 크고, 적군의 넓이보다 좁아야 함