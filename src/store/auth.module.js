import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
import { LOGIN, LOGOUT, CHECK_AUTH } from './actions.type'
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from './mutations.type'

const state = {
  errors: null,
  user: {},
  userId: null,
  isAuthenticated: !!JwtService.getToken(),
  agreement: false,
  location: null,
  back: false,
  invalidId: null,
  isPreview: null,
  isNew: null,
  fmcAction: null,
  inviteId: null
}

const getters = {
  currentUser(state) {
    return state.user
  },
  userId(state) {
    return state.userId
  },
  isAuthenticated(state) {
    return state.isAuthenticated
  },
  isPreview(state) {
    return state.isPreview
  },
  agreement(state) {
    return state.agreement
  },
  location(state) {
    return state.location
  },
  back(state) {
    return state.back
  },
  invalidUser(state) {
    return state.invalidId
  },
  isNew() {
    return state.isNew
  },
  fmcAction() {
    return state.fmcAction
  },
  inviteId(state) {
    return state.inviteId
  }
}

const actions = {
  [LOGIN](context) {
    console.log('LOGIN! get Token!');
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
       ApiService.post('/auth/token')
        .then(({ data }) => {
          // console.log('api /auth/token data :'+JSON.stringify(data))
        
          context.commit(SET_AUTH, data)
          if(data.terms_agree_yn == 'Y') {
            context.commit('setAgreement', true)
            // JwtService.saveInfo('Agreement',true)
            // state.agreement = true
          } else {
            context.commit('setAgreement', false)
            // JwtService.saveInfo('Agreement',false)
            // state.agreement = false
          }
          resolve()
        })
        .catch(({ response }) => {
          console.log('response:'+JSON.stringify(response))
          context.commit(SET_ERROR, response)
          var res = '' 
          if(response) res = response.data
          reject(res)
      })
    })
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH)
  },
  [CHECK_AUTH](context) {
    console.log('CHECK_AUTH!!');
    if (JwtService.getToken()) {
       ApiService.setHeader()
      ApiService.post('/auth/token')
        .then(({ data }) => {
          // console.log('api /auth/token data :'+JSON.stringify(data))
          context.commit(SET_AUTH, data)
          if(data.terms_agree_yn == 'Y') {
            context.commit('setAgreement', true)
          } else {
            context.commit('setAgreement', false)
          }
          resolve()
          
          // if(JwtService.getInfo('Agreement')) state.agreement = true
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response)
        })
    } else {
      console.log('getToken else!!');
      context.commit(PURGE_AUTH)
    }
  }
}

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error
    if(error && error.data.errors == 'secession member') state.invalidId = error.data.Id
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true
    state.user = user
    state.userId = user.id
    state.errors = {}
    JwtService.saveToken(state.user.token)
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false
    state.user = {}
    state.userId = null
    state.errors = {}
    state.agreement = false
    JwtService.removeInfo('Agreement')
    JwtService.destroyToken()
  },
  setAgreement(state, value) {
    console.log('setAgreement value : ' + value);
    JwtService.saveInfo('Agreement', value)
    state.agreement = value
  },
  getFmcAction(){
    state.fmcAction = JwtService.getInfo('fmcAction')
  },
  clearFmcAction(){
    JwtService.removeInfo('fmcAction')
    state.fmcAction = null
  },
  isBack(state) {
    state.back = true
  },
  backOff(state) {
    state.back = false
  },
  setLocation(state, location) {
    state.location = location
  },
  setPreview(state){
    state.isPreview = state.isPreview != true ? true : false
  },
  setIsnew(state,data){
    state.isNew = data
  },
  setInviteId(state, id){
    JwtService.saveInfo('inviteId', id)
    state.inviteId = id
  },
  getInviteId(state){
    state.inviteId = JwtService.getInfo('inviteId')
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
