window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const gameCont = document.querySelector(".game-cont");
  const ctx = canvas.getContext("2d");

  // canvas.width = 1200;
  // canvas.height = 500;

  canvas.width = gameCont.clientWidth;
  canvas.height = gameCont.clientHeight;

  class Player {
    constructor(game, floor) {
      this.game = game;
      this.floor = floor;

      this.posX = this.game.width * 0.07;
      this.posY = this.game.height * 0.76;

      this.collisionX = this.posX;
      this.collisionY = this.posY;

      this.collisionRadius = 30;
      this.collisionHeight = 100;
      this.collisionWidth = 100;

      //Player Image related
      this.playerImage = new Image();
      this.playerImage.src = "/craftpix-net-230380-free-shinobi-sprites-pixel-art/Fighter/Idle.png";
      this.imgWidth = this.collisionWidth;
      this.imgHeight = this.collisionHeight * 2;
    }

    draw(context) {
      context.save();
      /* 
      context.globalAlpha = 0.5;
      context.fillRect(
        this.collisionX,
        this.collisionY,
        this.collisionHeight,
        this.collisionWidth
      );
      context.strokeRect(
        this.collisionX,
        this.collisionY,
        this.collisionHeight,
        this.collisionWidth
      );
      */

      context.drawImage(
        this.playerImage,
        10,
        31,
        this.imgWidth,
        this.imgHeight,
        this.collisionX,
        this.collisionY,
        this.imgWidth,
        this.imgHeight
      );

      //   context.drawImage(Image, dX, dY, dWidth, dHeight);
      //   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

      context.restore();
    }

    update() {
      let gravity = 5; // Adjust the gravity strength as needed
      let gravitySpeed = 0;
      // Move horizontally
      if (this.game.kbrd.left && this.collisionX > this.game.width * 0.1) {
        this.collisionX -= 5;
      }

      if (this.game.kbrd.right && this.collisionX < this.game.width * 0.9) {
        this.collisionX += 5;
      }

      if (this.game.kbrd.up && this.collisionY >= this.game.height * 0.5) {
        this.collisionY -= 10;
        gravitySpeed = 15;
        layer1.y += 2;
        layer2.y += 1.2;
        this.floor.posY += 1.2;
      } else if (
        !this.game.kbrd.up &&
        this.collisionY < this.game.height * 0.76
      ) {
        if (layer1.y != 0) {
          layer1.y -= 2;
          layer2.y -= 1.2;
          this.floor.posY -= 1.2;
        }
      }
      // Apply gravity
      if (!this.game.kbrd.up && this.collisionY < this.game.height * 0.76) {
        // Check and adjust for floor collision
        gravity += gravitySpeed;
        this.collisionY += 10;
      }
    }
  }

  class PlayerSprite{
    constructor(game){
      this.game = game;
      this.runImage = new Image();
      this.runImage.src = "./craftpix-net-230380-free-shinobi-sprites-pixel-art/Fighter/Run.png";
      
      this.posX = this.game.player.posX;
      this.posY = this.game.player.posY;

      this.collisionX = this.game.player.posX;
      this.collisionY = this.game.player.posY;

      this.collisionRadius = this.game.player.collisionRadius;
      this.collisionHeight = this.game.player.collisionHeight;
      this.collisionWidth = this.game.player.collisionWidth;

      this.imgWidth = this.game.player.collisionWidth;
      this.imgHeight = this.game.player.collisionHeight * 2;

      this.sx = 10;
      this.sy = 31;
      this.iterator = 127;
      this.total = 1040;
      /*
        total = 1040
        i = 10, i<=total; i+=130
        1: 10
        2: 150
        3: 280
        4: 410
      */
    }

    rightDraw(context) {
      context.save();
      context.drawImage(
        this.runImage,
        this.sx,
        this.sy,
        this.imgWidth,
        this.imgHeight,
        this.collisionX,
        this.collisionY,
        this.imgWidth,
        this.imgHeight
      );
      context.restore();
    }

    update() {
      
      this.collisionX = this.game.player.posX;
      this.collisionY = this.game.player.posY;

      if(this.sx <= this.total)
      this.sx += this.iterator;
      else
      this.sx = 10;
    }
  }

  class Floor {
    constructor(game) {
      this.game = game;
      this.posX = 0;
      this.posY = 545;
      this.height = 55;
    }
    draw(context) {
      context.save();
      context.globalAlpha = 0.2;
      context.fillStyle = "blue";
      context.fillRect(this.posX, this.posY, this.game.width, this.height);
      // context.strokeRect(this.posX, this.posY, 100,100);
      context.restore();
      // context.stroke();
    }
  }

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
        up: false,
        down: false,
      };

      window.addEventListener("keydown", (e) => {
        if (e.keyCode === 87 || e.keyCode === 38) {
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
        if (this.kbrd.left) {
          this.kbrd.left = false;
        } else if (this.kbrd.up) {
          this.kbrd.up = false;
        } else if (this.kbrd.right) {
          this.kbrd.right = false;
        } else if (this.kbrd.down) {
          this.kbrd.down = false;
        }
      });
    }

    render(context) {
      if(this.kbrd.right){
        this.playerSprite.rightDraw(context);
        this.playerSprite.update();
      }
      else{
        this.player.draw(context);
        this.player.update();
      }
    
      this.floor.draw(context);
    }
  }

  const game = new Game(canvas);

  let gameSpeed = 5;

  const bgimg = new Image();
  bgimg.src = "/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/Background.png";
  const platformImage = new Image();
  platformImage.src = "/backgroundLayers(1)/layer-5.png";
  const cloudImage = new Image();
  cloudImage.src =
    "/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/2.png";
  const skyImage = new Image();
  skyImage.src =
    "/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/grey.png";

  class Layers {
    constructor(image, speedModifier, canvas, pos) {
      this.image = image;
      this.x = 0;
      this.abc = 1250;
      this.x2 = this.abc;
      this.speed = speedModifier;
      this.canvas = canvas;
      this.y = pos;
    }

    // The update method is not in use right now
    // update() {
    //   if (game.kbrd.right && game.player.collisionX > game.canvas.width * 0.8) {
    //     if (this.x < -this.abc) {
    //       this.x = this.abc;
    //     } else {
    //       this.x -= this.speed;
    //     }

    //     if (this.x2 < -this.abc) {
    //       this.x2 = this.abc;
    //     } else {
    //       this.x2 -= this.speed;
    //     }
    //   } else if (
    //     game.kbrd.left &&
    //     game.player.collisionX < game.canvas.width * 0.5
    //   ) {
    //     if (this.x > this.abc) {
    //       this.x = -this.abc;
    //     } else {
    //       this.x += this.speed;
    //     }

    //     if (this.x2 > this.abc) {
    //       this.x2 = -this.abc;
    //     } else {
    //       this.x2 += this.speed;
    //     }
    //   }
    // }

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
      // context.drawImage(Image, dX, dY, dWidth, dHeight);
    }
  }

  const layer1 = new Layers(bgimg, gameSpeed, canvas, 0);
  const layer2 = new Layers(platformImage, gameSpeed, canvas, 55);
  const layer3 = new Layers(skyImage, gameSpeed, canvas, 0);
  const layer4 = new Layers(cloudImage, gameSpeed, canvas, 0);

  const screen = [layer3, layer4, layer1, layer2];

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    screen.forEach((object) => {
      // object.update();
      object.draw();
    });
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
});
