<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" />
      <span>全选</span>
    </div>
    <div class="total-prcie">合计:￥{{totalPrice}}</div>
    <div class="calculation">去结算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CheckBottomBar",
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return this.cartList
        .filter(item => item.checked)
        .reduce((preValue, item) => {
          return preValue + item.price * item.count;
        }, 0)
        .toFixed(2);
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    }
  },
  components: {
    CheckButton
  }
};
</script>

<style scoped>
.bottom-bar {
  position: absolute;
  bottom: 49px;
  left: 0;
  right: 0;
  height: 30px;
  background-color: #eee;
  line-height: 30px;
  display: flex;
  font-size: 12px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 18px;
  height: 18px;
  line-height: 18px;
  margin-right: 5px;
}
.total-prcie {
  flex: 1;
  margin-left: 30px;
}
.calculation {
  width: 90px;
  color: #fff;
  background-color: orangered;
  text-align: center;
}
</style>