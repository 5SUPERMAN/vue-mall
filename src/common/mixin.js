import { debounce } from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    // 1.监听 item中图片加载完成
    this.newRefresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      this.newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  activated() {
    // this.newRefresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      this.newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
}
