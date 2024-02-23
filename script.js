window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const gameCont = document.querySelector(".game-cont");
  const ctx = canvas.getContext("2d");

  // canvas.width = 1200;
  // canvas.height = 500;

  canvas.width = gameCont.clientWidth;
  canvas.height = gameCont.clientHeight;

  class Player {
    constructor(game) {
      this.game = game;
      this.tiles = new Floor(this);
      this.posX = this.game.width * 0.07;
      this.posY = this.game.height * 0.76;
      this.collisionX = this.posX;
      this.collisionY = this.posY;
      this.checkCollisionFloor = false;
      this.collisionRadius = 30;

      this.collisionHeight = 100;
      this.collisionWidth = 100;
    }

    draw(context) {
      context.save();
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

      console.log("Players collisionY: " + this.collisionY);
      console.log("Players posY: " + this.posY);
      context.restore();
    }

    update() {
        let gravity = 5; // Adjust the gravity strength as needed
        let gravitySpeed = 0;
        // Move horizontally
        if (this.game.kbrd.left && this.collisionX > this.game.width * 0.5) {
            this.collisionX -= 5;
        }
        
        if (this.game.kbrd.right && this.collisionX < this.game.width * 0.5) {
            this.collisionX += 5;
        }

        if(this.game.kbrd.up){
            this.collisionY -= 10;
            gravitySpeed +=5;
        }
        // Apply gravity
        if (!this.game.kbrd.up && this.collisionY < this.game.height * 0.76) {
            // Check and adjust for floor collision
            gravity += gravitySpeed;
            this.collisionY += gravity;
        }

    }
  }

  class Floor {
    constructor(game) {
      this.game = game;
      this.posX = 0;
      this.posY = this.game.height - 40;
    }
    draw(context) {
      context.save();
      context.globalAlpha = 0.2;
      context.fillStyle = "blue";
      context.fillRect(this.posX, this.posY, this.game.width, 50);
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
      this.player = new Player(this);
      this.floor = new Floor(this);

      this.kbrd = {
        left: false,
        right: false,
        up: false,
        down: false,
      };

      window.addEventListener("keydown", (e) => {
        if (e.keyCode === 65 || e.keyCode === 37) {
          this.kbrd.left = true;
        } else if (e.keyCode === 87 || e.keyCode === 38) {
          this.kbrd.up = true;
        } else if (e.keyCode === 68 || e.keyCode === 39) {
          this.kbrd.right = true;
        } else if (e.keyCode === 83 || e.keyCode === 40) {
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
      this.player.draw(context);
      this.player.update();
      this.floor.draw(context);
    }
  }

  const game = new Game(canvas);

  let gameSpeed = 5;

  const bgimg = new Image();
  bgimg.src =
    "/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/Background.png";
  const platformImage = new Image();
  platformImage.src = "/backgroundLayers(1)/layer-5.png";

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
    update() {
      if (game.kbrd.right && game.player.collisionX > game.canvas.width * 0.5) {
        if (this.x < -this.abc) {
          this.x = this.abc;
        } else {
          this.x -= this.speed;
        }

        if (this.x2 < -this.abc) {
          this.x2 = this.abc;
        } else {
          this.x2 -= this.speed;
        }
      } else if (
        game.kbrd.left &&
        game.player.collisionX < game.canvas.width * 0.5
      ) {
        if (this.x > this.abc) {
          this.x = -this.abc;
        } else {
          this.x += this.speed;
        }

        if (this.x2 > this.abc) {
          this.x2 = -this.abc;
        } else {
          this.x2 += this.speed;
        }
      }
    }
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

  const screen = [layer1, layer2];

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    screen.forEach((object) => {
      object.update();
      object.draw();
    });
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
});
