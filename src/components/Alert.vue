<template>
  <div class="alert" :class="{'active': alert.isShow}">
    <div class="alert_wrap">
      <h2>
        <span class="alert_icon"
         :class="{'text-danger': status == 'danger', 'text-success': status == 'success'}">
          <i class="far fa-check-circle" v-if="status == 'success'"></i>
          <i class="far fa-times-circle" v-if="status == 'danger'"></i>
        </span>
        {{ alert.title }}
      </h2>
      <p>{{ alert.content }}</p>
      <button class="btn btn-m btn-dark" @click.prevent="closeAlert()">OK !</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'Alert',
  data() {
    return {
      alert: {
        isShow: false,
        title: '',
        content: '',
        to: '',
      },
      status: '',
    };
  },
  methods: {
    closeAlert() {
      const vm = this;
      vm.alert.isShow = false;
      $('body').css('overflow', 'auto');
      if (vm.alert.to) {
        vm.$router.push(vm.alert.to);
      }
    },
    resetAlert() {
      const vm = this;
      vm.alert = {
        isShow: false,
        title: '',
        content: '',
        to: '',
      };
    },
  },
  created() {
    const vm = this;
    vm.resetAlert();

    vm.$bus.$on('alert', (alert, status = 'success') => {
      vm.alert = alert;
      vm.status = status;
      $('body').css('overflow', 'hidden');
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.alert {
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba($dark, 0.7);
  z-index: 998;
  &.active {
    display: flex;
  }
}

.alert_wrap {
  padding: 3rem;
  background-color: $white;
  border-radius: $arc-m;
  text-align: center;
  h2 {
    margin-bottom: 2.5rem;
  }
  p {
    margin-bottom: 3rem;
  }
}

.alert_icon {
  font-size: $font-xxl;
  font-weight: lighter;
}
</style>
