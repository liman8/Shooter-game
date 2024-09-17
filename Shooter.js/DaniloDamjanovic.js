const canvas = document.getElementById('igra');
const context = canvas.getContext('2d');
document.getElementById('igra').style.cursor= "crosshair";
let points = 10;
let bullets = [];
let fireRate = 2,
    fireInterval = null;
let udji = true;
let brzina_igre = 3;
let brzinaIgraca  = 1;
let brzinaProtivnika = 2;
let mouse = {
  x: canvas.width/2,
  y: canvas.height/2
}
 let zdravlje = 5;
let enemies = [];
let score = 0;
let highscore = 0;
let plane = new Image();
plane.src = "plane.png";
let plane45 = new Image();
plane45.src = "plane45.png";
let plane90 = new Image();
plane90.src = "plane90.png";
let plane135 = new Image();
plane135.src = "plane135.png";
let plane225 = new Image();
plane225.src = "plane225.png";
let plane270 = new Image();
plane270.src = "plane270.png";
let plane315 = new Image();
plane315.src = "plane-45.png";
let planeFlipped = new Image();
planeFlipped.src = "planeFlipped.png";
let asteroid = new Image();
asteroid.src = "asteroid.png";
let pozadina = new Image();
pozadina.src = "background.jpg";
let bomba = new Image();
bomba.src = "bomba.png";
let bombR = new Image();
bombR.src = "bombR.png";
let zdravljeSlika = new Image();
zdravljeSlika.src = "healthSlika.png";
let brzina = new Image();
brzina.src = "brzina.png";
let municija = new Image();
municija.src = "municija.png";
let rafal = new Image();
rafal.src = "rafal.png";
let kabum = new Image();
kabum.src = "kabum.png";
let hp = new Image();
hp.src = "hp.png";
let tasteri = [];
let igracX = canvas.width / 2 - 30;
let igracDx = 0;
let igracDy = 0;
let igracY = canvas.height / 2 - 30;
let ziv = true;
let mrtav = false;
let sarzer = 200;
let talas = 1;
let sponovani = 0;
let zaUbiti = 20;
let spawnRate = 1000;
let pomocniSR; 
let drops = [];
var audio = new Audio();
audio.src = "Mica.mp3";
audio.volume = 0.2;
audio.loop = true;
var gotovo = new Audio();
gotovo.src = "kraj.mp3";
gotovo.volume = 1;



document.addEventListener('keydown', function(event){
  tasteri[event.code] = true;
  
});
document.addEventListener('keyup', function(event){
  tasteri[event.code] = false;
});


addEventListener ('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
//  console.log(mouse);
})

//addEventListener('click', shoot);

addEventListener('mousedown', startFire);
addEventListener('mouseup', stopFire);
class Drop{
  constructor(x, y,type){
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.type = type;
  }
  
  draw(){
    if(this.type == 1)
    context.drawImage(municija, this.x , this.y,this.width,this.height);
    if(this.type == 2)
    context.drawImage(hp, this.x , this.y,this.width,this.height);
    if(this.type == 3)
    context.drawImage(kabum, this.x , this.y,this.width,this.height);
    if(this.type == 4)
    context.drawImage(rafal, this.x , this.y,this.width,this.height);
    if(this.type == 5)
    context.drawImage(brzina, this.x , this.y,this.width,this.height);

  /* context.beginPath();
    context.arc(this.x, this.y, this.r, Math.PI * 2, false);
    context.fillStyle = this.col;
    context.fill();
    context.closePath();*/
    
  }

  update(){
    this.draw();
    
  }
}
class Circle{
  constructor(x, y, r, col){
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
  }

  draw(){
    context.drawImage(bomba, this.x - this.r, this.y - this.r,10,10);

  /* context.beginPath();
    context.arc(this.x, this.y, this.r, Math.PI * 2, false);
    context.fillStyle = this.col;
    context.fill();
    context.closePath();*/
    
  }

  update(){
    this.draw();
    
  }
}
function dead()
{
  context.clearRect(0,0,canvas.width, canvas.height);
  context.drawImage(pozadina,0,0,canvas.width, canvas.height);
  context.fillStyle = "yellow";
  context.textBaseline = 'middle'; 
  context.textAlign = 'center';
  context.font = "60px Comic Sans MS";
  context.fillText("GAME OVER",canvas.width/2 , canvas.height/2 - 150 );
 
  context.font = "40px Comic Sans MS";
  context.fillText("Your score: " + points, canvas.width/2 , canvas.height/2 -50);
  context.fillText("Waves succesfully survived: " + (talas-1),canvas.width/2 , canvas.height/2 );
  context.fillText("This is how our old time leaderboard looks like: ",canvas.width/2 , canvas.height/2 + 50 );

  context.fillText("1. " + sessionStorage.getItem("highscore"),canvas.width/2 ,canvas.height/2 +100);
  context.fillText("2. " + sessionStorage.getItem("runnerUp"), canvas.width/2 ,canvas.height/2 +150);
  context.fillText("3. " + sessionStorage.getItem("bronze"), canvas.width/2 ,canvas.height/2 +200);

  
}

function renderScore()
{
  
  context.textAlign = 'left';
	context.fillStyle = "yellow";
	context.font = "48px Comic Sans MS";
	context.fillText(points, 80,80);
  context.fillText(sessionStorage.getItem("highscore"), canvas.width - 250 ,80);
  context.fillText(sarzer, 120,canvas.height - 88);
  context.drawImage(bombR,80,canvas.height - 120,48, 48);
  context.fillText(zdravlje, canvas.width - 100 ,canvas.height - 88);
  context.drawImage(zdravljeSlika,canvas.width - 150,canvas.height - 120,48, 48);

  context.textBaseline = 'middle'; 
  context.textAlign = 'center';
  context.fillText("Wave: "+ talas, canvas.width/2,80);
  

  
}
let speed = 6;
function shoot(){
  if(sarzer != 0)
  {
    sarzer --;

  
  let bullet = new Circle(igracX + 10, igracY + 15, 5, 'white');

  if(igracDx < 0)
  {
    bullet =new Circle(igracX, igracY + 15, 5, 'white');
  }
  let vel_x = mouse.x - bullet.x;
  let vel_y = mouse.y - bullet.y;
  

  let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
  bullet.dx = vel_x / dist;
  bullet.dy = vel_y / dist;

  bullet.dx *= speed;
  bullet.dy *= speed;

  bullets.push(bullet);
}
}

function startFire(){
  shoot();
  fireInterval = setInterval(shoot, 1000/fireRate);
}

function stopFire(){
  clearInterval(fireInterval);
}

class Enemy {
    constructor (x, y, r, col){
      this.x = x;
      this.y = y;
      this.r = r;
      this.col = col;
      this.health = 3;
      this.dx ;
      this.dy ;
    }
  
    Iscrtaj(){
      context.beginPath();
      context.arc(this.x, this.y, this.r, Math.PI * 2, false);
      context.fillStyle = this.col;
      context.fill();
      context.closePath();
      context.drawImage(asteroid,this.x - this.r,this.y - this.r ,this.r*2 ,this.r*2);
    }
  
    Update(){
      this.x -= this.dx;
      this.y -= this.dy;
      this.Iscrtaj();
      let vel_x = this.x - igracX;
    let vel_y = this.y - igracY;
  

  let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
  this.dx = vel_x / dist;
  this.dy = vel_y / dist;

  this.dx *= brzinaProtivnika;
  this.dy *= brzinaProtivnika;
  
    }
  
  }
  function spawnEnemy(){
    if(sponovani % zaUbiti == 0 && sponovani > 0)
    {
      
     
      clearInterval(enemyInterval);
      enemyInterval = setInterval(spawnEnemy, 10000);
    }
    if(sponovani % zaUbiti == 1 && sponovani > 1)
    {
      brzinaProtivnika *= 1.2;
      spawnRate *= 0.98;
      pomocniSR = spawnRate;
      points += 2000;
      sarzer = 200;
      talas++;
      clearInterval(enemyInterval);
      enemyInterval = setInterval(spawnEnemy, spawnRate);
    }
    let pom2 = Math.floor(Math.random()* 3);
    let pom1 = Math.floor(Math.random()* 4);
    let xstart = 0;
    let ystart = 0;
    
    let velicina = 8;
    if(pom2 == 0)
    {
    
     velicina = 16;
    }
    if(pom2 == 1)
    {
     
       velicina = 20;
    }
    if(pom2 == 2)
    {
     
      velicina = 24;
      
    
    }
   
    //alert(pom1);
    if(pom1 == 0)
    {
    
       ystart = randomInt(2,canvas.height/velicina-2);
       xstart = 0;
    }
    if(pom1 == 1)
    {
     
       ystart = randomInt(2,canvas.height/velicina-2);
       xstart = canvas.width/velicina;
    }
    if(pom1 == 2)
    {
     
      ystart = 0;
      xstart = randomInt(2,canvas.width/velicina - 2);
    
    }
    if(pom1 == 3)
    {
     
       ystart = canvas.height/velicina; 
       xstart = randomInt(2,canvas.width/velicina - 2);

    }

    let enemy = new Enemy(xstart*velicina, ystart*velicina, velicina, 'white');
    if(pom2 == 0)
    {
    enemy.health = 1;
    
    }
    if(pom2 == 1)
    {
      enemy.health = 2;
       
    }
    if(pom2 == 2)
    {
     
      enemy.health = 3;
      
    
    }
    let vel_x = enemy.x - igracX ;
    let vel_y = enemy.y - igracY ;
  

  let dist = Math.sqrt(vel_x * vel_x + vel_y * vel_y);
  enemy.dx = vel_x / dist;
  enemy.dy = vel_y / dist;
  
  enemy.dx *= brzinaProtivnika;
  enemy.dy *= brzinaProtivnika;
    enemies.push(enemy);
    sponovani ++;
  }
  enemyInterval = setInterval(spawnEnemy, spawnRate);

  function randomInt(min, max){
    return Math.floor(Math.random()* (max-min) + min);
  }


let brojUnistenih = 0;
let player;
const fps = 60;
function start(){
  //player = new Circle(0, canvas.height/2, 30, '#DF00FE');

  requestAnimationFrame(loop);

    
}

function IscrtajIgraca()
{
  if(igracDx > 0)
  {
    if(igracDy == 0)
     context.drawImage(plane,igracX - 30,igracY-25,60,50);
     else if(igracDy > 0)
    context.drawImage(plane315,igracX - 30,igracY-25,85,72);
    else if(igracDy < 0)
    context.drawImage(plane45,igracX - 30,igracY-25,85,72);
  }
  else if(igracDx == 0)
  {
    if(igracDy < 0)
     context.drawImage(plane90,igracX - 30,igracY-25,75,64);
    else if(igracDy > 0)
    context.drawImage(plane270,igracX - 30,igracY-25,75,64);
    else if(igracDy == 0)
    context.drawImage(plane,igracX - 30,igracY-25,60,50);

  }
  else if(igracDx < 0)
  {
    if(igracDy > 0)
     context.drawImage(plane225,igracX - 30,igracY-25,85,72);
     else if(igracDy < 0)
    context.drawImage(plane135,igracX - 30,igracY-25,85,72);
    else if(igracDy == 0)
    context.drawImage(planeFlipped,igracX - 30,igracY-25,60,50);
  }


 // context.drawImage(planeFlipped,igracX - 30,igracY-25,60,50);
  
    igracX += igracDx*brzinaIgraca;
    igracY += igracDy*brzinaIgraca;
    if(igracY > canvas.height)
    {
      igracY = -50;
    }
    if(igracX > canvas.width)
    {
      igracX = -60;
    }
    if(igracX < -60)
    {
      igracX = canvas.width;
    }
    if(igracY < -50)
    {
      igracY = canvas.height;
    }
}
let originalni_tajmer = 200;
let tajmer = originalni_tajmer;
let ubrzaj = 1;
function loop(){
  if(udji)
  
   requestAnimationFrame(loop);
   audio.play();
   
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(pozadina,0,0,canvas.width, canvas.height);
  renderScore();
 
 points += 1;
 for(let i = 0; i < drops.length ; ++i)
 {
   drops[i].update();
 }
  for(let i = 0; i < bullets.length; i++){
    let bullet = bullets[i];
    if(bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height){
      bullets.splice(i, 1);
    }

   
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    bullet.update();
  
  for(let j = 0; j < enemies.length ; ++j ){
    let enemy = enemies[j];
   
   
      let ex = bullet.x - enemy.x;
      let ey = bullet.y - enemy.y;
      let distance = Math.sqrt(ex * ex + ey * ey);
      let rand = Math.floor(Math.random()* 50 ) + 1;
      let tip;
      if(rand <= 6)
      {
        tip = 1;
      }
      else if(rand <= 9)
      {
        tip = 2;
      }
      else if(rand <= 12)
      {
        tip = 3;
      }
      else if(rand <= 15)
      {
        tip = 4;
      }
      else if(rand <= 18)
      {
        tip = 5;
      }
    if (distance < bullet.r + enemy.r){
      enemy.health -= 1;
      enemy.r -= 4;
      bullets.splice(i,1);
      if(enemy.health <= 0){
        let drop = new Drop(enemies[j].x,enemies[j].y,tip);
        drops.push(drop);
        enemies.splice(j,1);
        points += 1000;
        
       /* brojUnistenih ++;
        if(brojUnistenih%7==0)
        {
            speed *= 1.1;
        }*/
    
        //console.log(points);
      }
    }
   }
 
}

for(let i = 0; i < drops.length ; ++i)
{
  if(((drops[i].x > igracX) && (drops[i].width + drops[i].x < igracX ))||((drops[i].x < igracX) && (drops[i].width + drops[i].x > igracX )))
  {
    if(((drops[i].y > igracX) && (drops[i].width + drops[i].y < igracY ))||((drops[i].y < igracY) && (drops[i].width + drops[i].y > igracY )))
    {
      if(drops[i].type == 1)
      {
        sarzer += 20;
        drops.splice(i,1);
      }
      if(drops[i].type == 2)
      {
        zdravlje++;
        drops.splice(i,1);
      }
      if(drops[i].type == 3)
      {
        enemies = [];
        drops.splice(i,1);
      }
      if(drops[i].type == 4)
      {
        fireRate += 2;
        stopFire();
        addEventListener('mousedown', startFire); 
       
        

        drops.splice(i,1);
      }
      if(drops[i].type == 5)
      {
        brzinaIgraca += 0.1;
        drops.splice(i,1);
      }
    }
  }
}

 for(let i = 0; i < enemies.length ; ++i ){
  let enemy = enemies[i];
 if(enemy.r + Math.sqrt(30*30 + 25*25)> Math.sqrt((enemy.x - igracX)*(enemy.x - igracX) + (enemy.y - igracY )*(enemy.y - igracY )))
    {
      
      enemies.splice(i,1);
      zdravlje--;
      
      if(zdravlje == 0)
      {
        
        ziv = false;
        mrtav = true;
       
        udji = false;
        brzina_igre = 3;
        ubrzaj = 1;
        brojUnistenih = 0;
        speed = 6;
        enemies = [];
        if( points>sessionStorage.getItem("highscore"))
        {
          sessionStorage.setItem("bronze", sessionStorage.getItem("runnerUp"));
          sessionStorage.setItem("runnerUp", sessionStorage.getItem("highscore"));

              sessionStorage.setItem("highscore", points);
              
        }
        else if( points>sessionStorage.getItem("runnerUp"))
        {
          sessionStorage.setItem("bronze", sessionStorage.getItem("runnerUp"));
              sessionStorage.setItem("runnerUp", points);
              
        }
        else if( points>sessionStorage.getItem("bronze"))
        {
              sessionStorage.setItem("bronze", points);
              
        }
        renderScore();
    
      }
    }
    enemy.Update();
  }



if(tasteri['KeyW']&&tasteri['KeyD'])
{
  igracDy = -3;
  igracDx = 3; 

}
else if(tasteri['KeyW']&&tasteri['KeyA'])
{
  igracDy = -3;
  igracDx = -3; 

}
else if(tasteri['KeyS']&&tasteri['KeyA'])
{
  igracDy = 3;
  igracDx = -3; 

}
else if(tasteri['KeyS']&&tasteri['KeyD'])
{
  igracDy = 3;
  igracDx = 3; 

}
else if(tasteri['KeyW'])
{
  igracDy = -3;
  igracDx = 0;
}
else if(tasteri['KeyS'])
{
 igracDy = 3; 
 igracDx = 0;
}
else if(tasteri['KeyA'])
{
 igracDx = -3; 
 igracDy = 0;
}
else if(tasteri['KeyD'])
{
 igracDx = 3; 
 igracDy = 0;
}
else if(tasteri.length == 0)
{
 igracDx = 0; 
 igracDy = 0;
}
  ubrzaj += 0.04;
  if(brzina_igre < 8)
  brzina_igre += 0.001;
  
  IscrtajIgraca();
  renderScore();
 if(mrtav)
 {
 
 audio.pause();
audio.currentTime = 0;
gotovo.play();
dead();
 }
 /* if(enemies.length == 0)
  {
    alert();
  }*/
}


start();

