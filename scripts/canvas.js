//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
//
//  >>  canvas.js
//  >>  Created by Jack, November 8, 2015
//  >>  ...............
//
//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
let HUD = new dashboard(".screen");

$(() => {
	// if (window.DeviceMotionEvent) {
	// 	alert("Ok");
	// }
	window.addEventListener('deviceorientation', (e)=>{
		let pitch = e.gamma;
		let roll = -e.beta;
		let yaw = -e.alpha;
		if (pitch > 0)
			roll = 180 - roll;
		$(".label").eq(0).text(Math.round(pitch));
		$(".label").eq(1).text(Math.round(roll));
		HUD.fresh(pitch, roll, yaw);
	}, false);
	// setInterval(UnitTest, 25);
	// oop.fresh(0, 0, 0);
	// oop.test();
	// aka.test();
});
let ang = 0;
function UnitTest() {
	HUD.fresh(0, ang, 0);
	ang++;
}

function dashboard(component) {
	this.theme = {
		color: "#3cc7e8",
		bgColor: "#262626",
	};

	this.aimLenght = 280;

	this.dom	 = $(component);
	this.height	 = this.dom.height();
	this.width	 = this.dom.width();
	this.cxt = this.dom.get(0).getContext("2d");
	// Set up origin
	this.cxt.translate(this.width/2, this.height/2);

	// Angle translate
	this.pitchOffset = 90;
	this.pitchLocation = "m";

	this.fresh = (Pitch, Roll, Yaw) => {
		let cxt = this.cxt;


		cxt.rotate(0);
		//	Fill background
		cxt.fillStyle = this.theme.bgColor;
		cxt.fillRect(-this.width/2, -this.height/2, this.width, this.height);


		this.drawAim();
		this.drawSkyline(Roll, Pitch);
	};

	this.drawSkyline = (r, p) => {
		// Handle translate

		let cxt = this.cxt;
		let space = this.aimLenght;
		cxt.save()
		cxt.translate(0, p);
		cxt.rotate(r*Math.PI/180);

		cxt.beginPath();
		cxt.moveTo(-space/2, 0);
		cxt.lineTo(-1000, 0);
		cxt.moveTo(space/2, 0);
		cxt.lineTo(1000, 0);
		cxt.strokeStyle = this.theme.color;
		cxt.stroke();

		cxt.restore();
	}

	this.drawAim = () => {
		let cxt = this.cxt;
		let delta = 8;
		let mainSpot = this.aimLenght/2-delta;

		cxt.strokeStyle = this.theme.color;

		// center
		cxt.beginPath();
		cxt.arc(0, 0, 20, 0, 2*Math.PI);
		cxt.stroke();

		// right
		cxt.moveTo(mainSpot, 0);
		cxt.lineTo(25, 0);

		cxt.moveTo(mainSpot, 0);
		cxt.lineTo(mainSpot+delta, delta);
		cxt.lineTo(this.aimLenght, delta);

		cxt.moveTo(mainSpot, 0);
		cxt.lineTo(mainSpot+delta, -delta);
		cxt.lineTo(this.aimLenght, -delta);

		// left
		cxt.moveTo(-mainSpot, 0);
		cxt.lineTo(-25, 0);

		cxt.moveTo(-mainSpot, 0);
		cxt.lineTo(-mainSpot-delta, delta);
		cxt.lineTo(-this.aimLenght, delta);

		cxt.moveTo(-mainSpot, 0);
		cxt.lineTo(-mainSpot-delta, -delta);
		cxt.lineTo(-this.aimLenght, -delta);

		cxt.stroke();
	}

	this.drawAimLine = (cxt, spot, delta) => {
		cxt.moveTo(spot, 0);
		cxt.lineTo(25, 0);

		cxt.moveTo(spot, 0);
		cxt.lineTo(spot+delta, delta);
		cxt.lineTo(this.aimLenght, delta);

		cxt.moveTo(spot, 0);
		cxt.lineTo(spot+delta, -delta);
		cxt.lineTo(this.aimLenght, -delta);

	}

}
// function loop() {
//     cxt.fillStyle = "#333333";
//     cxt.fillRect(0, 0, 600, 600);
//     if (ram.length<100) {
//         var point = new particle(200 , 300);
//         ram.push(point);
//     }
//     for(coun = 0; coun < ram.length; coun++) {
//         ram[coun].re(cxt);
//         ram[coun].update();
//     }
// }
// function particle(xPos, yPos) {
//     this.xPos = xPos;
//     this.yPos = yPos;
//     this.zPos = Math.random()*4;
//     this.Vy = -2;
//     this.Vx = Math.random()*2+2;
//     this.re = (c) => {
//         c.fillStyle = "rgba(255, 255, 255, 0.43)";
//         c.beginPath();
//         c.arc(this.xPos, this.yPos, this.zPos, 0, Math.PI*2, true);
//         c.closePath();
//         c.fill();
//     }
//     this.update = () => {
//         this.xPos += this.Vx;
//         this.yPos += this.Vy;
//         this.Vy += 0.098;// g = dv/dt
//         if((this.yPos > 600-this.zPos/2)||(this.yPos < 0)) {this.Vy = -this.Vy*0.9}
//         if((this.xPos > 600-this.zPos/2)||(this.xPos < 0)) {this.Vx = -this.Vx*0.9}
//     }
// }
