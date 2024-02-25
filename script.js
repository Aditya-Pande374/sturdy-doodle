// Wait for the entire window to load before initializing the game
window.addEventListener("load", () => {
  // Get canvas and context
  const canvas = document.getElementById("canvas");
  const gameCont = document.querySelector(".game-cont");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = gameCont.clientWidth;
  canvas.height = gameCont.clientHeight;

  // Player class representing the main character
  class Player {
    constructor(game, floor) {
      // Initialize player properties
      this.game = game;
      this.floor = floor;
      this.posX = this.game.width * 0.005;
      this.posY = this.game.height * 0.7;

      this.collisionX = this.posX;
      this.collisionY = this.posY;

      this.collisionHeight = 100;
      this.collisionWidth = 100;

      this.sx = 36;
      this.sy = 42;
      this.sWidth = 64;
      this.sHeight = 85;
      this.imgWidth = 100;
      this.imgHeight = 100;

      // Player image properties
      this.playerImage = new Image();
      this.playerImage.src = "./Sprites/craftpix-net-230380-free-shinobi-sprites-pixel-art/Fighter/Idle.png";
    }

    // Method to draw the player on the canvas
    draw(context) {
      context.save();
      context.drawImage(this.playerImage, this.sx, this.sy, this.sWidth, this.sHeight, this.collisionX, this.collisionY, this.imgWidth, this.imgHeight);
      context.restore();
    }

    // Method to update player position and apply gravity
    update() {
      let gravity = 5;
      let gravitySpeed = 0;

      // Horizontal movement
      if(this.game.kbrd.left && this.collisionX > this.game.width * 0.005){
        this.collisionX -= 10
      }
      if(this.game.kbrd.right && this.collisionX < this.game.width * 0.47){
        this.collisionX += 10;
      }

      // Vertical movement
      if (this.game.kbrd.up && this.collisionY >= this.game.height * 0.5) {

        this.collisionY -= 10;
      }

      // Apply gravity
      if (!this.game.kbrd.up && this.collisionY < this.game.height * 0.75) {
        gravity += gravitySpeed;
        this.collisionY += 10;
      }

      // Update player sprite collision coordinates
      this.game.playerSprite.collisionX = this.collisionX;
      this.game.playerSprite.collisionY = this.collisionY;
    }
  }

  // PlayerSprite class handling player sprite animations
  class PlayerSprite {
    constructor(game) {
      this.game = game;
      this.posX = this.game.player.posX;
      this.posY = this.game.player.posY;
      this.collisionHeight = this.game.player.collisionHeight;
      this.collisionWidth = this.game.player.collisionWidth;
      
      //Images Height and Width
      this.collisionX = this.game.player.posX;
      this.collisionY = this.game.player.posY;
      this.sWidth = 64;
      this.sHeight = 85;
      this.imgWidth = 100;
      this.imgHeight = 100;

      // Running Image
      this.runImage = new Image();
      this.sxRight = 36;
      this.sxLeft = 930;
      this.sy = 42;
      this.runImageSX = [29, 160, 284, 421, 548, 672, 797, 930];
      this.currentSXIndex = 0;
      this.currentSXIndexLeft = 7;

      // Jump Images
      
    }

    // Method to draw the player sprite when moving right
    rightDraw(context) {
      context.save();
      context.drawImage(this.runImage, this.sxRight, this.sy, this.sWidth, this.sHeight, this.collisionX, this.collisionY, this.imgWidth, this.imgHeight);

      // drawImage(image, dx, dy)
      // drawImage(image, dx, dy, dWidth, dHeight)
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

      context.restore();
    }

    // Method to draw the player sprite when moving left
    leftDraw(context) {
      context.save();
      
      context.drawImage(this.runImage, this.sxLeft, this.sy, this.sWidth, this.sHeight, this.collisionX, this.collisionY, this.imgWidth, this.imgHeight);

      context.restore();
    }

    // Method to update player sprite animation and movement
    update() {
      // Right movement
      if (this.game.kbrd.right) {
        this.runImage.src = "./Sprites/craftpix-net-230380-free-shinobi-sprites-pixel-art/Fighter/Run.png";
        this.sxRight = this.runImageSX[this.currentSXIndex];
        this.currentSXIndex = (this.currentSXIndex + 1) % this.runImageSX.length;
      }

      // Left Movement
      if(this.game.kbrd.left){
        this.runImage.src = "./Sprites/craftpix-net-230380-free-shinobi-sprites-pixel-art/Fighter/Run-left.png"
        this.sxLeft = this.runImageSX[this.currentSXIndexLeft];
        this.currentSXIndexLeft = (this.currentSXIndexLeft - 1);
        if (this.currentSXIndexLeft < 0) {
          this.currentSXIndexLeft = 7;
        }
      }
    }
  }

  // Floor class representing the ground
  class Floor {
    constructor(game) {
      this.game = game;
      this.posX = 0;
      this.posY = 545;
      this.height = 55;
    }

    // Method to draw the floor on the canvas
    draw(context) {
      context.save();
      context.globalAlpha = 0.2;
      context.fillStyle = "blue";
      context.fillRect(this.posX, this.posY, this.game.width, this.height);
      context.restore();
    }
  }

  // Game class handling overall game logic
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.floor = new Floor(this);
      this.player = new Player(this, this.floor);
      this.playerSprite = new PlayerSprite(this);

      this.kbrd = {
        left: false,
        right: false,
        up: false, // Fly
        down: false
      };

      // Event listeners for keyboard input
      window.addEventListener("keydown", (e) => {
        if (this.kbrd.up && (e.keyCode === 87 || e.keyCode === 38)){
          this.kbrd.up = false;
        }else if (e.keyCode === 87 || e.keyCode === 38) {
          this.kbrd.up = true;
        } 
        if (e.keyCode === 65 || e.keyCode === 37) {
          this.kbrd.left = true;
        }
        if (e.keyCode === 68 || e.keyCode === 39) {
          this.kbrd.right = true;
        }
        if (e.keyCode === 83 || e.keyCode === 40) {
          this.kbrd.down = true;
        }
      });

      window.addEventListener("keyup", (e) => {
        // Reset keyboard states when keys are released
        if (this.kbrd.left) {
          this.kbrd.left = false;
        }
        // if (this.kbrd.up) {
        //   this.kbrd.up = false;
        // }
        if (this.kbrd.right) {
          this.kbrd.right = false;
        }
        if (this.kbrd.down) {
          this.kbrd.down = false;
        }
      });
    }

    // Method to render the game elements on the canvas
    render(context) {
      // Check if the player is moving right
      if (this.kbrd.right) {
        this.playerSprite.rightDraw(context);
        this.playerSprite.update();
      } else if (this.kbrd.left) {
        // Check if the player is moving left
        this.playerSprite.leftDraw(context);
        this.playerSprite.update();
      } else {
        // If not moving, draw the player
        this.player.draw(context);
      }

      // Update player and floor
      this.player.update();
      this.floor.draw(context);
    }
  }

  // Create a new instance of the Game class
  const game = new Game(canvas);

  // Set the initial game speed
  let gameSpeed = 5;

  // Load background and platform images
  const bgimg = new Image();
  bgimg.src = "./Sprites/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/Background.png";
  const platformImage = new Image();
  platformImage.src = "./Sprites/backgroundLayers(1)/layer-5.png";
  const cloudImage = new Image();
  cloudImage.src = "./Sprites/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/2.png";
  const skyImage = new Image();
  skyImage.src = "./Sprites/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/grey.png";

  // Layers class handling background layers
  class Layers {
    constructor(image, canvas, pos) {
      this.image = image;
      this.x = 0;
      this.abc = 1250;
      this.x2 = this.abc;
      this.canvas = canvas;
      this.y = pos;
    }

    // Method to draw the background layers on the canvas
    draw() {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.canvas.width,
        this.canvas.height
      );
      ctx.drawImage(
        this.image,
        this.x2,
        this.y,
        this.canvas.width,
        this.canvas.height
      );
    }
  }

  // Create instances of Layers for different background elements
  const layer1 = new Layers(skyImage, canvas, 0);
  const layer2 = new Layers(cloudImage, canvas, 0);
  const layer3 = new Layers(bgimg, canvas, 0);
  const layer4 = new Layers(platformImage, canvas, 55);

  // Array to store background layers
  const screen = [layer1, layer2, layer3, layer4];

  //Objects
  class Objects{
    constructor(image, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight, globalAlpha){
      this.objectImage = image;
      this.sX= sX;
      this.sy = sY;
      this.sWidth = sWidth;
      this.sHeight = sHeight;
      this.dX = dX;
      this.dY = dY;
      this.dWidth = dWidth;
      this.dHeight = dHeight;
      this.globalAlpha = globalAlpha;
    }

    draw(context){
      context.save();
      // context.fillStyle = 'black';
      // context.fillRect(0, 324, 437, 223)
      context.globalAlpha = this.globalAlpha;

      context.drawImage(this.objectImage, this.sX, this.sy, this.sWidth, this.sHeight, this.dX, this.dY, this.dWidth, this.dHeight);

      context.restore();
    }
  }

  const entryImage = new Image();
  entryImage.src = "./Sprites/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Animated objects/Entry.png";
  const blackBackground = new Image();
  blackBackground.src = "./Sprites/backgroundLayers(1)/Black.png"
  const compsImage = new Image();
  compsImage.src = "./Sprites/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Animated objects/Screen2.png"

  const objectentryImage = new Objects(entryImage, 32, 0, 256, 264, 0, 324, 500, 900, 1);
  const objectblackBackground = new Objects(blackBackground, 32, 0, 256, 264, 0, 324, 435, 220, 1);
  const objectComps = new Objects(compsImage, 2, 5, 126, 37, 300, 466, 400, 80, 1);

  const aboutMe = document.querySelector(".about-me");
  const skills = document.querySelector(".skills");
  const projects = document.querySelector(".projects");
  const contactMe = document.querySelector(".contact-me");

  function abc(){
    console.log("Player: "+game.player.collisionX);
    console.log("Comp 1: "+objectComps.dX);
    //About-Me
    if(game.player.collisionX > objectComps.dX - 50 && game.player.collisionX < objectComps.dX){
      console.log(true);
      aboutMe.style.display = 'block';
    }else {
      aboutMe.style.display = 'none';
    }
    //Skills
    if(game.player.collisionX >= objectComps.dX + 50 && game.player.collisionX < objectComps.dX + 110){
      console.log(true);
      skills.style.display = 'block';
    }else {
      skills.style.display = 'none';
    }
    //Projects
    if(game.player.collisionX > objectComps.dX + 150 && game.player.collisionX < objectComps.dX + 210){
      console.log(true);
      projects.style.display = 'block';
    }else {
      projects.style.display = 'none';
    }
    //Contact-Me
    if(game.player.collisionX > objectComps.dX + 250 && game.player.collisionX < objectComps.dX + 310){
      console.log(true);
      contactMe.style.display = 'block';
    }else {
      contactMe.style.display = 'none';
    }
  }

  

  // context.drawImage(this.objectImage, this.sX, this.sy, this.sWidth, this.sHeight, this.dX, this.dY, this.dWidth, this.dHeight);
  
  const animatedObject = [objectblackBackground, objectentryImage, objectComps];
  // Animation function to update and render the game
  function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background layers and game elements
    screen.forEach((object) => {
      object.draw();
    });

    animatedObject.forEach((object) => {
      object.draw(ctx);
    });
    game.render(ctx);

    abc();
    // Request the next animation frame
    requestAnimationFrame(animate);
  }

  // Start the animation loop
  animate();
});
