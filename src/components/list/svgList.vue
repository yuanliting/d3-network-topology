<template>
    <div id="svg-list">
        <ul>
            <li v-for="item of svgList" :key="item.index" draggable="true" class="image-li">
                <img :src="item.src" :alt="`Image ${item.index}`" :id="`imageSVG${item.index}`" class="img-item">
                <!-- <el-avatar shape="square" :src="item.src" style="background: transparent;" :id="`image${item.index}`" class="img-item"></el-avatar> -->
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
      svgList: [{
        index: 0,
        name: '交换机',
        src: require('../../assets/svg/交换机.svg')
      },
      {
        index: 1,
        name: 'APP',
        src: require('../../assets/svg/APP.svg')
      },
      {
        index: 2,
        name: '服务器',
        src: require('../../assets/svg/服务器.svg')
      },
      {
        index: 3,
        name: '网络',
        src: require('../../assets/svg/网络.svg')
      },
      {
        index: 4,
        name: 'PC',
        src: require('../../assets/svg/PC.svg')
      },
      {
        index: 5,
        name: '云',
        src: require('../../assets/svg/云.svg')
      },
      {
        index: 6,
        name: '数据库',
        src: require('../../assets/svg/数据库.svg')
      },
      {
        index: 7,
        name: 'earth',
        src: require('../../assets/svg/earth.svg')
      },
      {
        index: 8,
        name: 'Docker',
        src: require('../../assets/svg/Docker.svg')
      },
      {
        index: 9,
        name: 'router',
        src: require('../../assets/svg/router.svg')
      },
      {
        index: 10,
        name: 'switch',
        src: require('../../assets/svg/switch.svg')
      },
      {
        index: 11,
        name: 'building',
        src: require('../../assets/svg/building.svg')
      }
    ],
      svgMap: {
        '交换机': {
            index: 0,
            src: require('../../assets/svg/交换机.svg')
        },
        'APP': {
            index: 1,
            src: require('../../assets/svg/APP.svg')
        },
        '服务器': {
            index: 2,
            src: require('../../assets/svg/服务器.svg')
        },
        '网络': {
            index: 3,
            src: require('../../assets/svg/网络.svg')
        },
        'PC': {
            index: 4,
            src: require('../../assets/svg/PC.svg')
        },
        '云': {
            index: 5,
            src: require('../../assets/svg/云.svg')
        },
        '数据库': {
            index: 6,
            src: require('../../assets/svg/数据库.svg')
        },
        'earth': {
            index: 7,
            src: require('../../assets/svg/earth.svg')
        },
        'Docker': {
            index: 8,
            src: require('../../assets/svg/Docker.svg')
        },
        'router': {
            index: 9,
            src: require('../../assets/svg/router.svg')
        },
        'switch': {
            index: 10,
            src: require('../../assets/svg/switch.svg')
        },
        'building': {
            index: 11,
            src: require('../../assets/svg/building.svg')
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
        const svgElement = document.getElementById('svg-list');
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
            if(!id || !id.includes('SVG')) {
              return
            }
            var img = document.getElementById(id);
            var x = event.clientX;
            var y = event.clientY;
            const name = decodeURIComponent(img.src.split('/')[img.src.split('/').length - 1])
            // 将图片添加到SVG中
            var imgType = that.svgMap[name.split('.')[0]].index;
            console.log(container)
            let nodeId = that.generateRandomString(10)
            let nNode = utils.newNode(nodeId, name.split('.')[0], imgType, 'svg')
            nNode.x = x-220
            nNode.y = y-79
            that.$emit('addSvgNode', nNode)
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