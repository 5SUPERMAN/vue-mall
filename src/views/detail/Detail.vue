<template>
  <div id="detail">
    <detail-nav-bar />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :detail-goods="detailGoods" />
      <detail-shop-info :detail-shop="detailShop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" />
      <detail-comment-info :comment-info="commentInfo" />
      <goods-list :goods="recommend" />
    </scroll>
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
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Detail",
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      detailGoods: {},
      detailShop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: []
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
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
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
    Scroll,
    GoodsList
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 99;
  height: 100vh;
}
.content {
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  overflow: hidden;
}
</style>