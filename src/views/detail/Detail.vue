<template>
  <div id="detail">
    <detail-nav-bar @navBarClick="navBarClick" ref="navBar" />
    <scroll
      class="content"
      ref="scroll"
      @scroll="scrollContent"
      :probe-type="3"
      :pull-up-load="true"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :detail-goods="detailGoods" />
      <detail-shop-info :detail-shop="detailShop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {
  getDetail,
  getRecommend,
  DetailGoods,
  DetailShop,
  GoodsParam
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      detailGoods: {},
      detailShop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  created() {
    // 1.保存传入的 iid
    this.iid = this.$route.params.iid;

    // 2.根据 iid请求详细数据
    getDetail(this.iid).then(res => {
      // (1)获取数据
      const data = res.result;

      // (2)获取顶部轮播图数据
      this.topImages = data.itemInfo.topImages;

      // (3)获取商品信息
      this.detailGoods = new DetailGoods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // (4)创建店铺信息对象
      this.detailShop = new DetailShop(data.shopInfo);

      // (5)保存商品的详细数据
      this.detailInfo = data.detailInfo;

      // (6)获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // (7)获取评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommend = res.data.list;
    });

    // 4.给 getThemeTopY进行防抖操作
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
    }, 50);
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    imageLoad() {
      this.newRefresh();

      this.getThemeTopY();
    },
    navBarClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
    },
    scrollContent(position) {
      // 1.获取 Y 的值
      const positionY = -position.y;
      // 2.positionY和主题中的值进行对比
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // 普通方法
        // if(this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length-1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.navBar.currentIndex = this.currentIndex;
        // }

        // hack方法
        if (
          this.currentIndex !== i &&
          (i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1])
        ) {
          this.currentIndex = i;
          this.$refs.navBar.currentIndex = this.currentIndex;
        }
      }

      // 是否显示回到顶部按钮
      this.listenerShowBackTop(position);
    },

    ...mapActions(["addCart"]),
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.detailGoods.title;
      product.desc = this.detailGoods.desc;
      product.price = this.detailGoods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里
      // 方法1：
      // this.$store.dispatch("addCart", product).then(res => {
      //   console.log(res);
      // });

      // 方法2：通过 mapActions映射关系
      this.addCart(product).then(res => {
        this.$toast.show(res);
      });
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  height: 100vh;
}
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  background-color: #fff;
  overflow: hidden;
}
</style>