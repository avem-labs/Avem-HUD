//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
//
//  >>  canvas.js
//  >>  Created by Jack, November 8, 2015
//  >>  ...............
//
//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
var ram = [];
var $screen = $("#screen");
var screen = $screen.get(0);
var cxt = screen.getContext("2d");
$(() => {
    setInterval(loop, 10);
});
function loop() {
    cxt.fillStyle = "#333333";
    cxt.fillRect(0, 0, 600, 600);
    if (ram.length<100) {
        var point = new particle(200 , 300);
        ram.push(point);
    }
    for(coun = 0; coun < ram.length; coun++) {
        ram[coun].re(cxt);
        ram[coun].update();
    }
}
function particle(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = Math.random()*4;
    this.Vy = -2;
    this.Vx = Math.random()*2+2;
    this.re = (c) => {
        c.fillStyle = "rgba(255, 255, 255, 0.43)";
        c.beginPath();
        c.arc(this.xPos, this.yPos, this.zPos, 0, Math.PI*2, true);
        c.closePath();
        c.fill();
    }
    this.update = () => {
        this.xPos += this.Vx;
        this.yPos += this.Vy;
        this.Vy += 0.098;// g = dv/dt
        if((this.yPos > 600-this.zPos/2)||(this.yPos < 0)) {this.Vy = -this.Vy*0.9}
        if((this.xPos > 600-this.zPos/2)||(this.xPos < 0)) {this.Vx = -this.Vx*0.9}
    }
}
