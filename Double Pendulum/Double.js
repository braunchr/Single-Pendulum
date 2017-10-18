
function init() {

    // Get the canvas and the context as global variables
    c = document.getElementById("canvas1");
    ctx = c.getContext("2d");

    ax = new Axis(c, ctx);
    
    b1 = new Ball();
    b1.VX = 0.03;
    b1.VY = 0.025;
    b1.BallColor = "Green";

    b2 = new Ball();
    b2.VX = 0.025;
    b2.VY = 0.02;
    
 
    Draw();
}


// Functionto be called by animation timer.
function Draw() {


    b1.X += b1.VX;
    if (b1.X > ax.XaxisMax || b1.X < ax.XaxisMin) { b1.VX = -b1.VX }

    b1.Y += b1.VY;
    if (b1.Y > ax.YaxisMax || b1.Y < ax.YaxisMin) { b1.VY = -b1.VY }

    b2.X += b2.VX;
    if (b2.X > ax.XaxisMax || b2.X < ax.XaxisMin) { b2.VX = -b2.VX }

    b2.Y += b2.VY;
    if (b2.Y > ax.YaxisMax || b2.Y < ax.YaxisMin) { b2.VY = -b2.VY }



    ctx.clearRect(0, 0, c.width, c.height);

    // Draw the balls
    
    b1.Join(b2);
    b1.Draw();
    b2.Draw();

    requestAnimationFrame(Draw);
    
}

// The ball object.
function Ball() {
    // Starting position.
    this.X = 0 ;
    this.Y = 0 ;
    this.BallColor = color1.value;
    // Initial velocity.
    this.VX =0;
    this.VY = 0;

    // Size of the ball.
    this.Radius = 15;

   

}

Ball.prototype.Draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.BallColor;

    
    ctx.arc(ax.ConvX(this.X), ax.ConvY(this.Y), this.Radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

}
    
Ball.prototype.Join = function (b2) {
    ctx.beginPath();

    ctx.moveTo(ax.ConvX(this.X), ax.ConvY(this.Y));
    ctx.lineTo(ax.ConvX(b2.X), ax.ConvY(b2.Y));

    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();
}


function reset() {
   init();

}


function Axis(c, ctx) {
    // Coordinates of the axis
    this.XaxisMax = 2;
    this.XaxisMin = -2;
    this.YaxisMax = 2;
    this.YaxisMin = -2;
    this.c = c;
    this.ctx = ctx;
}

Axis.prototype.ConvX = function (X) {
    return (X * this.c.width / (this.XaxisMax - this.XaxisMin) + this.c.width / 2);    
}

Axis.prototype.ConvY = function (Y) {
    return (-Y * this.c.height / (this.YaxisMax - this.YaxisMin) + this.c.height / 2);
}