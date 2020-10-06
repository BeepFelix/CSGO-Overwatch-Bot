// This class name MUST be unique or it will override other results
module.exports = class AntiAim {
	constructor(parent, config) {
		this.parent = parent; // This is the object from "Demo.js"
		this.config = config;

		// Variables
		this.infractions = [];

		// Register events
		this.parent.demo.on("tickend", this.OnTickEnd.bind(this));
	}

	result() {
		/*
		This method is raan at the end when parsing of the demo has finished
		It should ALWAYS return an object like this:
		{
			aimbot: false, // True if this detector thought the player was aimbotting
			wallhack: false, // True if this detector thought the player was wallhacking
			speedhack: false, // True if this detector thought the player was using some kind of other cheat (Speedhack, Teleportation, Bunnyhop, etc)
			teamharm: false // True if this detector thought the player has shown anti-competitive behaviour (Griefing, Boosting Lobby, etc)
		}
		*/
		return {
			aimbot: false,
			wallhack: false,
			speedhack: this.infractions.length >= this.config.verdict.minAntiAim,
			teamharm: false
		};
	}

	resultRaw() {
		/*
		This method is ran at the end when parsing of the demo has finished
		It must return an array with the infractions the suspect received
		*/
		return this.infractions;
	}

	/******************
	 * Custom Methods *
	 ******************/
	OnTickEnd(tick) {
		if (!this.parent.suspectPlayer || !this.parent.suspectPlayer.isAlive || this.parent.demo.gameRules.isWarmup) {
			// Suspect left or is dead or warmup
			return;
		}
		const cheatAngle = 88.99;
		// Angles are hardcoded
		// Currently only one angle I have. 
		// ! Need more tests and more angles (?)
		// ? Note: If that method wouldn't work success for >= 30% of cheaters (with AA) we should delete this.
		const { pitch, yaw } = this.parent.suspectPlayer.eyeAngles;

		const lookAtDown = (value) => parseFloat(value.toFixed(2), 10) === cheatAngle;
		// const lookAtUp = (value) => parseFloat(value.toFixed(2), 10) === -88.99;
		// ? Note: Cheaters have AA what look at up but I didn't test it so I disable this check. I need more demos.


		if (!lookAtDown(pitch)) {
			// Player or Cheater did't look at floor (down)
			return;
		}

		this.infractions.push(
			{
				tick: tick,
				angles: { pitch, yaw },
				isLookAtDown: lookAtDown(pitch),
				// isLookAtUp: lookAtUp(eyeAngles.pitch)
			}
		);
	}
};
