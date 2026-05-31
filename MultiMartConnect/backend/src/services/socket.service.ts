import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  tenantId: string;
  role: string;
}

export class SocketEngine {
  private static instance: SocketEngine;
  private io!: Server;

  private constructor() {}

  public static getInstance(): SocketEngine {
    if (!SocketEngine.instance) {
      SocketEngine.instance = new SocketEngine();
    }
    return SocketEngine.instance;
  }

  public initialize(httpServer: HttpServer): void {
    const originsConfig = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000'];

    this.io = new Server(httpServer, {
      cors: {
        origin: originsConfig,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
      if (!token) return next(new Error('Authentication failed: Missing token configuration.'));

      try {
        const cleanToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(cleanToken, process.env.JWT_ACCESS_SECRET || 'secret') as unknown as DecodedToken;
        socket.data = {
          userId: decoded.userId,
          tenantId: decoded.tenantId,
          role: decoded.role
        };
        next();
      } catch (err) {
        return next(new Error('Authentication failed: Secure signatures do not match.'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const { tenantId, userId, role } = socket.data;
      
      socket.join(`tenant:${tenantId}`);
      socket.join(`user:${userId}`);
      socket.join(`tenant:${tenantId}:role:${role}`);

      console.log(`WebSocket Established: Client ID ${userId} inside Workspace Channel ${tenantId}`);

      socket.on('disconnect', () => {
        console.log(`WebSocket Disconnected: Client Session ${userId}`);
      });
    });
  }

  public emitToTenant(tenantId: string, event: string, payload: any): void {
    this.io.to(`tenant:${tenantId}`).emit(event, payload);
  }

  public emitToUser(userId: string, event: string, payload: any): void {
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  public emitToRole(tenantId: string, role: string, event: string, payload: any): void {
    this.io.to(`tenant:${tenantId}:role:${role}`).emit(event, payload);
  }
}