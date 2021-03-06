
function init() {

    // Get the canvas and the context as global variables
    canv = document.getElementById("canvas1");
    ctx = canv.getContext("2d");
        
    // the time interval in seconds for the differntial equation increments 
    fps = 1 / 60;
    multip = 50000;
    deltat = fps / multip;
    stepCounter = 0;

    // gravitational constant
    g = 9.8;

    vDiff = new DiffVector();

    // the initial conditions for the first pendulum
    l1 = 0.6;                // length of the first pendulum
    m1 = 1;                  // mass of the first pendulum
    t1 =  vDiff.t1;                  // angle of the first pendulum
    t1D = vDiff.t1D;                 // the first derivative to time is the angular velocity: t dot
    t1DD = vDiff.t1DD;               // the second derivative to time is the angular acceleration: t double dot.

    // the initial conditions for the second pendulum
    l2 = 0.4;
    m2 = 3;
    t2 = vDiff.t2;
    t2D = vDiff.t2D;
    t2DD = vDiff.t2DD;
        
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

    err = 0
    tol = 0.00000000001;
    // calculate next iteration from previous variables


    v1 = new DiffVector();
    v0 = new DiffVector();
    vHalf = new DiffVector();
    cumulDeltat = 0;


    while (cumulDeltat < 1 / 60) {
              
        v0.copy(vDiff);
        v1.copy(vDiff);

        iterateRungeKutta(v1, deltat);
        iterateRungeKutta(vDiff, deltat / 2);
        vHalf.copy(vDiff);
        iterateRungeKutta(vDiff, deltat / 2);
        stepCounter += 3;

        err = Math.sqrt(Math.pow(vDiff.t1 - v1.t1, 2) + Math.pow(vDiff.t2 - v1.t2, 2) + Math.pow(vDiff.t1D - v1.t1D, 2) + Math.pow(vDiff.t2D - v1.t2D,2));


        while (err > tol) {

            vDiff.copy(v0);
            v1.copy(v0);

            deltat = 0.5 * deltat * Math.pow(tol / err, 1 / 4)

            iterateRungeKutta(v1, deltat);
            iterateRungeKutta(vDiff, deltat / 2);
            iterateRungeKutta(vDiff, deltat / 2);
            stepCounter += 3;

            err = Math.sqrt(Math.pow(vDiff.t1 - v1.t1, 2) + Math.pow(vDiff.t2 - v1.t2, 2) + Math.pow(vDiff.t1D - v1.t1D, 2) + Math.pow(vDiff.t2D - v1.t2D, 2));

        }

        cumulDeltat += deltat;
        deltat = 0.9 * deltat * Math.pow(tol / err, 1 / 5)

        //if (deltat > 1 / 60) {
        //    deltat = 1 / 60
        //}
        
    }



    // do the below only once every frame. No need to iterate between frames. Start by clearing the old picture
    ctx.clearRect(0, 0, canv.width, canv.height);

    // Calculate and display the total energy
    enPotential = -g * l1 * (m1 + m2) * Math.cos(vDiff.t1) - g * m2 * l2 * Math.cos(vDiff.t2);
    enKinetic = m1 / 2 * l1 * l1 * vDiff.t1D * vDiff.t1D + m2 / 2 * (l1 * l1 * vDiff.t1D * vDiff.t1D + l2 * l2 * vDiff.t2D * vDiff.t2D + 2 * l1 * l2 * vDiff.t1D * vDiff.t2D * Math.cos(vDiff.t1 - vDiff.t2));
    enLossPercent = (enInitial - enPotential - enKinetic) / enInitial * 100;

    enString = (enLossPercent.toFixed(8));
    stepString = stepCounter.toString();
    ctx.font = "30px Arial";
    ctx.fillText("Energy loss: " + enString + "%   " + stepString, 10, 50);

    //Convert the new polar coordinates in cartesian coordinates
    ball1.X = l1 * Math.sin(vDiff.t1);
    ball1.Y = -l1 * Math.cos(vDiff.t1);

    ball2.X = l2 * Math.sin(vDiff.t2) + ball1.X;
    ball2.Y = -l2 * Math.cos(vDiff.t2) + ball1.Y;

    // Draw the balls
    ball0.Join(ball1);
    ball1.Join(ball2);
    ball0.Draw();
    ball1.Draw();
    ball2.Draw();

    re = requestAnimationFrame(Draw);

}

function DiffVector() {
    // The differential vector
    this.t1 = 2*Math.PI / 2;
    this.t2 = 2*Math.PI / 3;
    this.t1D = 0;
    this.t2D = 0;
}

DiffVector.prototype.copy = function(source){
    
    this.t1 = source.t1;
    this.t2 = source.t2;
    this.t1D = source.t1D;
    this.t2D = source.t2D;
    
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

function iterateEuler(vDiff, step) {

    y1 = vDiff.t1;
    y2 = vDiff.t2;
    y3 = vDiff.t1D;
    y4 = vDiff.t2D;
  
    //The differential equation goes here we have a set of 2 equations of 2 unknown x=t2DD and y=t1DD
    // The form of these 2 equations is ax + by + c = 0 and mx + ny+ k = 0 
    // the solution of this is simply x=(nc-bk)/(bm-an) and y=(ak-mc)/(bm-an)
    // values abc and mnk come from the Euler Lagrange equations. 

        a1 = f1(y1, y2, y3, y4);
        a2 = f2(y1, y2, y3, y4);
        a3 = f3(y1, y2, y3, y4);
        a4 = f4(y1, y2, y3, y4);
                       
        y3 = y3 + a3 * step;
        y1 = y1 + a1 * step;
        y2 = y2 + a2 * step;
        y4 = y4 + a4 * step;
        
    vDiff.t1 = y1;
    vDiff.t2 = y2;
    vDiff.t1D = y3;
    vDiff.t2D = y4;
 

}


function iterateRungeKutta(vDiff, step) {

    y1 = vDiff.t1;
    y2 = vDiff.t2;
    y3 = vDiff.t1D;
    y4 = vDiff.t2D;
    
        a1 = f1(y1, y2, y3, y4);
        a2 = f2(y1, y2, y3, y4);
        a3 = f3(y1, y2, y3, y4);
        a4 = f4(y1, y2, y3, y4);

        b1 = f1(y1 + step / 2 * a1, y2 + step / 2 * a2, y3 + step / 2 * a3, y4 + step / 2 * a4);
        b2 = f2(y1 + step / 2 * a1, y2 + step / 2 * a2, y3 + step / 2 * a3, y4 + step / 2 * a4);
        b3 = f3(y1 + step / 2 * a1, y2 + step / 2 * a2, y3 + step / 2 * a3, y4 + step / 2 * a4);
        b4 = f4(y1 + step / 2 * a1, y2 + step / 2 * a2, y3 + step / 2 * a3, y4 + step / 2 * a4);

        c1 = f1(y1 + step / 2 * b1, y2 + step / 2 * b2, y3 + step / 2 * b3, y4 + step / 2 * b4);
        c2 = f2(y1 + step / 2 * b1, y2 + step / 2 * b2, y3 + step / 2 * b3, y4 + step / 2 * b4);
        c3 = f3(y1 + step / 2 * b1, y2 + step / 2 * b2, y3 + step / 2 * b3, y4 + step / 2 * b4);
        c4 = f4(y1 + step / 2 * b1, y2 + step / 2 * b2, y3 + step / 2 * b3, y4 + step / 2 * b4);

        d1 = f1(y1 + step * c1, y2 + step * c2, y3 + step * c3, y4 + step * c4);
        d2 = f2(y1 + step * c1, y2 + step * c2, y3 + step * c3, y4 + step * c4);
        d3 = f3(y1 + step * c1, y2 + step * c2, y3 + step * c3, y4 + step * c4);
        d4 = f4(y1 + step * c1, y2 + step * c2, y3 + step * c3, y4 + step * c4);

        y1 = y1 + step / 6 * (a1 + 2 * b1 + 2 * c1 + d1);
        y2 = y2 + step / 6 * (a2 + 2 * b2 + 2 * c2 + d2);
        y3 = y3 + step / 6 * (a3 + 2 * b3 + 2 * c3 + d3);
        y4 = y4 + step / 6 * (a4 + 2 * b4 + 2 * c4 + d4);
        

    vDiff.t1 = y1;
    vDiff.t2 = y2;
    vDiff.t1D = y3;
    vDiff.t2D = y4;
    
}


function f1(y1, y2, y3, y4) {
    return (y3);
}

function f2(y1, y2, y3, y4) {
    return (y4);
}

function f3(y1, y2, y3, y4) {
    a = l2;
    b = l1 * Math.cos(y1 - y2);
    c = -l1 * y3 * y3 * Math.sin(y1 - y2) + g * Math.sin(y2);

    m = m2 * l2 * Math.cos(y1 - y2);
    n = (m1 + m2) * l1;
    k = g * (m1 + m2) * Math.sin(y1) + m2 * l2 * y4 * y4 * Math.sin(y1 - y2);

    den = b * m - a * n;

    t1DD = (a * k - m * c) / den;

    return (t1DD);
}
function f4(y1, y2, y3, y4) {
    a = l2;
    b = l1 * Math.cos(y1 - y2);
    c = -l1 * y3 * y3 * Math.sin(y1 - y2) + g * Math.sin(y2);

    m = m2 * l2 * Math.cos(y1 - y2);
    n = (m1 + m2) * l1;
    k = g * (m1 + m2) * Math.sin(y1) + m2 * l2 * y4 * y4 * Math.sin(y1 - y2);

    den = b * m - a * n;

    t2DD = (n * c - b * k) / den;

    return (t2DD);
}


