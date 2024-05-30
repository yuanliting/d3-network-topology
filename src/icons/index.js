// 导入 Vue 框架
import Vue from 'vue'
// 导入 SvgIcon 组件
import SvgIcon from '@/components/SvgIcon'

// 将 SvgIcon 组件注册为全局组件
Vue.component('svg-icon', SvgIcon)

// 定义一个函数，用于引入所有 svg 文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
// 定义一个上下文，只包含 './svg' 目录下的以 '.svg' 结尾的文件
const req = require.context('./svg', false, /\.svg$/)
// 引入 svg 文件
requireAll(req)
