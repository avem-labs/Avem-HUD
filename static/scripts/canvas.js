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

		// red: "#CD7186",
		red: "#D15563",

		yellow: "#E6DB74",
		blue: "#66D9EF",
		pink: "#E9CEBF",
		// pink: "#F92672",
		purple: "#AE81FF",
		brown: "#75715E",
		orange: "#F1895A",
		light_orange: "#FFD569",
		green: "#A6E22E",
		sea_green: "#529B2F"
	};
	this.font = "custom-play";
	this.num_font = "custom-dig";

	this.aimLenght = 180;

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
		this.addLabel(0, 0, m1*1.0);
		cxt.translate(-100, 16);

		this.addLabel(0, 0, "PWM CH2");
		cxt.translate(100, 0);
		this.addLabel(0, 0, m2*1.0);
		cxt.translate(-100, 16);

		this.addThrottle(380, 140, m2);
		this.addThrottle(-380, 140, m1);

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

	this.addThrottle = (x, y, v) => {
		let p = (v - 1620) / 1980;
		let cxt				= this.cxt;
		let radiusOutside	= 90;
		let radiusInside	= 70;
		let angle			= 5;
		cxt.save();
		cxt.translate(x, y);
		cxt.font = "40px "+this.num_font;
		cxt.fillStyle = p > 0.8 ? this.theme.red:this.theme.light_blue;
		cxt.fillText(v*1.0, -35, 0);

		cxt.lineWidth = 4;
		cxt.beginPath();
		for (let i = 0; i <= (180/angle)*p; i++) {
			cxt.moveTo(-radiusInside, 0);
			cxt.lineTo(-radiusOutside, 0);
			cxt.rotate(angle*Math.PI/180);
		}
		cxt.strokeStyle = this.theme.pink;
		cxt.stroke();
		cxt.beginPath();
		for (let i = 0; i <= (180/angle)*(1-p); i++) {
			cxt.moveTo(-radiusInside, 0);
			cxt.lineTo(-radiusOutside, 0);
			cxt.rotate(angle*Math.PI/180);
		}
		cxt.strokeStyle = this.theme.dark_gray;
		cxt.stroke();
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
		cxt.lineTo(-270, 0);
		cxt.moveTo(space/2, 0);
		cxt.lineTo(270, 0);
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

		// top
		cxt.moveTo(0, -20);
		cxt.lineTo(0, -20-delta);

		// bottom
		cxt.moveTo(0, 20);
		cxt.lineTo(0, 20+delta);

		cxt.stroke();

		this.drawRuler(mainSpot, delta);
	};

	this.drawRuler = (x, y) => {
		let cxt = this.cxt;
		let angle = g__pitch

		// Ruler
		let x_offset = this.aimLenght+100;
		let unitLength = 4;
		let space = unitLength;
		let item_width = 20;
		let item_height = 1;
		let fontSize = 22;
		let label_cap = item_width*2.3;


		cxt.save();
		cxt.translate(x_offset, 0);
		cxt.beginPath();
		cxt.moveTo(item_width*1.5, 0);
		cxt.lineTo(item_width*1.5+fontSize*.5, fontSize*.5);
		cxt.lineTo(item_width*1.5+fontSize*2.8, fontSize*.5);
		cxt.moveTo(item_width*1.5, 0);
		cxt.lineTo(item_width*1.5+fontSize*.5, -fontSize*.5);
		cxt.lineTo(item_width*1.5+fontSize*2.8, -fontSize*.5);
		cxt.lineTo(item_width*1.5+fontSize*2.8, fontSize*.5);

		cxt.strokeStyle = this.theme.light_blue;
		cxt.lineWidth = 3;
		cxt.stroke();
		cxt.lineWidth = 1;

		cxt.font = fontSize+"px "+this.font;
		cxt.fillStyle = this.theme.orange;
		cxt.fillText(Math.round(angle), label_cap, fontSize*0.3);

		cxt.translate(0, (angle-180)*unitLength);
		cxt.font = fontSize*.5+"px "+this.font;

		for(let d = -180; d<=180; d++) {
			if(d>=-45-angle && d<=45-angle) {
				if(!(d%10)) {
					cxt.moveTo(0, 0);
					cxt.lineTo(item_width, 0);
					if((-d > Math.round(angle)+3) || (-d <Math.round(angle)-3)) {
						cxt.fillText(-d, label_cap*.6, fontSize*0.3);
					}

				} else if(!(d%5)) {
					cxt.moveTo(0, 0);
					cxt.lineTo(item_width*.6, 0);
				} else {
					cxt.moveTo(0, 0);
					cxt.lineTo(item_width*.4, 0);
				}
			}
			cxt.translate(0, space);

		}
		cxt.strokeStyle = this.theme.light_blue;
		cxt.stroke();
		cxt.restore();
	};
	this.drawRulerOfRoll = (offset) => {
		// graphic ruler of angle
		let scale = 2;
		let split = 2; // Angle

		let rulerStart = this.aimLenght/2*scale;
		let rulerEnd = rulerStart+20;
		let cxt = this.cxt;
		let fontSize = 18;
		let label_cap = 5;
		cxt.save();
		cxt.rotate(offset*Math.PI/180);
		cxt.beginPath();
		for(let angle = 0; angle < 360/split; angle++) {
			let val = angle>180/split?(angle-360/split)*split:angle*split;
			if(((val>=-45-offset) && (val<=45-offset)) || ((angle*split>=180-45-offset) && (angle*split<=180+45-offset))) {

				cxt.moveTo(rulerEnd, 0);
				// cxt.lineTo((angle%(30/split))?rulerStart:rulerStart-10, 0);
				let delta = Math.abs((angle*split%10-5)/10);
				cxt.lineTo(rulerStart+80*Math.pow(Math.cos(delta+1),2), 0);

				if(!(angle%(30/split))) {
					cxt.fillStyle = this.theme.light_orange;
					cxt.font = fontSize+"px "+this.font;
					cxt.fillText(val, rulerEnd+label_cap, fontSize/2);
				}
			}
			cxt.rotate(split*Math.PI/180);
		}
		cxt.strokeStyle = this.theme.light_blue;
		cxt.stroke();
		cxt.restore();
	};
};
