//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
//
//  >>  canvas.js
//  >>  Created by Jack, November 8, 2015
//  >>  ...............
//
//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
let HUD = new dashboard(".screen");

$(() => {
	setInterval(UnitTest, 100);

	// if (window.DeviceMotionEvent) {
	// 	alert("Ok");
	// }

	// window.addEventListener('deviceorientation', (e)=>{
	// 	let pitch = -e.gamma;
	// 	let roll = -e.beta;
	// 	let yaw = -e.alpha;
	// 	g__pitch = pitch;
	// 	g__roll = roll;
	// 	g__yaw = yaw;
	// 	if (pitch < 0)
	// 		roll = -180 - roll;
	// $.getJSON('api/status', (json) => {
	// 	g__pitch = json.Pitch;
	// 	g__roll = json.Roll;
	// 	g__yaw = json.Yaw;
	// 	if (pitch < 0)
	// 		roll = -180 - roll;
	// })
	// 	// $(".label").eq(0).text(Math.round(pitch));
	// 	// $(".label").eq(1).text(Math.round(roll));
	// 	HUD.fresh(pitch, roll, yaw);
	// }, false);
	// oop.fresh(0, 0, 0);
	// oop.test();
	// aka.test();
});
function UnitTest() {
	let pitch, roll, yaw;
	$.getJSON('api/status', (json) => {
		console.log(json);
		pitch = json.Pitch;
		roll = json.Roll;
		yaw = json.Yaw;

		motor1 = json.Motor_1;
		motor2 = json.Motor_2;

		g__pitch = pitch;
		g__roll = roll;
		g__yaw = yaw;
		// if (g__pitch < 0)
		// 	g__roll = -180 - g__roll;
	})

	HUD.fresh(g__pitch, g__roll, g__yaw, motor1, motor2);
}

function dashboard(component) {
	this.theme = {
		color: "#3cc7e8",
		light_blue: "#24D7DF",
		bgColor: "#080B0E",
		ghost_white: "#F8F8F0",
		light_ghost_white: "#F8F8F2",
		light_gray: "#CCC",
		gray: "#888",
		brown_gray: "#49483E",
		dark_gray: "#282828",

		yellow: "#E6DB74",
		blue: "#66D9EF",
		pink: "#F92672",
		purple: "#AE81FF",
		brown: "#75715E",
		orange: "#F1895A",
		light_orange: "#FFD569",
		green: "#A6E22E",
		sea_green: "#529B2F"
	};
	this.font = "custom-play";

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

	this.fresh = (Pitch, Roll, Yaw, left, right) => {
		let cxt = this.cxt;


		cxt.rotate(0);
		//	Fill background
		cxt.fillStyle = this.theme.bgColor;
		cxt.fillRect(-this.width/2, -this.height/2, this.width, this.height);

		this.filter();
		this.displayInformation(Pitch, Roll, Yaw, left, right);

		this.drawRulerOfRoll(Roll);
		this.drawAim();
		this.drawSkyline(Roll, Pitch);
	};

	this.filter = () => {
		let cxt = this.cxt;
		let gap = cxt.lineWidth;
		cxt.save();
		cxt.translate(-this.width/2, -this.height/2);
		cxt.beginPath();

		for (let i = 0; i < this.height; i+=gap*6) {
			cxt.moveTo(0, i);
			cxt.lineTo(this.width, i);
		}
		cxt.strokeStyle = "#262626";
		cxt.stroke();
		cxt.restore();
	}

	this.displayInformation = (p, r, y, m1, m2) => {
		let cxt = this.cxt;
		cxt.save();

		cxt.translate(5, 30);
		this.addTitle(0, 0, "DEBUG MESSAGE");
		cxt.translate(0, 30);

		this.addLabel(0, 0, "PITCH");
		cxt.translate(100, 0);
		this.addLabel(0, 0, p);
		cxt.translate(-100, 16);

		this.addLabel(0, 0, "ROLL");
		cxt.translate(100, 0);
		this.addLabel(0, 0, r);
		cxt.translate(-100, 16);

		this.addLabel(0, 0, "YAW");
		cxt.translate(100, 0);
		this.addLabel(0, 0, y);
		cxt.translate(-100, 16);

		cxt.translate(0, 30);
		this.addTitle(0, 0, "MOTOR SPEED");
		cxt.translate(0, 30);

		this.addLabel(0, 0, "PWM CH1");
		cxt.translate(100, 0);
		this.addLabel(0, 0, m1);
		cxt.translate(-100, 16);

		this.addLabel(0, 0, "PWM CH2");
		cxt.translate(100, 0);
		this.addLabel(0, 0, m2);
		cxt.translate(-100, 16);


		cxt.restore();
	}

	this.addTitle = (x, y, str) => {
		let cxt = this.cxt;
		cxt.save();
		cxt.translate(-this.width/2, -this.height/2);
		cxt.font = "18px "+this.font;
		cxt.fillStyle = this.theme.light_ghost_white;
		cxt.fillText(str, x, y);
		cxt.translate(0, 10)
		// cxt.lineWidth = .5;
		cxt.beginPath();
		cxt.moveTo(x, y);
		cxt.lineTo(160, y);
		cxt.lineTo(160+10, y+10);
		cxt.strokeStyle = this.theme.orange;
		cxt.stroke();

		cxt.restore();
	}

	this.addLabel = (x, y, str) => {
		let cxt = this.cxt;
		cxt.save();
		cxt.translate(-this.width/2, -this.height/2);
		cxt.font = "14px "+this.font;
		cxt.fillStyle = this.theme.gray;
		cxt.fillText(str, x, y);
		cxt.restore();
	}


	this.drawSkyline = (r, p) => {
		let cxt = this.cxt;
		let space = this.aimLenght;
		// Handle translate
		cxt.save();
		cxt.translate(0, this.height/2 * ((p+this.pitchOffset)/90));
		cxt.rotate(r*Math.PI/180);

		cxt.beginPath();
		cxt.moveTo(-space/2, 0);
		cxt.lineTo(-1000, 0);
		cxt.moveTo(space/2, 0);
		cxt.lineTo(1000, 0);
		cxt.strokeStyle = this.theme.color;
		cxt.stroke();

		cxt.restore();
	};

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

		this.drawRuler(mainSpot, delta);
	};

	this.drawRuler = (x, y) => {
		let cxt = this.cxt;
		let angle = g__pitch
		cxt.font = y*2+"px "+this.font;
		cxt.fillStyle = this.theme.color;
		cxt.fillText(Math.round(angle), x+y, y-2);

		// Ruler
		let x_offset = this.aimLenght/2*.7;
		let unitLength = 8;
		let space = unitLength;
		let item_width = 20;
		let item_height = 1;
		let fontSize = 12;
		let label_cap = 5;

		cxt.save();
		cxt.translate(x_offset, angle*unitLength);
		for(let d = 0; d <180; d++) {
			if(!(d%10)) {
				// line
				cxt.fillStyle = "rgba(255, 255, 255, 1)";
				cxt.fillRect(-item_width/2, 0, item_width, item_height);
				// label
				cxt.fillStyle = this.theme.orange;
				cxt.font = fontSize+"px "+this.font
				cxt.fillText(-d, -item_width*2, fontSize/2);
				cxt.translate(0, space);
			} else {
				if(!(d%5)) {
					cxt.fillStyle = "rgba(255, 255, 255, 1)";
					cxt.fillRect(-item_width/2/2, 0, item_width/2, item_height);
					cxt.translate(0, space);

				} else {
					cxt.fillStyle = "rgba(255, 255, 255, .3)"
					cxt.beginPath();
					cxt.arc(0, 0, item_height, 0, 2*Math.PI);
					cxt.fill();
					cxt.translate(0, space);
				}
			}
		}
		cxt.restore();
		// Up
		cxt.save();
		cxt.translate(x_offset, angle*unitLength);
		for(let d = 0; d >-180; d--) {
			if(!(d%10)) {
				// line
				cxt.fillStyle = "rgba(255, 255, 255, 1)";
				cxt.fillRect(-item_width/2, 0, item_width, item_height);
				// label
				cxt.fillStyle = this.theme.orange;
				cxt.font = fontSize+"px "+this.font
				cxt.fillText(-d, -item_width*2, fontSize/2);
				cxt.translate(0, -space);
			} else {
				if(!(d%5)) {
					cxt.fillStyle = "rgba(255, 255, 255, 1)";
					cxt.fillRect(-item_width/2/2, 0, item_width/2, item_height);
					cxt.translate(0, -space);

				} else {
					cxt.fillStyle = "rgba(255, 255, 255, .3)"
					cxt.beginPath();
					cxt.arc(0, 0, item_height, 0, 2*Math.PI);
					cxt.fill();
					cxt.translate(0, -space);
				}
			}
		}
		cxt.restore();
	};
	this.drawRulerOfRoll = (offset) => {
		// graphic ruler of angle
		let scale = 2;
		let split = 2; // Angle

		let rulerStart = this.aimLenght/2*scale;
		let rulerEnd = rulerStart+20;
		let cxt = this.cxt;
		let fontSize = 12;
		let label_cap = 5;
		cxt.save();
		cxt.rotate(offset*Math.PI/180);
		cxt.beginPath();
		for(let angle = 0; angle < 360/split; angle++) {
			cxt.moveTo(rulerEnd, 0);
			// cxt.lineTo((angle%(30/split))?rulerStart:rulerStart-10, 0);
			let delta = Math.abs((angle*split%10-5)/10);
			cxt.lineTo(rulerStart+80*Math.pow(Math.cos(delta+1),2), 0);

			if(!(angle%(30/split))) {
				cxt.fillStyle = this.theme.light_orange;
				cxt.font = fontSize+"px "+this.font;
				cxt.fillText((angle>18)?(angle-360/split)*split:angle*split, rulerEnd+label_cap, fontSize/2);
			}
			cxt.rotate(split*Math.PI/180);
		}
		cxt.strokeStyle = this.theme.light_blue;
		cxt.stroke();
		cxt.restore();
	};
};
