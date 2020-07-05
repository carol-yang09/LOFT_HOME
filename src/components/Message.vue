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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Message',
  data() {
    return {};
  },
  methods: {
    updateMessage(message, status) {
      this.$store.dispatch('messageModules/updateMessage', { message, status });
    },
    removeMessage(index) {
      this.$store.dispatch('messageModules/removeMessage', index);
    },
    ...mapActions('messageModules', ['removeMessageWithTiming']),
  },
  computed: {
    ...mapGetters('messageModules', ['messages']),
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
