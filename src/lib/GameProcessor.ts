import Lag from "./tools/Lag";
import Game from "./components/Game";
import UResPlayerUpdate from "./networking/udp/response/UResPlayerUpdate";
import Ping from "./tools/Ping";

export default class GameProcessor {

	static GameList: Game[] = [];
	static lastDelta = performance.now();

	static update(game: Game){

		if (!game.started) return;

	}

	static process(game: Game, deltaTime: number){

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