import { WebSocket, RawData } from 'ws';
import IKrakenSocket from './interfaces/kraken-socket.interface';
import { KrakenClientRequest } from './dto/kraken-wss.dto';

export default class KrakenWSC implements IKrakenSocket {
  public ws = new WebSocket(this.baseUrl);

  private isConnected = false;

  onOpen: () => void;
  onMessage: (data: RawData) => void;
  onError: (error?: Error) => void;
  onClose: () => void;

  constructor(private baseUrl: string) {
    this.ws.on('open', () => {
      console.log('Connection with socket stabilished.');
      this.isConnected = true;
      this.onOpen();
    });
    this.ws.on('message', (data) => {
      this.onMessage(data);
    });
    this.ws.on('error', (error?: Error) => {
      console.log(`SocketError: ${error?.message}`);
      this.isConnected = false;
      this.onError(error);
    });
    this.ws.on('close', () => {
      console.log('Socket connections closed');
      this.isConnected = false;
      this.onClose();
    });
  }

  public sendRequest(request: KrakenClientRequest) {
    return new Promise<void>((resolve, reject) => {
      if (!this.isConnected) {
        reject('Socket is not connected');
        return;
      }
      this.ws.send(JSON.stringify(request), (error?: Error) => {
        if (error) {
          console.log(`SocketSendRequestError: ${error.message}`);
        } else resolve();
      });
    });
  }

  public get connected() {
    return this.isConnected;
  }
}
