window.addEventListener('load',()=>{
    const canvas= document.getElementById("canvas");
    const ctx= canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 500;

    class Player{
        constructor(game){
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30;
        }
        draw(context){
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
        update(){
            // this.collisionX= this.game.mouse.x;
            // this.collisionY= this.game.mouse.y;

            if(this.game.kbrd.left){
                this.collisionX -= 5;
            }else if(this.game.kbrd.right){
                this.collisionX += 5;
            }else if(this.game.kbrd.up){
                this.collisionY -= 5;
            }else if(this.game.kbrd.down){
                this.collisionY += 5;
            }
        }
    }

    class Game{
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player  = new Player(this);
            // this.mouse={
            //     x: this.width * 0.5,
            //     y: this.height * 0.5,
            //     pressed: false
            // }
            // window.addEventListener('mousedown',(e)=>{
            //     this.mouse.x = e.offsetX;
            //     this.mouse.y = e.offsetY;
            //     this.mouse.pressed = false;
            // })
            // window.addEventListener('mouseup',(e)=>{
            //     this.mouse.x = e.offsetX;
            //     this.mouse.y = e.offsetY;
            //     this.mouse.pressed = false;
            // })
            // window.addEventListener('mousemove', (e)=>{
            //     this.mouse.x = e.offsetX;
            //     this.mouse.y = e.offsetY;
            //     console.log(this.mouse.x, this.mouse.y);
            // })
            this.kbrd={
                /*
                    a,w,d,s: 65, 87, 68, 83
                    left, up, right, down: 37, 38, 39,40
                */
                left: false,
                right: false,
                up: false,
                down: false
            }
            window.addEventListener('keydown', (e)=>{
                console.log(e.keyCode);

                if(e.keyCode === 65 || e.keyCode === 37){
                    this.kbrd.left = true;
                    console.log(this.kbrd.left);
                }else if(e.keyCode === 87 || e.keyCode === 38){
                    this.kbrd.up = true;
                }else if(e.keyCode === 68 || e.keyCode === 39){
                    this.kbrd.right = true;
                }else if(e.keyCode === 83 || e.keyCode === 40){
                    this.kbrd.down = true;
                }
            })

            window.addEventListener('keyup', (e)=>{
                if(this.kbrd.left){
                    this.kbrd.left = false;
                    console.log(this.kbrd.left);
                }else if(this.kbrd.up){
                    this.kbrd.up = false;
                }else if(this.kbrd.right){
                    this.kbrd.right = false;
                }else if(this.kbrd.down){
                    this.kbrd.down = false;
                }
            })
        }
        render(context){
            this.player.draw(context);
            this.player.update();
        }
    }

    const game= new Game(canvas);
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
})