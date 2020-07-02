<template>
  <div class="container row checkorder">
    <loading :active.sync="isLoading" :is-full-page="true"
     :z-index="999" :background-color="'#000'">
      <template slot="before">
        <span class="loading">LOFT</span>
      </template>
      <template slot="default">
        <span class="loading"><i class="fas fa-bahai fa-spin"></i></span>
      </template>
      <template slot="after">
        <span class="loading">HOME</span>
      </template>
    </loading>

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
               :format="'dd/MM/yyyy'"
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
               :format="'dd/MM/yyyy'"
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
import $ from 'jquery';
import dayjs from 'dayjs';
import Datepicker from 'vuejs-datepicker';

dayjs().format();

export default {
  data() {
    return {
      room: [],
      roomId: '',
      roomItemBooked: [], // 已預約日期
      // vue-loading-overlay 預設開啟
      isLoading: true,
      // vuejs-datepicker 日曆 highlighted 設定
      highlighted: {
        dates: this.roomBooked,
        includeDisabled: true,
      },
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
      const vm = this;
      const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${id}`;
      vm.$http.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((res) => {
        vm.room = res.data.room[0];
        // 已預約日期
        res.data.booking.forEach((item) => {
          vm.roomItemBooked.push(new Date(dayjs(item.date)));
        });
        this.isLoading = false;
        vm.$bus.$emit('message', '資料載入成功');
      }).catch(() => {
        this.isLoading = false;
        const alert = {
          isShow: true,
          title: '錯誤!',
          content: '資料錯誤，請重新載入，謝謝您！',
          to: '/',
        };
        vm.$bus.$emit('alert', alert, 'danger');
      });
    },
    // 計算假日與平日
    calHolidaysandWeekdays() {
      const vm = this;
      vm.holidays = 0;
      vm.weekdays = 0;
      vm.calDateArray.forEach((item) => {
        if (new Date(item).getDay() === 0 || new Date(item).getDay() === 6) {
          vm.holidays += 1;
        } else {
          vm.weekdays += 1;
        }
      });
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
        };
        vm.$bus.$emit('alert', alert, 'danger');
        return;
      }
      this.isLoading = true;
      vm.$refs.form.validate().then((success) => {
        if (success) {
          const apiUrl = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${vm.roomId}`;

          const data = {
            name: vm.name,
            tel: vm.phone,
            date: vm.calDateArray,
          };

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
              to: '/rooms',
            };
            vm.$bus.$emit('alert', alert);
            this.isLoading = false;
          }).catch(() => {
            const alert = {
              isShow: true,
              title: '預定失敗!',
              content: '您的預訂失敗，請再重新預定，謝謝您！',
              to: '/rooms',
            };
            vm.$bus.$emit('alert', alert, 'danger');
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
        }
      });
    },
  },
  computed: {
    // vuejs-datepicker - CheckIn disabled
    disabledStart() {
      const vm = this;
      // 取得今日 23:59:59
      const limitStart = new Date(dayjs().endOf('day'));
      // 取得今天加 3 個月
      const limitEnd = new Date(dayjs().endOf('day').add(3, 'month'));

      return {
        to: limitStart, // 從 ... 以前 disabled
        from: limitEnd, // 從 ... 之後 disabled
        dates: vm.roomItemBooked.map(item => item), // 已預約日期
      };
    },
    // vuejs-datepicker - CheckOut disabled
    disabledEnd() {
      const vm = this;
      let limitStart = '';

      if (vm.checkIn) {
        // 若 checkIn 有值 則取得 checkIn 天
        limitStart = new Date(dayjs(vm.checkIn).startOf('day'));
      } else {
        // 若 checkIn 無值 則取得 今日
        limitStart = new Date(dayjs().endOf('day'));
      }
      // 取得今天加 3 個月
      const limitEnd = new Date(dayjs().endOf('day').add(3, 'month'));

      return {
        to: limitStart, // 從 ... 以前 disabled
        from: limitEnd, // 從 ... 之後 disabled
        dates: vm.roomItemBooked.map(item => item), // 已預約日期
      };
    },
    // 將選擇的日期儲存為陣列
    calDateArray() {
      const vm = this;
      const dateArray = [];
      if (vm.checkIn && vm.checkOut) {
        const start = vm.checkIn.getTime();
        const end = vm.checkOut.getTime();
        const oneDayLong = 1000 * 60 * 60 * 24;
        for (let t = start; t <= end; t += oneDayLong) {
          const time = dayjs(t).startOf('day').format('YYYY-MM-DD');
          dateArray.push(time);
        }
      }
      return dateArray;
    },
  },
  watch: {
    checkIn(newValue) {
      const vm = this;
      // checkIn 若大於 checkOut 則把 checkOut、holidays、weekdays 清空
      if (new Date(newValue) > new Date(vm.checkOut)) {
        vm.checkOut = '';
        vm.holidays = 0;
        vm.weekdays = 0;
        $('.calendar_err').css('display', 'block');
      } else {
        // 計算平日周末
        vm.calHolidaysandWeekdays();
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
  p {
    margin: 0.5rem 0;
  }
}

.checkorder_subtitle {
  margin: 0 0.5rem;
  font-size: $font-l;
  font-weight: bold;
  text-decoration: underline;
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

.calendar {
  position: relative;
}

.calendar_icon {
  position: absolute;
  top: 20%;
  right: 10px;
}

>>> .calendar_input {
  border-radius: $arc-s;
}

>>> .calendar_calendar {
  bottom: 2rem;
  @include mobile-horizontal {
    bottom: auto;
  }
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
