import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import * as L from 'leaflet';
import { DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [NgForOf,DatePipe],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  private map!: L.Map;
  private userMarkers = new Map<string, L.Marker>();
  public mySocketId = '';
  public userName = 'Anonymous';
  public userCount: number = 0;

  // ✅ List of all connected users
 public connectedUsers: { id: string; name: string; timestamp?: string }[] = [];


  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.userName = prompt("Enter your name") || "Anonymous";

    this.socketService.getMyId().subscribe(id => {
      this.mySocketId = id;
    });

    this.socketService.getUserCount().subscribe(count => {
      this.userCount = count;
    });

    this.socketService.getAllUsers().subscribe(users => {
      this.connectedUsers = users;
    });

    this.fixLeafletIcons();
    this.initMap();

    this.socketService.onLocationUpdate().subscribe((data) => {
      this.updateMarker(data.id, data.coords.lat, data.coords.lng, data.name);
    });

    this.socketService.onUserDisconnected().subscribe((id) => {
      this.removeMarker(id);
    });
  }

  private fixLeafletIcons(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  startTracking(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.map.setView([coords.lat, coords.lng], 15);
          this.updateMarker(this.mySocketId, coords.lat, coords.lng, this.userName);
          this.socketService.sendLocation({ coords, name: this.userName });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation not supported');
    }
  }

  private updateMarker(id: string, lat: number, lng: number, name: string): void {
    const existing = this.userMarkers.get(id);

    const isMe = id === this.mySocketId;
    const customIcon = L.icon({
      iconUrl: isMe ? 'assets/leaflet/blue-icon.png' : 'assets/leaflet/red-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const popupContent = `
      <b>👤 ${name}</b><br>
      🆔 ${id}<br>
      📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}
    `;

    if (existing) {
      existing.setLatLng([lat, lng]);
      existing.setPopupContent(popupContent);
    } else {
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      marker.bindPopup(popupContent);
      marker.bindTooltip(name, { direction: 'top' });
      this.userMarkers.set(id, marker);
    }
  }

  private removeMarker(id: string): void {
    const marker = this.userMarkers.get(id);
    if (marker) {
      this.map.removeLayer(marker);
      this.userMarkers.delete(id);
    }

    // Optional: remove from connectedUsers list manually
    this.connectedUsers = this.connectedUsers.filter(user => user.id !== id);
  }

  disconnectUser(): void {
   if (this.map) {
    this.map.remove(); // removes the map from view
  }

  this.socketService.disconnect(); // disconnects from socket
 }

}
