import AgoraRTM from 'agora-rtm-sdk'

export default ({ app }, inject) => {
  inject('agoraRTM', AgoraRTM)
}