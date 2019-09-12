<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物车</div>
    </nav-bar>
    <tab-control
      ref="tabControl1"
      class="tab-control"
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      v-show="isTabControlFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="scrollContent"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control ref="tabControl2" :titles="['流行','新款','精选']" @tabClick="tabClick" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 组件本身是不可以监听事件，需要加 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home.js";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Home",
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabControlFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    
  },
  // 切换页面时，记录当前页面位置，等切回来时保持来位置
  // 点击进来页面时的一个函数
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  // 点击离开该页面时的一个函数
  deactivated() {
    // 1.保持 Y值
    this.saveY = this.$refs.scroll.getScrollY();

    // 2.取消全局事件监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 让两个 tab-control被选中的 currentType保持一致----通过 v-show将 scroll外部的 tab-control达到条件后显示，来做到吸顶效果
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
      // 选择不同 currentType的时候，回到 tab-control的位置
      this.$refs.scroll.scrollTo(0, -this.tabOffsetTop, 0);
      this.$refs.scroll.refresh();
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    scrollContent(position) {
      // 判断回到顶部 BackClick按钮是否显示
      this.isShowBackTop = -position.y >= 700;

      // 决定 tabControl是否吸顶
      this.isTabControlFixed = -position.y >= this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      // 2.获取 tabControl的 offsetTop
      // 所有的组件都有一个属性 $el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    }
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  }
};
</script>

<style scoped>
#home {
  /*单位 vh -->viewport height 当前视口的高度 */
  height: 100vh;
  position: relative;
}
.home-nav {
  color: #fff;
  background-color: var(--color-tint);
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999; */
}
.tab-control {
  position: relative;
  z-index: 999;
}
.content {
  /* 使用定位确定中间部分的高度 */
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
