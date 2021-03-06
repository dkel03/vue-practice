import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import store from './store'
// view pages
import Home from './views/Home.vue'
// life
import Suggestion from './views/Life/suggestion.vue'
import SugDetail from './views/Life/suggestion_detail.vue'
import Map from './views/Life/map'
// operate
import Letter from './views/Operate/letter.vue'
import LetterDetail from './views/Operate/letter_detail.vue'
// manage
import User from './views/Manage/user.vue'
import Page from './views/Manage/page.vue'
import Company from './views/Manage/company.vue'
import Site from './views/Manage/site'
// extra
import UserInfo from './views/userInfo.vue'

Vue.use(Router)

Vue.prototype.$axios = axios
const apiRootPath = process.env.NODE_ENV !== 'production' ? 'https://nemv-stack.run.goorm.io/api/' : '/api/'
Vue.prototype.$apiRootPath = apiRootPath

axios.defaults.baseURL = apiRootPath // axios기본 요청 url 추가
axios.defaults.headers.common['Authorization'] = (localStorage.getItem('token') || 'inval')
// 기본적으로 axios 요청보낼때 header에 토큰 추가해서 보냄

axios.interceptors.request.use(function (config) {
  // axios 인터셉터 == 가로채는 놈, 보내기 받기전에 무언가 할 수 있음
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  const token = response.data.token
  // console.log(token)
  if (token) localStorage.setItem('token', token)
  return response
}, function (error) {
  console.log(error.response)
  switch (error.response.status) {
    case 400:
      console.log(error.response.data.msg)
      store.commit('pop', { msg: `잘못된 요청입니다(${error.response.status}:${error.response.data.msg})`, color: 'error' })
      break
    case 401:
      store.commit('delToken')
      store.commit('pop', { msg: `인증 오류입니다(${error.response.status}:${error.response.data.msg})`, color: 'error' })
      break
    case 403:
      store.commit('pop', { msg: `이용 권한이 없습니다(${error.response.status}:${error.response.data.msg})`, color: 'warning' })
      break
    default:
      store.commit('pop', { msg: `알수 없는 오류입니다(${error.response.status}:${error.response.data.msg})`, color: 'error' })
      break
  }
  return Promise.reject(error)
})

const pageCheck = (to, from, next) => {
  axios.post('resources/pages', { name: to.path.replace('/', '') })
  // 넘어가면서 json 객체를 반환해서 조건문 사용해주었음
    .then((r) => {
      if (!r.data.success) throw new Error(r.data.msg)
      next()
    })
    .catch((e) => {
      if (!e.response) store.commit('pop', { msg: e.message, color: 'warning' })
      next(false)
    })
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: pageCheck
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: UserInfo,
      beforeEnter: pageCheck
    },
    {
      path: '/suggestion',
      name: '건의사항',
      component: Suggestion,
      beforeEnter: pageCheck
    },
    {
      path: '/suggestion/detail/:suggestionId',
      name: '건의사항 상세',
      component: SugDetail
    },
    {
      path: '/map',
      name: '지도',
      component: Map,
      beforeEnter: pageCheck
    },
    {
      path: '/letter',
      name: '마음의 편지함',
      component: Letter,
      beforeEnter: pageCheck
    },
    {
      path: '/letter/detail/:letterId',
      name: '마음의 편지 상세',
      component: LetterDetail
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      beforeEnter: pageCheck
    },
    {
      path: '/company',
      name: 'company',
      component: Company,
      beforeEnter: pageCheck
    },
    {
      path: '/page',
      name: '페이지',
      component: Page,
      beforeEnter: pageCheck
    },
    {
      path: '/site',
      name: '사이트',
      component: Site,
      beforeEnter: pageCheck
    },
    {
      path: '/sign',
      name: '로그인',
      component: () => import('./views/sign')
    },
    {
      path: '/register',
      name: '회원가입',
      component: () => import('./views/register')
    },
    {
      path: '/block/:msg',
      name: '차단',
      component: () => import('./views/block')
    }
  ]
})
