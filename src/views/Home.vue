<template>
  <div>
    <div class="banner">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide>
          <div class="banner_img banner_img-1"></div>
        </swiper-slide>
        <swiper-slide>
          <div class="banner_img banner_img-2"></div>
        </swiper-slide>
        <swiper-slide>
          <div class="banner_img banner_img-3"></div>
        </swiper-slide>
        <swiper-slide>
          <div class="banner_img banner_img-4"></div>
        </swiper-slide>
        <div class="swiper-button-next swiper-button-custom" slot="button-next"></div>
      </swiper>

      <!-- toolbar -->
      <div class="toolbar_wrap">
        <div class="toolbar-vertical">
          <form action="" class="container toolbar_form">
            <div>
              <label for="checkin">CheckIn</label>
              <div class="calendar">
                <datepicker placeholder="CheckIn" v-model="checkIn"
                  :disabled-dates="disabledStart"
                  :format="'yyyy/MM/dd'"
                  :calendar-class="'calendar_calendar'"
                  :wrapper-class="'calendar_wrap'"
                  :input-class="'calendar_input'"
                  :required="true"
                ></datepicker>
                <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
              </div>
            </div>

            <div>
              <label for="checkout">CheckOut</label>
              <div class="calendar">
                <datepicker placeholder="CheckOut" v-model="checkOut"
                  :disabled-dates="disabledEnd"
                  :format="'yyyy/MM/dd'"
                  :calendar-class="'calendar_calendar'"
                  :wrapper-class="'calendar_wrap'"
                  :input-class="'calendar_input'"
                  :required="true"
                ></datepicker>
                <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
              </div>
            </div>

            <div class="toolbar_counter">
              <div>
                <label for="adults">Adults</label>
                <Counter v-bind:number="adults" v-on:number="countAdults"
                ></Counter>
              </div>
              <div>
                <label for="kids">Kids</label>
                <Counter v-bind:number="kids"  v-on:number="countKids"
                ></Counter>
              </div>
            </div>

            <a href="#" class="btn btn-l btn-outline-dark toolbar_btn"
             @click.prevent="searchRouter()">Search</a>
          </form>
        </div>
      </div>

      <div class="scroll-btn">
        <a href="" @click.prevent="scroll()">
          Scroll<span><i class="fas fa-chevron-down"></i></span>
        </a>
      </div>
    </div>

    <div class="container home">
      <div class="room_type">
        <h3>Room Type</h3>
        <div class="row">
          <router-link href="#" class="col-4" v-for=" room in roomsDetil" :key="room.id"
           :to="`rooms/${room.id}`">
            <div class="effect">
              <div class="effect_img"
               :style="{ 'background-image': 'url(' + room.imageUrl + ')'}">
              </div>
              <div class="effect_rect">
                <p class="effect_rect_text">{{ room.name }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import Counter from '@/components/Counter';
import $ from 'jquery';

export default {
  data() {
    return {
      // 訂房資料
      checkIn: '',
      checkOut: '',
      kids: 0,
      adults: 0,
      // vue-awesome-swiper 設定
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 2500,
        autoplay: {
          delay: 4000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
        },
      },
    };
  },
  methods: {
    scroll() {
      $('html, body').animate({
        scrollTop: $('.banner').height(),
      }, 1000);
    },
    getRooms() {
      this.$store.dispatch('roomsModules/getRooms');
    },
    // Count
    countKids(num) {
      this.kids = num;
    },
    countAdults(num) {
      this.adults = num;
    },
    updateDisabledEnd(newVal) {
      this.$store.dispatch('calendarModules/updateDisabledEnd', newVal);
    },
    searchRouter() {
      const vm = this;
      const sumNum = Number(vm.adults) + Number(vm.kids);
      if (sumNum > 0 && vm.checkIn && vm.checkOut) {
        vm.$router.push({
          path: '/rooms',
          query: {
            checkIn: vm.checkIn.getTime(),
            checkOut: vm.checkOut.getTime(),
            adults: vm.adults,
            kids: vm.kids,
          },
        });
      } else {
        const alert = {
          isShow: true,
          title: '錯誤!',
          content: '請輸入完整資訊，謝謝您！',
          to: '',
          status: 'danger',
        };
        this.$store.dispatch('alertModules/openAlert', alert);
      }
    },
  },
  computed: {
    ...mapGetters('roomsModules', ['roomsDetil']),
    ...mapGetters('calendarModules', ['disabledStart', 'disabledEnd']),
  },
  watch: {
    // 監聽
    checkIn(newVal, oldVal) {
      // 若 checkIn 更新值，則將 checkIn 傳給 updateDisabledEnd 更新  disabledEnd
      if (newVal !== oldVal) {
        this.updateDisabledEnd(newVal);
      }
      // 若 checkIn 若大於 checkOut 則把 checkOut 清空
      if (new Date(newVal) > new Date(this.checkOut)) {
        this.checkOut = '';
      }
    },
  },
  components: {
    Datepicker,
    Counter,
  },
  created() {
    const vm = this;
    vm.getRooms();
    // 初始化 disabledEnd
    vm.updateDisabledEnd();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.home {
  padding: 0 0 2.5rem;
  @include desktop {
    padding: 0 2rem 2.5rem;
    text-align: center;
  }
  @include mobile-l {
    padding: 0 1rem 2.5rem;
  }
  h3 {
    font-size: $font-l;
  }
}

.banner {
  justify-content: center;
  position: relative;
  min-height: calc(100vh - 5.5rem);
  @include mobile-horizontal {
    min-height: calc(100vh - 5rem);
  }
}

.banner_img {
  min-height: calc(100vh - 5.5rem);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  @include mobile-horizontal {
    min-height: calc(100vh - 5rem);
  }
}

.banner_img-1 {
  background-image: url('../assets/images/banner_1.jpg');
}

.banner_img-2 {
  background-image: url('../assets/images/banner_2.jpg');
  background-position: bottom;
}

.banner_img-3 {
  background-image: url('../assets/images/banner_3.jpg');
}

.banner_img-4 {
  background-image: url('../assets/images/banner_4.jpg');
  background-position: bottom;
}

.toolbar_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 50%;
  z-index: 2;
  background-color: rgba($primary, 0.3);
  @include mobile-horizontal {
    align-items: flex-start;
    right: 0;
  }
}

.toolbar-vertical {
  max-width: 20rem;
  background-color: rgba($white, 0.5);
  padding: 2.5rem 3rem 1.5rem;
}

.toolbar_form {
  text-align: center;
  > div {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.25rem;
    text-align: left;
  }
}

.toolbar_counter {
  display: flex;
  justify-content: space-between;
}

// counter

>>> .counter_input {
  min-width: 6rem;
}

.toolbar_btn {
  margin: 1rem;
  @include desktop {
    margin: 0;
  }
}

// banner scroll-btn

.scroll-btn {
  position: absolute;
  left: 49%;
  bottom: 0;
  text-align: center;
  padding-bottom: 1rem;
  z-index: 3;
  @include mobile-horizontal {
    top: calc(100vh - 5.5rem - 3.5rem);
  }
  a {
    display: inline-block;
    color: $white;
    transition: all 0.4s ease;
    &:hover {
      color: $primary;
    }
  }
  span {
    display: block;
    font-size: 2rem;
  }
}

@include mobile-horizontal {
  .swiper-button-custom {
    display: none;
  }
}
</style>
