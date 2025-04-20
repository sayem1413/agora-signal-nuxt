<template>
    <div>
      <h2>Agora Signaling Test</h2>
      <button @click="connectAsUser('123456')">Connect as 123456</button>
      <button @click="connectAsUser('654321')">Connect as 654321</button>
      <div v-if="message">Received: {{ message }}</div>
    </div>
  </template>
  
  <script>
  import AgoraRTM from 'agora-rtm-sdk'
  export default {
    data() {
      return {
        client: null,
        channel: null,
        message: '',
        currentUid: null,
      }
    },
    methods: {
      async connectAsUser(uid) {
        this.currentUid = uid
        const res = await fetch(`http://localhost:8000/api/agora/token/${uid}`)
        const { token, channelName, appID } = await res.json()

        console.log(token, channelName, appID);
        
  
        this.client = AgoraRTM.createInstance(appID)
  
        await this.client.login({ uid, token })
  
        this.channel = await this.client.createChannel(channelName)
        await this.channel.join()
  
        this.channel.on('ChannelMessage', ({ text }, senderId) => {
          this.message = `From ${senderId}: ${text}`
        })
  
        // Auto-send a message for demo
        const otherUser = uid === '123456' ? '654321' : '123456'
        setTimeout(() => {
          this.sendMessage(`Hello from ${uid}`)
        }, 2000)
      },
      sendMessage(msg) {
        if (this.channel) {
          this.channel.sendMessage({ text: msg })
        }
      }
    }
  }
  </script>
  