// src/services/signalrService.ts
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function createSignalRConnection(url: string) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(url) // ตัวอย่าง: "https://localhost:5001/rfidHub"
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
}

export function getSignalRConnection() {
  return connection;
}
