import Lag from "./tools/Lag";
import Game from "./components/Game";
import {dataSize} from "./Macros";
import EBufferType from "./enums/EBufferType";
import {TCPServerResponse} from "./enums/TCPPacketTypes";
import GMBuffer from "./tools/GMBuffer";
import {EGameState} from "./enums/EGameData";
import {UDPServerResponse} from "./enums/UDPPacketTypes";

export default class GameProcessor {

	static GameList: Game[] = [];

	static update(game: Game){

		game.players.forEach(u => {

			let bufferList : Buffer[] = [];
	
			game.players.forEach(pl=>{
	
				let comp = Lag.compensateClose(u.ping.ms);
	
				if (pl.speed < 1) comp = 0;
	
				let pred = Lag.predictPosition(pl.pos, pl.mov, comp);
	
				let buff = GMBuffer.allocate(dataSize);
				buff.write(UDPServerResponse.PLAYER_UPDATE, EBufferType.UInt8);
				buff.write(pl.id, EBufferType.UInt16);
				buff.write(pl.state.id, EBufferType.UInt8);
				buff.write(Math.round((pred.pos.x) * 100), EBufferType.SInt32);
				buff.write(Math.round((pl.state.on_ground ? pl.y : pred.pos.y) * 100), EBufferType.SInt32);
				buff.write(Math.round(pred.mov.x * 100), EBufferType.SInt32);
				buff.write(Math.round((pl.state.on_ground ? pl.my : pred.mov.y) * 100), EBufferType.SInt32);
				buff.write(pl.state.on_ground, EBufferType.UInt8);
				buff.write(pl.state.dir, EBufferType.SInt8);
				buff.write(pl.state.slide, EBufferType.UInt8);
				buff.write(pl.char.health, EBufferType.UInt16);
				buff.write(pl.char.ultimateCharge, EBufferType.UInt16);
				buff.write(pl.char.healthMax, EBufferType.UInt16);
				buff.write(pl.char.ultimateChargeMax, EBufferType.UInt16);
				buff.write(pl.char.id, EBufferType.UInt8);
				buff.write(Math.round(pl.mouse.x * 100), EBufferType.SInt32);
				buff.write(Math.round(pl.mouse.y * 100), EBufferType.SInt32);

				bufferList.push(buff.getBuffer());

			});
	
			let concatenatedBuffer = Buffer.concat(bufferList);
	
			u.TCPsocket.send(concatenatedBuffer);
	
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