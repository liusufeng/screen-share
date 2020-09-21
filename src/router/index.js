import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home'
}, {
    path: '/home',
    name: 'Home',
    component: (resolve) => require(['@/views/home.vue'], resolve)
}, {
    path: '/share',
    name: 'Share',
    component: (resolve) => require(['@/views/share.vue'], resolve)
}, {
    path: '/play',
    name: 'Play',
    component: (resolve) => require(['@/views/play.vue'], resolve)
}]

const router = new VueRouter({
    routes
})

export default router
