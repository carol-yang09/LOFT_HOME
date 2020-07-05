<template>
  <div>
    <!-- room -->
    <div class="container room">
      <div class="silder" :style="{'background-image': 'url(' + imageActive + ')'}">
        <h2 class="silder_title">{{ room.name }}</h2>
        <ul class="silder_price">
          <li>平日每晚：<span class="">{{ room.normalDayPrice | currency }}</span></li>
          <li>假日每晚：<span class="">{{ room.holidayPrice | currency }}</span></li>
        </ul>
      </div>
      <ul class="silder-control">
        <li class="silder-control_img" v-for="(img, key) in room.imageUrl" :key="key"
        :style="{'background-image': 'url(' + img + ')'}" @click.prevent="imageActive = img">
        </li>
      </ul>
      <div class="row room_intro">
        <div class="col-6">
          <h3>房間設備</h3>
          <ul class="room_facilities">
            <template v-for="(facility, key) in room.amenities">
              <li v-if="room.amenities[key] && amenities.room[key]"
               :key="'room-' + key">
                <i :class="amenities.room[key]"></i>
              </li>
            </template>
          </ul>
        </div>
        <div class="col-6">
          <h3>其他</h3>
          <ul class="room_facilities">
            <template v-for="(facility, key) in room.amenities">
              <li v-if="room.amenities[key] && amenities.public[key]"
               :key="'room-' + key">
                <i :class="amenities.public[key]"></i>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="room_intro">
        <h3>簡介</h3>
        <p>{{ room.description }}</p>
      </div>
      <div class="row room_info">
        <ul class="col-4">
          <li v-if="room.descriptionShort">
            | 人數：{{ room.descriptionShort.GuestMin }}
            至 {{ room.descriptionShort.GuestMax }} 人
          </li>
          <li v-if="room.descriptionShort">| 坪數：{{ room.descriptionShort.Footage }}平方公尺</li>
        </ul>
        <ul class="col-4">
          <li v-if="room.descriptionShort">| 床型：{{ room.descriptionShort.Bed[0] }}</li>
          <li  v-if="room.descriptionShort">
            | 餐點：
            <span v-if="room.amenities.Breakfast">附早餐</span>
            <span v-else>無</span>
          </li>
        </ul>
        <ul class="col-4">
          <li v-if="room.checkInAndOut">| checkOut 時間：{{ room.checkInAndOut.checkOut }}</li>
          <li v-if="room.checkInAndOut">
            | checkIn 時間：最早 {{ room.checkInAndOut.checkInEarly }}
            、最晚 {{ room.checkInAndOut.checkInLate }}
          </li>
        </ul>
      </div>
    </div>

    <!-- toolbar -->
    <div class="toolbar">
      <form action="" class="container toolbar_form">
        <div class="calendar">
          <datepicker placeholder="CheckIn" v-model="checkIn"
            :disabled-dates="disabledStart"
            :format="'yyyy/MM/dd'"
            :calendar-class="'calendar_calendar'"
            :wrapper-class="'calendar_wrap'"
            :input-class="'calendar_input'"
            :required="true"
            :highlighted="highlighted"
          ></datepicker>
          <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
        </div>

        <div class="calendar">
          <datepicker placeholder="CheckOut" v-model="checkOut"
            :disabled-dates="disabledEnd"
            :format="'yyyy/MM/dd'"
            :calendar-class="'calendar_calendar'"
            :wrapper-class="'calendar_wrap'"
            :input-class="'calendar_input'"
            :required="true"
            :highlighted="highlighted"
          ></datepicker>
          <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
        </div>

        <Counter counter-name="Adults" v-bind:number="adults" v-on:number="countAdults"
        ></Counter>

        <Counter counter-name="Kids" v-bind:number="kids"  v-on:number="countKids"
        ></Counter>

        <a href="#" class="btn btn-m btn-dark rounded"
         @click.prevent="bookRoom(room.id, room)">
          Booking
        </a>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import Counter from '@/components/Counter';
import dayjs from 'dayjs';

dayjs().format();

export default {
  data() {
    return {
      roomId: '',
      // 訂房資料
      checkIn: '',
      checkOut: '',
      kids: 0,
      adults: 0,
      // amenities icon
      amenities: {
        public: {
          'Child-Friendly': 'fas fa-baby',
          'Pet-Friendly': 'fas fa-paw',
          'Room-Service': 'fas fa-concierge-bell',
          'Smoke-Free': 'fas fa-smoking',
          Breakfast: 'fas fa-utensils',
        },
        room: {
          'Air-Conditioner': 'fas fa-wind',
          'Mini-Bar': 'fas fa-glass-martini-alt',
          Refrigerator: 'fas fa-ice-cream',
          Sofa: 'fas fa-couch',
          Television: 'fas fa-tv',
          'Wi-Fi': 'fas fa-wifi',
          'Great-View': 'fas fa-mountain',
        },
      },
    };
  },
  methods: {
    getRoomItem(id) {
      this.$store.dispatch('roomsModules/getRoomItem', { id, form: 'room' });
    },
    // Count
    countKids(num) {
      this.kids = num;
    },
    countAdults(num) {
      this.adults = num;
    },
    // bookRoom
    bookRoom(id) {
      const vm = this;
      const sumNum = Number(vm.adults) + Number(vm.kids);

      if (sumNum > 0 && vm.checkIn && vm.checkOut) {
        vm.$router.push({
          path: '/checkorder',
          query: {
            roomId: id,
            checkIn: vm.checkIn.getTime(),
            checkOut: vm.checkOut.getTime(),
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
    updateDisabledEnd(newVal) {
      this.$store.dispatch('calendarModules/updateDisabledEnd', newVal);
    },
  },
  computed: {
    imageActive: {
      // 取值
      get() {
        return this.$store.state.roomsModules.imageActive;
      },
      // 設值
      set(newVal) {
        return this.$store.commit('roomsModules/IMAGEACTIVE', newVal);
      },
    },
    ...mapGetters('roomsModules', ['room', 'roomItemBooked']),
    ...mapGetters('calendarModules', ['disabledStart', 'disabledEnd', 'highlighted']),
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
    vm.getRoomItem(vm.$route.params.roomId);
    // 初始化 disabledEnd
    vm.updateDisabledEnd();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.room {
  padding: 2.5rem 0 0;
  @include desktop {
    padding: 1rem 0 0;
  }
  h3 {
    font-size: $font-l;
    @include mobile-horizontal  {
      margin: 1rem 0;
    }
  }
}

.room_facilities {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  font-size: $font-xxl;
  li {
    width: 5rem;
    height: 5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    background-color: $primary;
    line-height: 5rem;
    @include mobile-horizontal  {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
}

// room_intro

.room_intro {
  @include desktop {
    padding: 0 1rem;
  }
  p {
    font-size: $font-m;
    font-weight: lighter;
    line-height: 1.5;
  }
}

// room_info

.room_info {
  max-width: 70%;
  margin-bottom: 1rem;
  @include desktop {
    padding: 0 1rem;
  }
  @include mobile-horizontal {
    margin-bottom: 0;
  }
  li {
    margin-bottom: 1rem;
    white-space: nowrap;
  }
}

// silder

.silder {
  display: flex;
  justify-content: space-between;
  position: relative;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  min-height: calc(100vh - 6.5rem);
  @include desktop {
    background-size: cover;
  }
  @include desktop-s {
    flex-direction: column;
    align-items: center;
  }
}

.silder_title {
  text-shadow: 0px 0px 3px $white;
  @include desktop {
    margin: 1.5rem 1rem;
  }
}

.silder_price {
  align-self: flex-end;
  margin: 3rem 0 2rem;
  text-shadow: 0px 0px 3px $white;
  @include desktop {
    margin: 3rem 1rem 2rem;
  }
  @include desktop-s {
    align-self: center;
  }
  li {
    margin-bottom: 1rem;
  }
  span {
    font-size: $font-xl;
    font-weight: bold;
  }
}

// silder-control

.silder-control {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: lighten($primary, 10%);
  li {
    margin: 1rem;
    width: 100%;
    max-width: 11.5rem;
    height: 7.5rem;
    background-color: $white;
  }
}

.silder-control_img {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
}

// toolbar

.toolbar {
  padding: 1rem 0;
  background-color: $primary;
  @include desktop {
    padding: 1rem 1rem;
  }
}

.toolbar_form {
  display: flex;
  justify-content: space-between;
  @include desktop-s {
    flex-direction: column;
    width: 80%;
  }
  @include mobile-l {
    width: 90%;
  }
}

// counter

>>> .counter_input {
  min-width: 10rem;
}

// calendar

>>> .calendar_calendar {
  bottom: 2.25rem;
}
</style>
