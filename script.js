window.addEventListener('load', () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 500;

    class Player {
        constructor(game) {
            this.game = game;
            this.collisionX = this.game.width * 0.07;
            this.collisionY = this.game.height * 0.8;
            this.collisionRadius = 30;
        }

        draw(context) {
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY);
            context.lineTo(this.collisionX, this.collisionY);
            context.stroke();
        }

        update() {
            if (this.game.kbrd.left && this.collisionX > this.game.width * 0.5) {
                this.collisionX -= 5;
            } else if (this.game.kbrd.right && this.collisionX < this.game.width * 0.5) {
                this.collisionX += 5;
            } else if (this.game.kbrd.up) {
                this.collisionY -= 5;
            } else if (this.game.kbrd.down && this.collisionY < this.game.height * 0.9) {
                this.collisionY += 5;
            }
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.kbrd = {
                left: false,
                right: false,
                up: false,
                down: false
            };

            window.addEventListener('keydown', (e) => {
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

            window.addEventListener('keyup', (e) => {
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
        }
    }

    const game = new Game(canvas);
    let x = 0;
    let abc = 1150;
    let x2 = abc;
    let gameSpeed = 15;
    const bgimg = new Image();
    bgimg.src = "/craftpix-net-965049-free-industrial-zone-tileset-pixel-art/Backgrounds/Background.png";
   
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(bgimg, x, 0, canvas.width, canvas.height);
        ctx.drawImage(bgimg, x2, 0, canvas.width, canvas.height);

        if ((game.kbrd.right && game.player.collisionX > game.canvas.width * 0.5)) {
            if (x < -abc) {
                x = abc;
            } else {
                x -= gameSpeed;
            }

            if (x2 < -abc) {
                x2 = abc;
            } else {
                x2 -= gameSpeed;
            }
        }else if(game.kbrd.left && game.player.collisionX < game.canvas.width * 0.5){
            if (x > abc) {
                x = -abc;
            } else {
                x += gameSpeed;
            }

            if (x2 > abc) {
                x2 = -abc;
            } else {
                x2 += gameSpeed;
            }
        }
        game.render(ctx);
        requestAnimationFrame(animate);
    }

    animate();
});