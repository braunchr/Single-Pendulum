
function init() {

    // Get the canvas and the context as global variables
    c = document.getElementById("canvas1");
    ctx = c.getContext("2d");
    
    b1 = new Ball();
    b1.VX = 3;
    b1.BallColor = "Red";

    b2 = new Ball();

    // set the variables for the animation
    frameRate = 60;
    setInterval(Draw, 1000 / frameRate);
}


// Functionto be called by timer.
function Draw() {


    b1.X += b1.VX;
    if (b1.X > c.width) { b1.X = 0}

    b1.Y += b1.VY;
    if (b1.Y > c.height) { b1.Y = 0 }

    b2.X += b2.VX;
    if (b2.X > c.width)
    { b2.X = 0 }

    b2.Y += b2.VY;
    if (b2.Y > c.height) { b2.Y = 0 }



    ctx.clearRect(0, 0, c.width, c.height);

    // Draw the balls
    b1.Draw();
    b2.Draw();
    b1.Join(b2);

    
}

// The ball object.
function Ball() {
    // Starting position.
    this.X = 0 ;
    this.Y = 0 ;
    this.BallColor = color1.value;
    // Initial velocity.
    this.VX =2;
    this.VY =2;
    // Size of the ball.
    this.Radius =15 ;

}

Ball.prototype.Draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.BallColor;
    ctx.arc(this.X, this.Y, this.Radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

}
    
Ball.prototype.Join = function (b2) {
    ctx.beginPath();
    ctx.moveTo(this.X, this.Y);
    ctx.lineTo(b2.X, b2.Y);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}


function reset() {
   init();

}