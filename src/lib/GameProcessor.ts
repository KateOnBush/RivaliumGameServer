import Lag from "./tools/Lag";
import Game from "./components/Game";
import UResPlayerUpdate from "./networking/udp/response/UResPlayerUpdate";
import Ping from "./tools/Ping";

export default class GameProcessor {

	static GameList: Game[] = [];
	static lastDelta = performance.now();

	static update(game: Game){

		if (!game.started) return;

		game.players.forEach(u => {
	
			game.players.forEach(pl=>{

				let playerUpdate = new UResPlayerUpdate();
	
				let comp = Lag.compensateClose(u.ping.ms);
				if (pl.speed < 1) comp = 0;
	
				let pred = Lag.predictPosition(pl.pos, pl.mov, comp);

				playerUpdate.playerId = pl.id;
				playerUpdate.stateId = pl.state.id;
				playerUpdate.x = pred.pos.x;
				playerUpdate.y = pred.pos.y;
				playerUpdate.movX = pred.mov.x;
				playerUpdate.movY = pred.mov.y;
				playerUpdate.onGround = pl.state.onGround;
				playerUpdate.direction = pl.state.orientation == 1 ? 1 : 0;
				playerUpdate.slide = pl.state.slide;
				playerUpdate.gemHolder = pl.gemHolder;
				playerUpdate.characterId = pl.character.id;
				playerUpdate.health = pl.health;
				playerUpdate.ultimateCharge = pl.ultimateCharge;
				playerUpdate.maxHealth = pl.maxHealth;
				playerUpdate.maxUltimateCharge = pl.maxUltimateCharge;
				playerUpdate.mouseX = pl.mouse.x;
				playerUpdate.mouseY = pl.mouse.y;
				playerUpdate.movementBoost = pl.boost;
				playerUpdate.ping = pl.ping.ms;
				playerUpdate.lethalityAndResistance = pl.lethality + pl.resistance * 11;
				playerUpdate.haste = pl.haste;

				u.send(playerUpdate);

			});

		})

	}

	static process(game: Game, deltaTime: number){

		if (!game.started) return;

		game.projectiles.forEach(projectile=>{

			if (projectile.collided) return;
			projectile.process(deltaTime);
			projectile.move(deltaTime);

		})

		game.entities.forEach(entity=>{
			entity.process(deltaTime);
		})

		game.players.forEach(player=>{
			player.process(deltaTime);
			//player.move(deltaTime);
		})

		game.explosions.forEach(explosion=>{
			explosion.process(deltaTime);
		})

	}

	static startUpdateLoop() {

		setInterval(() => {
			let dt = (performance.now() - this.lastDelta) * 60 / 1000;
			this.lastDelta = performance.now();
			for(const game of GameProcessor.GameList) {
				this.process(game, dt);
				this.update(game)
			}
		}, 1000/60|0);

	}

	static startPingLoop() {

		setInterval(()=>{
			this.GameList.forEach(game => Ping.ping(game.players));
		}, 1000);

	}

}