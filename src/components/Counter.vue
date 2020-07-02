<template>
  <div class="counter">
    <a href="#" class="addNum" @click.prevent="addNum()">
      <i class="fas fa-plus"></i>
    </a>
    <input type="number" min="0" max="10" readonly="readonly"
     :class="{'hasName': counterName}" class="counter_input" v-model="myNumber">
    <span class="counter_name">{{ counterName }}</span>
    <a href="#" class="lessNum" @click.prevent="lessNum()">
      <i class="fas fa-minus"></i>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  props: ['counterName', 'number'],
  data() {
    return {
      myNumber: this.number,
    };
  },
  methods: {
    addNum() {
      const vm = this;
      vm.myNumber += 1;
    },
    lessNum() {
      const vm = this;
      if (vm.myNumber > 0) {
        vm.myNumber -= 1;
      } else {
        vm.myNumber = 0;
      }
    },
  },
  watch: {
    number(newVal) {
      this.myNumber = newVal; // 監聽外部傳入的 number
    },
    myNumber(newVal) {
      this.$emit('number', newVal); // 監聽內部 myNumbar 傳給外部的 number
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.counter {
  position: relative;
  @include desktop-s {
    margin-bottom: 1rem;
  }
}

.counter_input {
  width: 100%;
  height: 100%;
  min-width: 10rem;
  padding: 0.25rem 0.5rem;
  border-radius: $arc-s;
  cursor: context-menu;
}

.counter_name {
  position: absolute;
  right: 2.5rem;
  cursor: context-menu;
  line-height: 2.25rem;
}

.addNum, .lessNum {
  position: absolute;
  top: 0;
  bottom: 0;
  padding: 0 0.5rem;
  background-color: $dark;
  border-radius: $arc-s;
  color: $white;
  line-height: 2.25rem;
}

.addNum {
  left: 0;
}

.lessNum {
  right: 0rem;
}

.hasName {
  padding: 0.25rem 0.5rem 0.25rem 3rem;
  text-align: left;
  @include desktop-s {
    padding: 0.25rem 0.5rem;
    text-align: center;
  }
}
</style>
