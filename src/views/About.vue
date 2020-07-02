<template>
  <div class="container about">
    <ul class="about_intro">
      <li class="intro_img"></li>
      <ul class="intro_info">
        <li class="intro_info_title">LOFT HOME</li>
        <li>
          LOFT HOME 位於台北市區，我們以「舒適、溫馨、放鬆」為核心，希望能在擾攘喧囂的都市叢林中，
          打造一個身心靈放鬆的休憩處，不論何處的旅人都可以暫停腳步，享受當下的簡單寧靜的幸福。
        </li>
      </ul>
    </ul>
    <div class="row">
      <div class="col-4">
        <div class="effect" @click.prevent="toggleCarousel()">
          <div class="effect_img effect_img-1"></div>
          <div class="effect_rect">
            <p class="effect_rect_text">交誼廳</p>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="effect" @click.prevent="toggleCarousel()">
          <div class="effect_img effect_img-2"></div>
          <div class="effect_rect">
            <p class="effect_rect_text">餐廳</p>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="effect" @click.prevent="toggleCarousel()">
          <div class="effect_img effect_img-3"></div>
          <div class="effect_rect">
            <p class="effect_rect_text">室外泳池</p>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel" v-show="isCarouselShow">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide>
          <img src="../assets/images/hotel_1.jpg">
        </swiper-slide>
        <swiper-slide>
          <img src="../assets/images/hotel_2.jpg">
        </swiper-slide>
        <swiper-slide>
          <img src="../assets/images/hotel_3.jpg">
        </swiper-slide>
        <div class="swiper-pagination swiper-pagination-custom" slot="pagination"></div>
        <div class="swiper-button-prev swiper-button-custom" slot="button-prev"></div>
        <div class="swiper-button-next swiper-button-custom" slot="button-next"></div>
      </swiper>
      <a href="#" class="carousel_toggle-icon" @click.prevent="toggleCarousel()">
        <i class="fas fa-times-circle"></i>
      </a>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      isCarouselShow: false,
      // vue-awesome-swiper 設定
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination-custom',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  methods: {
    toggleCarousel() {
      if (this.isCarouselShow) {
        this.isCarouselShow = false;
        $('body').css('overflow', 'auto');
      } else {
        this.isCarouselShow = true;
        $('body').css('overflow', 'hidden');
      }
      $('.carousel').fadeToggle();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

.about {
  padding: 1rem 0 2.5rem;
  @include desktop {
    padding: 1rem 2rem 2.5rem 2rem;
  }
  @include mobile-l {
    padding: 1rem 1rem 2.5rem 1rem;
  }
}

// about_intro

.about_intro {
  position: relative;
  margin-bottom: 3rem;
  &:hover {
    .intro_img {
      opacity: 0.8;
    }
    .intro_info {
      right: 2rem;
      @include mobile-horizontal {
        right: 0;
      }
    }
  }
  @include mobile-horizontal {
    margin-bottom: 1rem;
  }
}

.intro_img {
  max-width: 70%;
  min-height: 22rem;
  background: transparent url('../assets/images/about_1.jpg') center 58% no-repeat;
  transition: all 0.4s ease;
  @include mobile-horizontal {
    max-width: 100%;
  }
  @include mobile-m {
    min-height: 16rem;
  }
}

.intro_info {
  position: absolute;
  top: 5rem;
  right: 0;
  max-width: 40%;
  padding: 2.5rem 3rem;
  background-color: rgba($secondary, 0.6);
  transition: all 0.4s ease;
  line-height: 1.75rem;
  @include mobile-horizontal {
    position: relative;
    top: 0;
    max-width: 100%;
    background-color: $secondary;
  }
  @include mobile-m {
    padding: 1.5rem 1rem;
  }
}

.intro_info_title {
  margin-bottom: 1rem;
  color: darken($primary, 40%);
  font-size: $font-l;
  letter-spacing: 0.2rem;
  @include mobile-m {
    margin-bottom: 0.5rem;
  }
}

.effect_img-1 {
  background-image: url('../assets/images/hotel_1.jpg');
}

.effect_img-2 {
  background-image: url('../assets/images/hotel_2.jpg');
}

.effect_img-3 {
  background-image: url('../assets/images/hotel_3.jpg');
}

// carousel

.carousel {
  background-color: rgba($dark, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  text-align: center;
  img {
    margin-top: 2rem;
    max-height: calc(100vh - 4rem - 2rem);
  }
}

.swiper {
  margin: 2rem 0;
  max-height: calc(100vh - 4rem);
}

.carousel_toggle-icon {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 2rem;
  margin: 1rem;
  color: $white;
  z-index: 100;
  &:hover {
    color: $primary;
  }
}

</style>
