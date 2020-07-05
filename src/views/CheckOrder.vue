<template>
  <div class="container row checkorder">
    <div class="row">
      <div class="col-6">
        <h2>Almost done!</h2>
        <p>您將預訂的房型為
          <span class="checkorder_subtitle">{{ room.name }}</span>
        </p>
        <p>請填寫以下資料，即可完成訂房。</p>

        <ValidationObserver action="" class="row checkorder_form" ref="form" tag="form">
          <validation-provider rules="required" name="姓名" v-slot="{ errors }" tag="div"
           class="col-6 form-group">
            <label for="name"><span class="text-danger">*</span>真實姓名</label>
            <input type="text" class="rounded" placeholder="ex: 王小明" v-model="name">
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>

          <validation-provider rules="phone|required" name="電話" v-slot="{ errors }" tag="div"
           class="col-6 form-group">
            <label for="phone"><span class="text-danger">*</span>手機號碼</label>
            <input type="number" class="rounded" placeholder="ex: 0955xxxxxx" v-model="phone">
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>

          <div class="col-6 form-group">
            <label for="checkin"><span class="text-danger">*</span>Check In</label>
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
          </div>

          <div class="col-6 form-group">
            <label for="checkout"><span class="star">*</span>Check Out</label>
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
            <span class="calendar_err">請輸入正確日期</span>
          </div>
        </ValidationObserver>
      </div>

      <div class="col-6 checkorder_info">
        <table class="info_table">
          <tbody>
            <tr>
              <td>{{ room.normalDayPrice | currency }} x {{ weekdays }} night (Weekdays)</td>
              <td class="text-right">{{ room.normalDayPrice * weekdays | currency }}</td>
            </tr>
            <tr>
              <td>{{ room.holidayPrice | currency }} X {{ holidays }} night (Holidays)</td>
              <td class="text-right">{{ room.holidayPrice * holidays | currency }}</td>
            </tr>
            <tr>
              <td>Server Free</td>
              <td class="text-right">$ 0</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td class="text-right">
                {{ (room.holidayPrice * holidays + room.normalDayPrice * weekdays) | currency }}
              </td>
            </tr>
          </tfoot>
        </table>
        <div class="info_btn">
          <router-link to="/rooms" class="btn btn-m btn-outline-dark">BACK &#60;</router-link>
          <button type="submit" class="btn btn-m btn-dark" @click.prevent="booking()">OK!</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import $ from 'jquery';
import dayjs from 'dayjs';
import Datepicker from 'vuejs-datepicker';

dayjs().format();

export default {
  data() {
    return {
      roomId: '',
      // 訂房資料
      checkIn: '',
      checkOut: '',
      name: '',
      phone: '',
      // 周末、平日計算
      holidays: 0,
      weekdays: 0,
    };
  },
  methods: {
    // 取得此房型資訊
    getRoomItem(id) {
      this.$store.dispatch('roomsModules/getRoomItem', { id, form: 'checkout' });
    },
    // 計算假日與平日
    calHolidaysandWeekdays() {
      const vm = this;
      vm.holidays = 0;
      vm.weekdays = 0;
      if (vm.checkIn && vm.checkOut) {
        this.$store.dispatch('searchModules/updateSelectDateArray', {
          checkIn: vm.checkIn,
          checkOut: vm.checkOut,
        });
        vm.selectDateArray.forEach((item) => {
          if (new Date(item).getDay() === 0 || new Date(item).getDay() === 6) {
            vm.holidays += 1;
          } else {
            vm.weekdays += 1;
          }
        });
      }
    },
    // 訂房
    booking() {
      const vm = this;
      if (!vm.checkIn || !vm.checkOut) {
        const alert = {
          isShow: true,
          title: '錯誤!',
          content: '請輸入完整資訊，謝謝您！',
          to: '',
          status: 'danger',
        };
        this.$store.dispatch('alertModules/openAlert', alert);
        return;
      }
      vm.$refs.form.validate().then((success) => {
        if (success) {
          const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${vm.roomId}`;

          const data = {
            name: vm.name,
            tel: vm.phone,
            date: vm.selectDateArray,
          };
          vm.$store.dispatch('updateLoading', true);
          vm.$http.post(apiUrl, data, {
            headers: {
              Authorization: process.env.API_TOKEN,
              accept: 'application/json',
            },
          }).then(() => {
            const alert = {
              isShow: true,
              title: '預定成功!',
              content: '您的預訂已完成，詳細訂房資訊已發送簡訊至您的手機，謝謝您！',
              to: '/',
              status: 'success',
            };
            this.$store.dispatch('alertModules/openAlert', alert);
            vm.$store.dispatch('updateLoading', false);
          }).catch(() => {
            const alert = {
              isShow: true,
              title: '預定失敗!',
              content: '您的預訂失敗，請再重新預定，謝謝您！',
              to: '/rooms',
              status: 'danger',
            };
            this.$store.dispatch('alertModules/openAlert', alert);
            vm.$store.dispatch('updateLoading', false);
          });
        }
      });
    },
    updateDisabledEnd(newVal) {
      this.$store.dispatch('calendarModules/updateDisabledEnd', newVal);
    },
  },
  computed: {
    ...mapGetters('roomsModules', ['room', 'roomItemBooked']),
    ...mapGetters('calendarModules', ['disabledStart', 'disabledEnd', 'highlighted']),
    ...mapGetters('searchModules', ['selectDateArray']),
  },
  watch: {
    // 監聽
    checkIn(newVal, oldVal) {
      // 若 checkIn 更新值，則將 checkIn 傳給 updateDisabledEnd 更新  disabledEnd
      if (newVal !== oldVal) {
        this.updateDisabledEnd(newVal);
      }
      // 若 checkIn 大於 checkOut 則把 checkOut、holidays、weekdays 清空
      if (new Date(newVal) > new Date(this.checkOut)) {
        this.checkOut = '';
        this.holidays = 0;
        this.weekdays = 0;
        $('.calendar_err').css('display', 'block');
      } else {
        this.calHolidaysandWeekdays();
      }
    },
    checkOut() {
      const vm = this;
      // 若 checkOut 有值則計算平日周末，並把 calendar_err 隱藏
      if (vm.checkOut) {
        vm.calHolidaysandWeekdays();
        $('.calendar_err').css('display', 'none');
      }
    },
  },
  components: {
    Datepicker,
  },
  created() {
    const vm = this;
    if (vm.$route.query.checkIn) {
      vm.checkIn = new Date(Number(vm.$route.query.checkIn));
      vm.checkOut = new Date(Number(vm.$route.query.checkOut));
    }
    vm.roomId = vm.$route.query.roomId;
    vm.getRoomItem(vm.roomId);
    // 初始化 disabledEnd
    vm.updateDisabledEnd();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.checkorder {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 6.5rem - 14rem);
  padding: 3rem 0;
  @include desktop {
    padding: 3rem 2rem;
  }
  @include mobile-horizontal {
    text-align: center;
    padding: 1rem 2rem;
  }
  @include mobile-l {
    padding: 1rem 1rem;
  }
  p {
    margin: 0.5rem 0;
  }
}

.checkorder_subtitle {
  margin: 0 0.5rem;
  font-size: $font-l;
  font-weight: bold;
  text-decoration: underline;
  @include mobile-horizontal {
    display: block;
    margin: 1rem;
  }
}

// checkorder_form

.checkorder_form {
  margin: 1.5rem 0;
  @include mobile-horizontal {
    text-align: left;
  }
}

.calendar_err {
  display: none;
  color: $danger;
}

// calendar

@include desktop-s {
  .calendar {
    margin-bottom: 0;
  }
}

>>> .calendar_calendar {
  bottom: 2rem;
}

// checkorder_info

.checkorder_info {
  align-self: flex-end;
  text-align: right;
  @include mobile-horizontal {
    text-align: center;
  }
}

.info_table {
  border-collapse: collapse;
  margin: 0 0 1rem auto ;
  @include mobile-horizontal {
    margin: 0 auto 1rem;
  }
  tbody {
    color: $muted;
  }
  tfoot {
    font-size: $font-xl;
    font-weight: bold;
    td:first-child {
      width: 50%;
    }
  }
  td {
    padding: 0.25rem;
  }
}

.info_btn a, .info_btn button {
  margin-left: 1rem;
  margin-bottom: 1.5rem;
  min-width: 10rem;
  border-radius: $arc-s;
  @include mobile-s {
    margin-bottom: 0.5rem;
  }
}
</style>
