import { WebSocket, RawData } from 'ws';
import { KrakenClientRequest } from '../dto/kraken-wss.dto';

export default interface IKrakenSocket {
  ws: WebSocket;
  sendRequest: (request: KrakenClientRequest) => Promise<void>;
  onOpen: () => void;
  onMessage: (data: RawData) => void;
  onError: (error?: Error) => void;
  onClose: () => void;
}
