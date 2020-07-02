<template>
  <div>
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

      <div class="banner_cover">
        <div class="banner_cover_item">
          <h2>LOFT<span>HOME</span></h2>
          <router-link to="/rooms" class="btn btn-l btn-dark">
            Go Booking
          </router-link>
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
          <router-link href="#" class="col-4" v-for=" room in rooms" :key="room.id"
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
import $ from 'jquery';

export default {
  data() {
    return {
      rooms: [],
      // vue-loading-overlay 預設開啟
      isLoading: true,
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
      const vm = this;
      const apiUrl = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms';
      vm.$http.get(apiUrl, {
        headers: {
          Authorization: process.env.API_TOKEN,
          accept: 'application/json',
        },
      }).then((response) => {
        vm.rooms = response.data.items;
        this.isLoading = false;
        vm.$bus.$emit('message', '資料載入成功');
      }).catch(() => {
        this.isLoading = false;
        vm.$bus.$emit('message', '糟糕~ 出錯了!', 'danger');
      });
    },
  },
  created() {
    const vm = this;
    vm.getRooms();
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
}

.banner_cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 50%;
  left: 0;
  z-index: 2;
  background-color: rgba($primary, 0.5);
  text-align: center;
  @include mobile-horizontal {
    right: 0;
  }
}

.banner_cover_item {
  color: $white;
  font-size: $font-xxxl;
  h2 {
    margin: 0;
  }
  span {
    display: block;
  }
  a {
    border-radius: $arc-m;
    @include mobile-horizontal {
      display: none;
    }
  }
}

.scroll-btn {
  position: absolute;
  bottom: 1rem;
  right: 0;
  left: 0;
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
