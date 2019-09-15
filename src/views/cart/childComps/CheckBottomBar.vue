<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick" />
      <span>全选</span>
    </div>
    <div class="total-prcie">合计:￥{{totalPrice}}</div>
    <div class="calculation" @click="calcClick">去结算({{checkLength}})</div>
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
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      // 方法1：
      // for (let item of this.cartList) {
      //   if (!item.checked) {
      //     return false;
      //   }
      // }
      // return true;

      // 方法2：
      // return !this.cartList.filter(item => !item.checked);

      // 方法3：
      return !this.cartList.find(item => !item.checked);
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => (item.checked = false));
      } else {
        this.cartList.forEach(item => (item.checked = true));
      }
    },
    calcClick() {
      if (!this.checkLength) {
        this.$toast.show("请选择购买的商品");
      }
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