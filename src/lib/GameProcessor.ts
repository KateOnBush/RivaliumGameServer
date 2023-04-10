import Lag from "./tools/Lag";
import Game from "./components/Game";
import { dataSize, gravity as grav, gravityVec } from "../constants";
import { BType } from "./enums/EBufferValueType";
import { RESPONSE } from "./enums/EPacketTypes";
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
				buff.write(RESPONSE.PLAYER_UPDATE, BType.UInt8);
				buff.write(pl.id, BType.UInt16);
				buff.write((pred.pos.x)*100|0, BType.SInt32);
				buff.write((pl.state.on_ground ? pl.y : pred.pos.y) *100|0, BType.SInt32);
				buff.write(pred.mov.x*100|0, BType.SInt32);
				buff.write((pl.state.on_ground ? pl.my : pred.mov.y)*100|0, BType.SInt32);
				buff.write(pl.state.on_ground, BType.UInt8);
				buff.write(pl.state.jump_prep*100, BType.UInt8);
				buff.write(pl.state.wall_slide, BType.UInt8);
				buff.write(pl.state.grappling, BType.UInt8);
				buff.write(pl.state.grappled, BType.UInt8);
				buff.write(pl.state.dir, BType.SInt8);
				buff.write(pl.state.dash, BType.UInt8);
				buff.write(pl.state.slide, BType.UInt8);
				buff.write(pl.state.grounded, BType.UInt8);
				buff.write(pl.state.slope, BType.UInt8);
				buff.write(pl.char.health, BType.UInt16);
				buff.write(pl.char.ultimatecharge, BType.UInt16);
				buff.write(pl.char.healthmax, BType.UInt16);
				buff.write(pl.char.ultimatechargemax, BType.UInt16);
				buff.write(pl.char.id, BType.UInt8);
				buff.write(pl.state.dead, BType.UInt8);
				buff.write(pl.mouse.x, BType.SInt32);
				buff.write(pl.mouse.y, BType.SInt32);
	
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