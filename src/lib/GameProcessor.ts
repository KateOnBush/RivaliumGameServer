import Lag from "./tools/Lag";
import Game from "./components/Game";
import { dataSize, gravity as grav, gravityVec } from "./Macros";
import EBufferType from "./enums/EBufferType";
import { EServerResponse } from "./enums/EPacketTypes";
import GMBuffer from "./tools/GMBuffer";
import Vector2 from "./tools/vector/Vector2";

export default class GameProcessor {

	static update(game: Game){

		game.players.forEach(u => {

			let sendbuff : Buffer[] = [];
	
			game.players.forEach(pl=>{
	
				let comp = Lag.compensateClose(u.ping.ms);
	
				if (pl.speed < 1) comp = 0; 
	
				let pred = Lag.predictPosition(pl.pos, pl.mov, comp);
	
				let buff = GMBuffer.allocate(dataSize);
				buff.write(EServerResponse.PLAYER_UPDATE, EBufferType.UInt8);
				buff.write(pl.id, EBufferType.UInt16);
				buff.write((pred.pos.x)*100|0, EBufferType.SInt32);
				buff.write((pl.state.on_ground ? pl.y : pred.pos.y) *100|0, EBufferType.SInt32);
				buff.write(pred.mov.x*100|0, EBufferType.SInt32);
				buff.write((pl.state.on_ground ? pl.my : pred.mov.y)*100|0, EBufferType.SInt32);
				buff.write(pl.state.on_ground, EBufferType.UInt8);
				buff.write(pl.state.jump_prep*100, EBufferType.UInt8);
				buff.write(pl.state.wall_slide, EBufferType.UInt8);
				buff.write(pl.state.grappling, EBufferType.UInt8);
				buff.write(pl.state.grappled, EBufferType.UInt8);
				buff.write(pl.state.dir, EBufferType.SInt8);
				buff.write(pl.state.dash, EBufferType.UInt8);
				buff.write(pl.state.slide, EBufferType.UInt8);
				buff.write(pl.state.grounded, EBufferType.UInt8);
				buff.write(pl.state.slope, EBufferType.UInt8);
				buff.write(pl.char.health, EBufferType.UInt16);
				buff.write(pl.char.ultimatecharge, EBufferType.UInt16);
				buff.write(pl.char.healthmax, EBufferType.UInt16);
				buff.write(pl.char.ultimatechargemax, EBufferType.UInt16);
				buff.write(pl.char.id, EBufferType.UInt8);
				buff.write(pl.state.dead, EBufferType.UInt8);
				buff.write(pl.mouse.x, EBufferType.SInt32);
				buff.write(pl.mouse.y, EBufferType.SInt32);
	
				sendbuff.push(buff.getBuffer());
	
			})
	
			var sendbuff_c = Buffer.concat(sendbuff);
	
			u.socket.send(sendbuff_c);
	
		})

	}

	static process(game: Game, deltaTime: number){

		game.projectiles.forEach(projectile=>{

			if (projectile.collided) return;
			projectile.pos.add(Vector2.multiply(projectile.mov, deltaTime));
			projectile.mov.add(Vector2.multiply(gravityVec, deltaTime));

		})

	}
}