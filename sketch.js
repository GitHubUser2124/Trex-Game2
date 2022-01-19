var trex ,trex_running,trex_dead;
var ground, groundImage;
var cloud, cloudImg;
var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var cloudGroup;
var cactusGroup;
var restart, restartImg;
var gameOver, gameOverImg;
var play = 1;
var end = 0;
var gameState = play;
var dieSound, checkpointSound, jumpSound;
var score = 0;
var invisGround;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_dead = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");

  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");


}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
  trex = createSprite(50, height-50);
  trex.addAnimation("Running", trex_running);
  trex.addAnimation("Collided", trex_dead);
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 35);
  trex.scale = 0.6;

  //Ground
  ground = createSprite(width/2, height-20);
  ground.addImage(groundImage);
  ground.velocityX=-10;
  
  //Invisible Ground
  invisGround = createSprite(width/2, height-10, width, 10);
  invisGround.visible = false;

  //Game Over cause you suck
  gameOver = createSprite(width/2, height/2-80);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  
  //Restart cause you suck
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.visible = false;



  //objectName = new ClassName();
  cloudGroup = new Group();

  cactusGroup = new Group();

  console.log(trex.depth);

}


function draw(){
  background("white");
  textSize(25);
  textFont("Franklin Gothic");
  text("Score: "+score, width-150, height/2);

  if(gameState === play){
    //Calcutaing Scores
    score+=Math.round(getFrameRate()/60);

    //Trex Jump
    if(keyDown("space") && trex.isTouching(ground)){
      trex.velocityY=-12;
      jumpSound.play();
    }

    

    if(score%100 === 0 && score>0){
      checkpointSound.play();
    }

    //Adaptivity
    ground.velocityX=-(4+score/50);
    

    //Making Ground Infinite
    if(ground.x<400){
      ground.x = width/2;
    }

    //Spawn Clouds and Cactus
    spawnClouds();
    spawnCactus();

    //Adding Gravity
    trex.velocityY+=0.6;

    if(trex.isTouching(cactusGroup)){
      gameState = end;
      dieSound.play();
    }

    restart.visible = false;
    gameOver.visible = false;
  }
  else if(gameState === end){
    ground.velocityX = 0;

    cloudGroup.setVelocityXEach(0);
    cactusGroup.setVelocityXEach(0);

    trex.velocityY = 0;

    trex.changeAnimation("Collided", trex_dead);

    cactusGroup.setLifetimeEach(-69);
    cloudGroup.setLifetimeEach(-69);

    restart.visible = true;
    gameOver.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }
    
    

  }

  

  trex.collide(invisGround);
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount%60===0){
    cloud = createSprite(width+50, random(0,height-200), 50, 50);
    cloud.addImage(cloudImg);
    cloud.scale = 1.2;
    cloud.velocityX=-10;
    cloud.lifetime = (1600/5);

    trex.depth=cloud.depth;
    trex.depth+=1;

    cloudGroup.add(cloud);
  }
}

function spawnCactus(){
  if(frameCount % 60===0){
    cactus = createSprite(width+50, height-40, 40, 40);

    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:cactus.addImage(cactus1);
      break;
      case 2:cactus.addImage(cactus2);
      break;
      case 3:cactus.addImage(cactus3);
      break;
      case 4:cactus.addImage(cactus4);
      break;
      case 5:cactus.addImage(cactus5);
      break;
      case 6:cactus.addImage(cactus6);
      break;
      default:break;
    }

    cactus.velocityX=-(8+score/50);
    cactus.scale = 0.6;
    cactus.lifetime = (1600/5);
    cactusGroup.add(cactus);
  }

  
}

function reset(){
  gameState = play;
  cactusGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("Running", trex_running);
  score = 0;
  
}