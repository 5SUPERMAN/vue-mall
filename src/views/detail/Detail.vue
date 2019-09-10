<template>
  <div id="detail">
    <detail-nav-bar />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :detail-goods="detailGoods" />
      <detail-shop-info :detail-shop="detailShop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo"/>
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

import Scroll from "components/common/scroll/Scroll";

import { getDetail, DetailGoods, DetailShop, GoodsParam } from "network/detail";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      detailGoods: {},
      detailShop: {},
      detailInfo: {},
      paramInfo: {}
    };
  },
  created() {
    // 1.保存传入的 iid
    this.iid = this.$route.params.iid;

    // 2.根据 iid请求详细数据
    getDetail(this.iid).then(res => {
      console.log(res);
      // (1)获取顶部轮播图数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // (2)获取商品信息
      this.detailGoods = new DetailGoods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // (3)创建店铺信息对象
      this.detailShop = new DetailShop(data.shopInfo);

      // (4)保存商品的详细数据
      this.detailInfo = data.detailInfo;

      // (5)获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
    });
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
    Scroll
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