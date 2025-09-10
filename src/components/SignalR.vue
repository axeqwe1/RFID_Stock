<script setup lang="ts">
import { startRfid, stopRfid } from "@/lib/api/RFID";
import {
  createSignalRConnection,
  getSignalRConnection,
} from "@/services/signalRService";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { ref, onMounted, onBeforeUnmount } from "vue";

const connection = ref<HubConnection | null>(null);
const receivedMessages = ref<{ message: string[] }>();
const listData = ref<string[]>([]);
onMounted(async () => {
  createSignalRConnection(import.meta.env.VITE_HUB_URL);
  connection.value = getSignalRConnection();
  if (connection.value) {
    connection.value.on("ReceiveRFIDUpdate", (message) => {
      console.log(message);
      receivedMessages.value?.message.push(message);
      if (message == "NotConnect") {
        stopRfid();
      }
    });
    connection.value.on("ReceiveRFIDData", (message) => {
      console.log(message);
      listData.value.push(message);
      listData.value = [...new Set(listData.value)];
    });
    try {
      await connection.value.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  } else {
  }
});

onBeforeUnmount(async () => {
  if (connection.value) {
    await connection.value.stop();
  }
});

const sendMessage = async () => {
  await startRfid();
};
const stopRfidw = async () => {
  await stopRfid();
};
</script>

<template>
  <div>
    <div class="flex flex-row gap-2">
      <button class="btn btn-primary" @click="sendMessage">START</button>
      <button class="btn btn-error" @click="stopRfidw">STOP</button>
    </div>
    Total : {{ listData.length }}
    <ul>
      <li v-for="(msg, index) in listData" :key="index">
        {{ msg }}
      </li>
    </ul>
  </div>
</template>
