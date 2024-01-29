import Lag from "./tools/Lag";
import Game from "./components/Game";
import {EGameState} from "./enums/EGameData";
import UResPlayerUpdate from "./networking/udp/response/UResPlayerUpdate";

export default class GameProcessor {

	static GameList: Game[] = [];

	static update(game: Game){

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
				playerUpdate.characterId = pl.char.id;
				playerUpdate.characterHealth = pl.char.health;
				playerUpdate.characterUltimateCharge = pl.char.ultimateCharge;
				playerUpdate.characterMaxHealth = pl.char.healthMax;
				playerUpdate.characterMaxUltimateCharge = pl.char.ultimateChargeMax;
				playerUpdate.mouseX = pl.mouse.x;
				playerUpdate.mouseY = pl.mouse.y;

				u.send(playerUpdate);

			});

		})

	}

	static process(game: Game, deltaTime: number){

		if (game.state == EGameState.STARTING) {
			return;
		}

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
}