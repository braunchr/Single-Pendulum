
function init() {

    // Get the canvas and the context as global variables
    c = document.getElementById("canvas1");
    ctx = c.getContext("2d");

    PLength = 0.24;
    theta = 2*Math.PI/4 ;
    theta1 = 0;
    theta2 = 0;
    deltat = 1 / 60;

    g = 9.81;

    ax = new Axis(c, ctx);

    // this is the postion of the origin of hte pendulum
    b1 = new Ball();
    b1.BallColor = "Green";
    b1.Y = 0;
    b1.Radius = 8;

    b2 = new Ball();
    b2.X = PLength * Math.sin(theta);
    b2.Y = -PLength * Math.cos(theta) + b1.Y;
    b2.Radius = 15;

    Draw();
}


// Functionto be called by animation timer.
function Draw() {

    //The differential equation goes here
    theta2 = -g / PLength * Math.sin(theta);

    //These are the definitions of the derivatives iterations
    theta1 = (theta1 + theta2 * deltat) ; 
    theta = (theta + theta1 * deltat);

    //Convert the new polar coordinates in cartesian coordinates
    b2.X = PLength * Math.sin(theta);
    b2.Y = -PLength * Math.cos(theta)+b1.Y;



    ctx.clearRect(0, 0, c.width, c.height);

    // Draw the balls
    
    b1.Join(b2);
    b1.Draw();
    b2.Draw();

    re = requestAnimationFrame(Draw);
    
}

// The ball object.
function Ball() {
    // Starting position.
    this.X = 0 ;
    this.Y = 0 ;

    //Color of the ball (from the html object tagged color1)
    this.BallColor = color1.value;
    
    // Size of the ball.
    this.Radius = 8;

   

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
    cancelAnimationFrame(re);
   init();

}


function Axis(c, ctx) {
    // Coordinates of the axis
    this.XMax = 0.3;
    this.XMin = -0.3;
    this.YMax = 0.3;
    this.YMin = -0.3;
    this.c = c;
    this.ctx = ctx;
}

Axis.prototype.ConvX = function (X) {
    return (X * this.c.width / (this.XMax - this.XMin) + this.c.width / 2);    
}

Axis.prototype.ConvY = function (Y) {
    return (-Y * this.c.height / (this.YMax - this.YMin) + this.c.height / 2);
}