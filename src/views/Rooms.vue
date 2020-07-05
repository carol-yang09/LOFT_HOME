<template>
  <div>
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
          ></datepicker>
          <span class="calendar_icon"><i class="far fa-calendar-alt"></i></span>
        </div>
        <Counter counter-name="Adults" v-bind:number="adults" v-on:number="countAdults"
        ></Counter>
        <Counter counter-name="Kids" v-bind:number="kids"  v-on:number="countKids"
        ></Counter>
        <a href="#" class="btn btn-m btn-dark toolbar_btn" @click.prevent="searchRoom()">Search</a>
      </form>
    </div>

    <div class="container rooms">
      <ul class="search-info" v-if="searchInfo.isShow">
        <li>
          搜尋結果：
          {{ searchInfo.checkIn }} ~ {{ searchInfo.checkOut }} | {{ searchInfo.sumNum }} 人
        </li>
        <li>
          <a href="#" @click.prevent="resetSearch()">&#215;</a>
        </li>
      </ul>
      <div>
        <div class="card" v-for=" room in filterRooms" :key="room.id">
          <router-link :to="`rooms/${room.id}`" class="effect">
            <div class="effect_img"
             :style="{ 'background-image': 'url(' + room.imageUrl[0] + ')'}"></div>
            <div class="effect_rect">
              <p class="effect_rect_text">{{ room.name }}</p>
            </div>
          </router-link>
          <div class="card_body">
            <h5 class="card_title">
              {{ room.name }}
            </h5>
            <ul class="card_info">
              <li>
                | 人數：{{ room.descriptionShort.GuestMin }}
                 至 {{ room.descriptionShort.GuestMax }} 人
              </li>
              <li>| 坪數：{{ room.descriptionShort.Footage }}平方公尺</li>
              <li>| 床型：{{ room.descriptionShort.Bed[0] }}</li>
              <li v-if="room.amenities.Breakfast">| 餐點：附早餐</li>
              <li v-else>| 餐點：無</li>
            </ul>
            <ul class="row card_facilities">
              <template v-for="(facility, key) in room.amenities">
                <li v-if="room.amenities[key]" :key="key">
                  <i :class="amenities[key]"></i>
                </li>
              </template>
            </ul>
          </div>
          <div class="card_footer">
            <ul>
              <li class="card_price">平日每晚：<span>{{ room.holidayPrice | currency }}</span></li>
              <li class="card_price">假日每晚：<span>{{ room.normalDayPrice | currency }}</span></li>
            </ul>
            <div>
              <router-link :to="`rooms/${room.id}`"
               class="btn btn-m btn-outline-dark rounded">
                MORE +
              </router-link>
              <a href="#" class="btn btn-m btn-dark rounded"
               @click.prevent="bookRoom(room.id)">
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import Counter from '@/components/Counter';
import dayjs from 'dayjs';

dayjs().format();

export default {
  data() {
    return {
      // 訂房資料
      checkIn: '',
      checkOut: '',
      kids: 0,
      adults: 0,
      // amenities icon
      amenities: {
        'Child-Friendly': 'fas fa-baby',
        'Pet-Friendly': 'fas fa-paw',
        'Room-Service': 'fas fa-concierge-bell',
        'Smoke-Free': 'fas fa-smoking',
        Breakfast: 'fas fa-utensils',
        'Air-Conditioner': 'fas fa-wind',
        'Mini-Bar': 'fas fa-glass-martini-alt',
        Refrigerator: 'fas fa-ice-cream',
        Sofa: 'fas fa-couch',
        Television: 'fas fa-tv',
        'Wi-Fi': 'fas fa-wifi',
        'Great-View': 'fas fa-mountain',
      },
    };
  },
  methods: {
    getRooms() {
      this.$store.dispatch('roomsModules/getRooms', { form: 'rooms' });
    },
    // Count
    countKids(num) {
      this.kids = num;
    },
    countAdults(num) {
      this.adults = num;
    },
    // 訂房 - 跳轉到 checkorder 頁面
    bookRoom(id) {
      const vm = this;
      vm.$router.push({
        path: '/checkorder',
        query: {
          roomId: id,
          checkIn: '',
          checkOut: '',
        },
      });
    },
    // 搜尋
    searchRoom() {
      // 取得人數
      const sumNum = Number(this.adults) + Number(this.kids);

      if (sumNum > 0 && this.checkIn && this.checkOut) {
        const searchData = {
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          sumNum,
          roomsBooked: this.roomsBooked,
        };
        this.$store.dispatch('searchModules/updateUnavailableRoom', searchData);
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
      this.resetInput();
    },
    resetInput() {
      this.checkIn = '';
      this.checkOut = '';
      this.kids = 0;
      this.adults = 0;
    },
    updateDisabledEnd(newVal) {
      this.$store.dispatch('calendarModules/updateDisabledEnd', newVal);
    },
    ...mapActions('searchModules', ['resetSearch']),
  },
  computed: {
    // 過濾房型
    filterRooms() {
      const vm = this;
      return vm.roomsDetil
        .filter(item => vm.unavailableRoom.indexOf(item.id) === -1);
    },
    ...mapGetters('roomsModules', ['roomsDetil', 'roomsBooked']),
    ...mapGetters('calendarModules', ['disabledStart', 'disabledEnd']),
    ...mapGetters('searchModules', ['selectDateArray', 'unavailableRoom', 'searchInfo']),
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
    if (vm.$route.query.checkIn) {
      vm.checkIn = new Date(Number(vm.$route.query.checkIn));
      vm.checkOut = new Date(Number(vm.$route.query.checkOut));
      vm.adults = vm.$route.query.adults;
      vm.kids = vm.$route.query.kids;

      vm.searchRoom();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.rooms {
  padding: 2.5rem 0;
  @include desktop {
    padding: 2.5rem 2rem;
  }
  @include mobile-l {
    padding: 2.5rem 1rem;
  }
}

.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid $dark;
  font-size: $font-m;
  a {
    font-size: $font-l;
    &:hover {
      color: $danger;
    }
  }
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
</style>
