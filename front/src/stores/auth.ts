import { defineStore } from 'pinia'
import api from '../services/api'

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token')
  }),
  
  actions: {
    async register(username: string, email: string, password: string) {
      try {
        await api.post('/auth/register/', { username, email, password })
      } catch (error) {
        throw error
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login/', { email, password })
        this.token = response.data.token
        localStorage.setItem('token', response.data.token)
        await this.fetchUser()
      } catch (error) {
        throw error
      }
    },
    
    async fetchUser() {
      try {
        const response = await api.get('/auth/user/')
        this.user = response.data
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})