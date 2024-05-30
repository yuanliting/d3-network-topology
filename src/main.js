import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入 SvgIcon 组件
import SvgIcon from '@/components/SvgIcon'
import './icons'

Vue.config.productionTip = false

Vue.use(ElementUI); 
// 将 SvgIcon 组件注册为全局组件
Vue.component('svg-icon', SvgIcon)

new Vue({
  render: h => h(App),
}).$mount('#app')
