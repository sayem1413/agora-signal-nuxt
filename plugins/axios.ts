import axios from 'axios'

export default defineNuxtPlugin(()=> {
    const config = useRuntimeConfig()

    axios.defaults.baseURL = config.public.API_URL
    axios.defaults.withCredentials = false

    if (process.client) {
        axios.defaults.headers.common['Accept'] = 'application/json'
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    return {
        provide: {
            axios: axios,
        },
    }
})
