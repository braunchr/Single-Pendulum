
function init() {

    // Get the canvas and the context as global variables
    canv = document.getElementById("canvas1");
    ctx = canv.getContext("2d");
        
    // the time interval in seconds for the differntial equation increments 
    fps = 1 / 60;
    multip = 50000;
    deltat = fps / multip;

    // gravitational constant
    g = 9.81;

    // the initial conditions for the first pendulum
    l1 = 0.6;                   // length of the first pendulum
    m1 = 1;                     // mass of the first pendulum
    t1 = 3*Math.PI/4 ;      // angle of the first pendulum
    t1D = 0;                // the first derivative to time is the angular velocity: t dot
    t1DD = 0;               // the second derivative to time is the angular acceleration: t double dot.

    // the initial conditions for the second pendulum
    l2 = 0.4;
    m2 = 3;
    t2 = 3*Math.PI / 4;
    t2D = 0;
    t2DD = 0;
        
    ax = new Axis(canv, ctx);

    // this is the postion of the centre of the entire pendulum  
    ball0 = new Ball();
    ball0.BallColor = "Blue";
    ball0.Radius = 5;
    ball0.X = 0;
    ball0.Y = 0;

    // this is the postion of the first pendulum
    ball1 = new Ball();
    ball1.BallColor = "Green";
    ball1.Radius = 15 * Math.sqrt(m1);   //just sqrt to make the appearance bigger when the mass is higher
    ball1.X = l1 * Math.sin(t1);
    ball1.Y = -l1 * Math.cos(t1);


    // the posistion of the second pendulum
    ball2 = new Ball();
    ball2.BallColor = "Red";
    ball2.Radius = 15 * Math.sqrt(m2);
    ball2.X = l2 * Math.sin(t2) + ball1.X;
    ball2.Y = -l2 * Math.cos(t2) + ball1.Y;

    enPotential = -g * l1 * (m1 + m2) * Math.cos(t1) - g * m2 * l2 * Math.cos(t2);
    enKinetic = m1 / 2 * l1 * l1 * t1D * t1D + m2 / 2 * (l1 * l1 * t1D * t1D + l2 * l2 * t2D * t2D + 2 * l1 * l2 * t1D * t2D * Math.cos(t1 - t2));
    enInitial = enPotential + enKinetic;

    
    Draw();
}


// Functionto be called by animation timer.
function Draw() {

    //The differential equation goes here we have a set of 2 equations of 2 unknown x=t2DD and y=t1DD
    // The form of these 2 equations is ax + by + c = 0 and mx + ny+ k = 0 


    // iterate a number of time before displaying the next frame (every 1/60 of a second)

    for (i = 0; i < multip; i++){
        a = l2;
        b = l1 * Math.cos(t1 - t2);
        c = -l1 * t1D * t1D * Math.sin(t1 - t2) + g * Math.sin(t2);

        m = m2 * l2 * Math.cos(t1 - t2);
        n = (m1 + m2) * l1;
        k = g * (m1 + m2) * Math.sin(t1) + m2 * l2 * t2D * t2D * Math.sin(t1 - t2);

        den = b * m - a * n;

        t2DD = (n * c - b * k) / den;
        t1DD = (a * k - m * c) / den;


        //These are the definitions of the derivatives iterations
        t1D = (t1D + t1DD * deltat);
        t1 = (t1 + t1D * deltat);

        t2D = (t2D + t2DD * deltat);
        t2 = (t2 + t2D * deltat);
    }



    // do the below only once every frame. No need to iterate between frames. Start by clearing the old picture
    ctx.clearRect(0, 0, canv.width, canv.height);

    // Calculate and display the total energy
    enPotential = -g * l1 * (m1 + m2) * Math.cos(t1) - g * m2 * l2 * Math.cos(t2);
    enKinetic = m1 / 2 * l1 * l1 * t1D * t1D + m2 / 2 * (l1 * l1 * t1D * t1D + l2 * l2 * t2D * t2D + 2 * l1 * l2 * t1D * t2D * Math.cos(t1 - t2));
    enLossPercent = (enInitial - enPotential - enKinetic) / enInitial * 100;

    enString = (enLossPercent.toFixed(2));
    ctx.font = "30px Arial";
    ctx.fillText("Energy loss: " + enString +"%", 10, 50);

    //Convert the new polar coordinates in cartesian coordinates
    ball1.X = l1 * Math.sin(t1);
    ball1.Y = -l1 * Math.cos(t1);

    ball2.X = l2 * Math.sin(t2) + ball1.X;
    ball2.Y = -l2 * Math.cos(t2) + ball1.Y;
        
  // Draw the balls
    ball0.Join(ball1);    
    ball1.Join(ball2);
    ball0.Draw();
    ball1.Draw();
    ball2.Draw();

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
    
Ball.prototype.Join = function (ball2) {
    ctx.beginPath();

    ctx.moveTo(ax.ConvX(this.X), ax.ConvY(this.Y));
    ctx.lineTo(ax.ConvX(ball2.X), ax.ConvY(ball2.Y));

    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.closePath();
}


function reset() {
    cancelAnimationFrame(re);
   init();

}


function Axis(canv, ctx) {
    // Coordinates of the axis
    this.XMax = 1;
    this.XMin = -1;
    this.YMax = 0.8;
    this.YMin = -1.2;
    this.canv = canv;
    this.ctx = ctx;
}

Axis.prototype.ConvX = function (X) {
    return (X * this.canv.width / (this.XMax - this.XMin) - this.canv.width * this.XMin / (this.XMax - this.XMin));    
}

Axis.prototype.ConvY = function (Y) {
    return (-Y * this.canv.height / (this.YMax - this.YMin) + this.canv.height * this.YMax / (this.YMax - this.YMin));
}