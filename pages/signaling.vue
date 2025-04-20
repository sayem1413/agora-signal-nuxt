<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Agora RTM Signaling</h1>

    <div class="mb-2">
      <p><strong>UID:</strong> {{ uid }}</p>
      <p>
        <strong>Connection Status:</strong>
        <span :class="isConnected ? 'text-green-600' : 'text-red-600'">
          {{ isConnected ? 'Connected ✅' : 'Disconnected ❌' }}
        </span>
      </p>
    </div>

    <div class="mb-4">
      <input
        v-model="message"
        type="text"
        placeholder="Type message"
        class="border p-2 w-full rounded"
      />
    </div>

    <button
      @click="sendMessageToChannel"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Send Message
    </button>

    <div class="mt-4">
      <h2 class="font-semibold">Messages:</h2>
      <ul class="list-disc list-inside">
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import AgoraRTM from 'agora-rtm-sdk'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()

const uid = ref('')
const message = ref('')
const messages = ref([])
const isConnected = ref(false)

const client = ref(null)
const channel = ref('')

async function setupRTM() {
  
  const {
    $axios,
  } = useNuxtApp()
  
  const response = await $axios.get('/agora-rtm-data');

  const { rtm_token } = response.data.data;

  console.log(response, rtm_token, uid.value, channel.value);


  uid.value = String('654654687');
  channel.value = 'channel654654687';

  client.value = AgoraRTM.createInstance(config.public.AGORA_SDK_APP_ID)

  console.log(
    'client.value =============== ',
    client.value,
    'uid.value =============== ',
    uid.value,
  );
  

  client.value.on('ConnectionStateChanged', (state, reason) => {
    console.log(`[RTM] Connection changed: ${state}, Reason: ${reason}`)
    isConnected.value = state === 'CONNECTED'
  })

  console.log('isConnected.value === ', isConnected.value);
  console.log('uid.value === ', typeof uid.value);
  console.log('uid.value.toString() === ', typeof uid.value.toString());
  

  await client.value.login({ token: rtm_token, uid: uid.value.toString() })
  console.log('[RTM] Logged in with UID:', uid.value)

  // Join channel
  channel.value = client.value.createChannel(channel)

  channel.value.on('ChannelMessage', (messageData, senderId) => {
    const text = `[${senderId}]: ${messageData.text}`
    console.log('[RTM] New message:', text)
    messages.value.push(text)
  })

  await channel.value.join()
  console.log(`[RTM] Joined channel: ${channel}`)
}

async function sendMessageToChannel() {
  if (!channel.value || !message.value) return
  await channel.value.sendMessage({ text: message.value })
  messages.value.push(`[Me]: ${message.value}`)
  console.log(message.value);
  
  message.value = ''
}

onMounted(() => {
  setupRTM()
})
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>