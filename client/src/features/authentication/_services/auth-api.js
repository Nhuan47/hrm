import axios from '@/shared/services/axios-instance'

export async function signIn (cridentials) {
    try {
        const response = await axios.post('/auth/sign-in', cridentials)
        const { data } = response
        return data
    } catch (err) {
        throw `Login failed: ${err}`
    }
}

export async function signOut () {
    try {
        const response = await axios.get('/auth/sign-out')
        const { data } = response
        return data
    } catch (err) {
        throw `Logout failed: ${err}`
    }
}
