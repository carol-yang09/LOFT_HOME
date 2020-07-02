<template>
  <div class="container row contact">
    <div class="col-6 contact_img"></div>

    <ValidationObserver action="" class="col-6 contact_form" ref="form" tag="form">
      <h2>Contact</h2>

      <validation-provider rules="required" name="姓名" v-slot="{ errors }" tag="div"
        class="form-group">
        <label for="name"><span class="text-danger">*</span>姓名</label>
        <input type="text" id="name" placeholder="請輸入姓名" v-model="message.name">
        <span class="text-danger">{{ errors[0] }}</span>
      </validation-provider>

      <validation-provider rules="email|required" name="電子郵件" v-slot="{ errors }" tag="div"
        class="form-group">
        <label for="email"><span class="text-danger">*</span>電子郵件</label>
        <input type="text" id="email" placeholder="請輸入電子郵件" v-model="message.email">
        <span class="text-danger">{{ errors[0] }}</span>
      </validation-provider>

      <validation-provider rules="phone|required" name="聯絡電話(手機)" v-slot="{ errors }" tag="div"
        class="form-group">
        <label for="tel"><span class="text-danger">*</span>聯絡電話(手機)</label>
        <input type="number" id="tel" placeholder="請輸入聯絡電話(手機)" v-model="message.tel">
        <span class="text-danger">{{ errors[0] }}</span>
      </validation-provider>

      <validation-provider rules="required" name="詢問主題" v-slot="{ errors }" tag="div"
        class="form-group">
        <label for="title"><span class="text-danger">*</span>詢問主題</label>
        <input type="text" id="title" placeholder="請輸入詢問主題" v-model="message.title">
        <span class="text-danger">{{ errors[0] }}</span>
      </validation-provider>

      <validation-provider rules="required" name="留言" v-slot="{ errors }" tag="div"
        class="form-group">
        <label for="content"><span class="text-danger">*</span>留言</label>
        <textarea name="content" id="content" rows="10" placeholder="請輸入留言"
         v-model="message.content"></textarea>
        <span class="text-danger">{{ errors[0] }}</span>
      </validation-provider>

      <button type="submit" class="btn btn-l btn-primary" @click.prevent="leaveMessage()">
        送出
      </button>

    </ValidationObserver>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: {
        name: '',
        email: '',
        tel: '',
        title: '',
        content: '',
      },
    };
  },
  methods: {
    leaveMessage() {
      const vm = this;
      vm.$refs.form.validate().then((success) => {
        if (success) {
          const alert = {
            isShow: true,
            title: '傳送成功!',
            content: '您的訊息我們已收到，謝謝您的回饋！',
            to: '/',
          };
          vm.$bus.$emit('alert', alert);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.contact {
  padding: 1rem 0 2.5rem;
  @include desktop {
    padding: 1rem 2rem 2.5rem 2rem;
  }
  @include mobile-l {
    padding: 1rem 1rem 2.5rem 1rem;
  }
}

.contact_img {
  min-height: 19rem;
  background: url('../assets/images/contact.jpg') center no-repeat;
  background-size: cover;
  @include mobile-m {
    min-height: 12.5rem;
  }
}

.contact_form {
  h2 {
    text-align: center;
    letter-spacing: 0.2rem;
  }
  button {
    width: 100%;
  }
}
</style>
