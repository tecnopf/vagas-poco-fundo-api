export interface ISseService {
  connectUser(userId: number, res: any): void;
  connectEstablishment(establishmentId: number, res: any): void;

  emitToUser(userId: number, data: any): void;
  emitToEstablishment(establishmentId: number, data: any): void;

  disconnect(res: any): void;
}
