<template>
    <div id="image-list">
        <ul>
            <li v-for="item of imgList" :key="item.index" draggable="true" class="image-li">
                <img :src="item.src" :alt="`Image ${item.index}`" :id="`image${item.index}`" class="img-item">
                <div>{{ item.name }}</div>
            </li>
        </ul>
    </div>
</template>
<script>
import * as $ from 'jquery';
import * as d3 from 'd3';
import * as utils from '@/utils/index'
export default {
  name: 'ImgList',
  data() {
    return {
      imgList: [{
        index: 1,
        name: '交换机',
        src: '../../img/交换机.jpeg'
      },
      {
        index: 2,
        name: '手机',
        src: '../../img/手机.jpeg'
      },
      {
        index: 3,
        name: '服务器',
        src: '../../img/服务器.jpeg'
      },
      {
        index: 4,
        name: '网络',
        src: '../../img/网络.jpg'
      },
      {
        index: 5,
        name: '计算机',
        src: '../../img/计算机.jpg'
      }],
      imgMap: {
        '交换机': {
            index: 0,
            src: require('../../assets/img/交换机.jpeg')
        },
        '手机': {
            index: 1,
            src: require('../../assets/img/手机.jpeg')
        },
        '服务器': {
            index: 2,
            src: require('../../assets/img/服务器.jpeg')
        },
        '网络': {
            index: 3,
            src: require('../../assets/img/网络.jpg')
        },
        '计算机': {
            index: 4,
            src: require('../../assets/img/计算机.jpg')
        }
      },
    }
  },
  mounted() {
    setTimeout(() => {
        this.appendImg()
    }, 500);
  },
  methods: {
    appendImg() {
        // 创建SVG容器
        let container = d3.select("#svg1 g");
        const imageElement = document.getElementById('image-list');
        // 监听拖拽事件
        document.addEventListener('dragstart', function(event) {
            if (event.target.tagName === 'IMG') {
                event.dataTransfer.setData('text/plain', event.target.id);
            }
        });

        document.addEventListener('dragover', function(event) {
            event.preventDefault(); // 阻止默认行为
        });
        const that = this
        document.addEventListener('drop', function(event) {
            event.preventDefault(); // 阻止默认行为
            var id = event.dataTransfer.getData('text/plain');
            if(!id || id.includes('SVG')) {
              return
            }
            var img = document.getElementById(id);
            var x = event.clientX;
            var y = event.clientY;
            const name = decodeURIComponent(img.src.split('/')[img.src.split('/').length - 1])
            // 将图片添加到SVG中
            var imgType = that.imgMap[name.split('.')[0]].index;
            console.log(container)
            let nodeId = that.generateRandomString(10)
            let nNode = utils.newNode(nodeId, name.split('.')[0], imgType, 'img')
            nNode.x = x-220
            nNode.y = y-79
            that.$emit('addNode', nNode)
        });
    },
     /**
     * 生成一串随机字符串
     * @param {*} length 长度
     */
     generateRandomString(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  }
}
</script>
<style lang="scss" scoped>
ul{
    padding: 0;
    margin: 0;
}
.image-li {
    list-style: none;
    float: left;
    // margin-right: 10px;
    margin-bottom: 10px;
    width: 33.3%;
    box-sizing: border-box;
}
.img-item {
    width: 40px;
    height: 40px;
}
.image-li:nth-child(3n) {
    margin-right: 0px;
}

</style>