import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // 👇 Live backend URL deployed on Vercel
    this.socket = io('https://angular-socket-location-tracker-n5t.vercel.app');
  }

  sendLocation(data: { coords: { lat: number; lng: number }; name: string }) {
    this.socket.emit('send-location', data);
  }

  onLocationUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('location-update', (data) => observer.next(data));
    });
  }

  getMyId(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('your-id', (id: string) => observer.next(id));
    });
  }

  onUserDisconnected(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('user-disconnected', (id: string) => observer.next(id));
    });
  }

  getUserCount(): Observable<number> {
    return new Observable((observer) => {
      this.socket.on('users-count', (count: number) => observer.next(count));
    });
  }

  getAllUsers(): Observable<{ id: string; name: string; timestamp?: string }[]> {
    return new Observable((observer) => {
      this.socket.on('users-list', (users) => observer.next(users));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
