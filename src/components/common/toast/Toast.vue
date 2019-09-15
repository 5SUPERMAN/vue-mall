<template>
  <div class="toast" v-show="toastShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      toastShow: false
    };
  },
  methods: {
    show(message, duration = 1000) {
      this.toastShow = true;
      this.message = message;
      setTimeout(() => {
        this.toastShow = false;
        this.message = "";
      }, duration);
    }
  }
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  z-index: 999;
}
</style>