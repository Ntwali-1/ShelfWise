import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class ProductGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('updatedProduct')
  handleUpdatedProduct(client: any, payload: any){
    return { event: 'updatedProduct', data: payload  };
  }
}