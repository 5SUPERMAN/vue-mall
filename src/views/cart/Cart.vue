<template>
  <div id="cart" class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <scroll class="content" ref="scroll">
      <cart-list />
    </scroll>
  </div>
</template>

<script>
import CartList from "./childComps/CartList";

import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  computed: {
    ...mapGetters(["cartLength"])
  },
  activated() {
    this.$refs.scroll.refresh();
  },
  components: {
    CartList,
    NavBar,
    Scroll
  }
};
</script>

<style scoped>
#cart {
  position: relative;
  height: 100vh;
}
.nav-bar {
  color: #fff;
  background-color: var(--color-tint);
}
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
