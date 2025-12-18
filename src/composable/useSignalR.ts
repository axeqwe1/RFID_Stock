import { ref, onMounted, onUnmounted } from "vue";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export function useSignalR(hubUrl: string) {
  const connection = ref<HubConnection | null>(null);
  const isConnected = ref(false);

  // สำหรับ Subscribe Event จากภายนอก
  const handlers: Record<string, Function[]> = {};

  const onEvent = (eventName: string, handler: Function) => {
    if (!handlers[eventName]) handlers[eventName] = [];
    handlers[eventName].push(handler);

    // ถ้าต่อเชื่อมแล้ว listener ต้องถูก apply ทันที
    if (connection.value) {
      connection.value.on(eventName, (msg) => handler(msg));
    }
  };

  const startConnection = async () => {
    if (connection.value?.state === "Connected") return;

    connection.value = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    // Apply listeners ให้ connection ใหม่
    Object.keys(handlers).forEach((eventName) => {
      handlers[eventName].forEach((fn) => {
        connection.value?.on(eventName, (msg) => fn(msg));
      });
    });

    try {
      await connection.value.start();
      console.log("SignalR Connected.");
      isConnected.value = true;
    } catch (err) {
      console.error("SignalR Error:", err);
      isConnected.value = false;
    }
  };

  const stopConnection = async () => {
    if (connection.value) {
      await connection.value.stop();
      isConnected.value = false;
    }
  };

  onUnmounted(() => {
    stopConnection();
  });

  return {
    connection,
    isConnected,
    startConnection,
    stopConnection,
    onEvent,
  };
}
