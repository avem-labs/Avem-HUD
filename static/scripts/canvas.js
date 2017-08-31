//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
//
//  >>  canvas.js
//  >>  Created by Jack, November 8, 2015
//  >>  ...............
//
//=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
let HUD = new dashboard(".screen");

$(() => {
	setInterval(UnitTest, 10);

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

		g__pitch = pitch;
		g__roll = roll;
		g__yaw = yaw;
		// if (g__pitch < 0)
		// 	g__roll = -180 - g__roll;
	})

	HUD.fresh(g__pitch, g__roll, g__yaw);
}

function dashboard(component) {
	this.theme = {
		color: "#3cc7e8",
		bgColor: "#262626",
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
		orange: "#FD971F",
		light_orange: "#FFD569",
		green: "#A6E22E",
		sea_green: "#529B2F"
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

		this.drawRulerOfRoll(Roll);
		this.drawAim();
		this.drawSkyline(Roll, Pitch);
	};

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
		cxt.font = y*2+"px Menlo";
		cxt.fillStyle = this.theme.color;
		cxt.fillText(Math.round(angle), x+y, y-2);

		// Ruler
		let x_offset = this.aimLenght/2*.7;
		let unitLength = 8;
		let space = unitLength;
		let item_width = 20;
		let item_height = 1;
		let fontSize = 10;
		let label_cap = 5;

		cxt.save();
		cxt.translate(x_offset, angle*unitLength);
		for(let d = 0; d <180; d++) {
			if(!(d%10)) {
				// line
				cxt.fillStyle = "rgba(255, 255, 255, 1)";
				cxt.fillRect(-item_width/2, 0, item_width, item_height);
				// label
				cxt.fillStyle = this.theme.color;
				cxt.font = fontSize+"px Menlo"
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
				cxt.fillStyle = this.theme.color;
				cxt.font = fontSize+"px Menlo"
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
		let rulerStart = this.aimLenght/2*.3;
		let rulerEnd = rulerStart+20;
		let cxt = this.cxt;
		let fontSize = 10;
		let label_cap = 5;
		cxt.save();
		cxt.rotate(offset*Math.PI/180);
		cxt.beginPath();
		for(let angle = 0; angle < 36; angle++) {
			cxt.moveTo(rulerEnd, 0);
			cxt.lineTo((angle%3)?rulerStart:rulerStart-10, 0);

			if(!(angle%3)) {
				cxt.fillStyle = this.theme.orange;
				cxt.font = fontSize+"px Menlo"
				cxt.fillText((angle>18)?(angle-36)*10:angle*10, rulerEnd+label_cap, fontSize/2);
			}
			cxt.rotate(10*Math.PI/180);
		}
		cxt.strokeStyle = "rgba(255, 255, 255, .5)";
		cxt.stroke();
		cxt.restore();
	};
};
