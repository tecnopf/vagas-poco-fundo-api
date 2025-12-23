import { ISseService } from "./ISseService";

type SseConnection = {
  res: any;
};

export class SseService implements ISseService {
  private userConnections = new Map<number, Set<SseConnection>>();
  private establishmentConnections = new Map<number, Set<SseConnection>>();

  connectUser(userId: number, res: any) {
    this.setupHeaders(res);

    const connection = { res };

    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }

    this.userConnections.get(userId)!.add(connection);

    res.on("close", () => {
      this.userConnections.get(userId)?.delete(connection);
    });
  }

  connectEstablishment(establishmentId: number, res: any) {
    this.setupHeaders(res);

    const connection = { res };

    if (!this.establishmentConnections.has(establishmentId)) {
      this.establishmentConnections.set(establishmentId, new Set());
    }

    this.establishmentConnections.get(establishmentId)!.add(connection);

    res.on("close", () => {
      this.establishmentConnections.get(establishmentId)?.delete(connection);
    });
  }

  emitToUser(userId: number, data: any) {
    const connections = this.userConnections.get(userId);
    if (!connections) return;

    for (const { res } of connections) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  emitToEstablishment(establishmentId: number, data: any) {
    const connections = this.establishmentConnections.get(establishmentId);
    if (!connections) return;

    for (const { res } of connections) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  disconnect(res: any) {
    res.end();
  }

  private setupHeaders(res: any) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    res.write("\n");
  }
}
