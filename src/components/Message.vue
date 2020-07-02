<template>
  <div class="message">
    <ul>
      <li class="message_item" :class="message.status"
       v-for="(message, index) in messages" :key="`message-${index}`">
       <div>
         <span v-if="message.status == 'danger'"><i class="fas fa-exclamation-triangle"></i></span>
          <span v-if="message.status == 'success'"><i class="fas fa-check-circle"></i></span>
          {{ message.message }}
       </div>
        <a href="#" @click.prevent="removeMessage(index)">&times;</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Message',
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp,
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessage(num) {
      this.messages.splice(num, 1);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, index) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(index, 1);
          }
        });
      }, 2000);
    },
  },
  created() {
    const vm = this;
    vm.$bus.$on('message', (message, status = 'success') => {
      vm.updateMessage(message, status);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.message {
  position: fixed;
  min-width: 10rem;
  top: 5rem;
  right: 2rem;
  z-index: 998;
  @include pad {
    right: 1rem;
  }
}
.message_item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 1rem 1rem;
  border-width: 2px;
  border-radius: $arc-m;
  span {
    margin-right: 0.5rem;
  }
}

.danger {
  background-color: $danger;
  color: $white;
  a {
    color: $white;
  }
}

.success {
  background-color: $success;
  color: $white;
  a {
    color: $white;
  }
}
</style>
