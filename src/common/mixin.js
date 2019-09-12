import { debounce } from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // 1.监听 item中图片加载完成
    let newRefresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  activated() {
    let newRefresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
}
