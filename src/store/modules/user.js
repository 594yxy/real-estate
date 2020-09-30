import storage from 'store'
import {
  login,
  getInfo,
  logout
} from '@/api/login'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          console.log(res)
          if (res.code == 0) {
            const result = res.data
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            storage.set('nickName', result.user.name)
            localStorage.setItem('userId', result.user.userId)
            localStorage.setItem('mark', result.user.detail.roles[0].mark)
            commit('SET_TOKEN', result.token)
            resolve()
          } else {
            reject(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        let v_token = storage.get(ACCESS_TOKEN);
        let params = {
          type: 'MENU'
        };
        getInfo(params).then(res => {
          const result = res.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({
      commit,
      state
    }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove('nickName')
          localStorage.removeItem('userId')
          localStorage.removeItem('mark')
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          storage.remove('nickName')
          localStorage.removeItem('mark')
        })
      })
    }

  }
}

export default user