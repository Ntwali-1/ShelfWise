import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway()
export class ProductGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('updateProduct')
  handleMessage(client: any, payload: any): string {
    return 'Message received';
  }

  notifyProductUpdate(product: any) {
    this.server.emit('productUpdated', product);
  }
}