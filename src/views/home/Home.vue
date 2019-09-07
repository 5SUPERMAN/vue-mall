<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物车</div>
    </nav-bar>
    <home-swiper :banners="banners" />
    <recommend-view :recommends="recommends"/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";

import { getHomeMultidata } from "network/home.js";

export default {
  name: "Home",
  data() {
    return {
      banners: [],
      recommends: []
    };
  },
  created() {
    // 1.请求多个数据
    getHomeMultidata().then(res => {
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    });
  },
  components: {
    NavBar,
    HomeSwiper,
    RecommendView
  }
};
</script>

<style scoped>
.home-nav {
  color: #fff;
  background-color: var(--color-tint);
}
</style>
