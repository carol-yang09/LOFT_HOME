<template>
  <div>
    <!-- Navbar -->
    <div class="navbar-wrap">
      <nav class="container navbar">
        <router-link to="/" class="logo" href="#">LOFT HOME</router-link>
        <ul class="nav" :class="{'active': isMenuOpen}">
          <li @click.prevent="isMenuOpen = false">
            <router-link to="/about" class="nav_link">ABOUT US</router-link>
          </li>
          <li @click.prevent="isMenuOpen = false">
              <router-link to="/rooms" class="nav_link">ROOMS</router-link>
          </li>
          <li @click.prevent="isMenuOpen = false">
            <router-link to="/contact" class="nav_link">CONTACT</router-link>
          </li>
          <li>
            <router-link to="/rooms" class="btn btn-l btn-outline-primary nav_btn">
              BOOK NOW
            </router-link>
          </li>
        </ul>
        <div>
          <a href="#" class="nav_ham" @click.prevent="isMenuOpen = !isMenuOpen">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
      </nav>
    </div>

    <!-- Content -->
    <div class="content">
      <router-view/>
    </div>

    <!-- Footer -->
    <div class="footer">
      <ul class="container">
        <li class="footer_info">
          <router-link to="/" class="logo" href="#">LOFT HOME</router-link>
          <ul class="footer-info">
            <li>台北市中山區長春路777號3樓</li>
            <li>Mail: lofthome@mail.com</li>
            <li>Tel: +886 2 2777-77772</li>
          </ul>
        </li>
        <li class="footer_info">
          <ul class="social-media">
            <li>
              <a href="#">
                <span class="fa-stack" style="vertical-align: top;">
                  <i class="far fa-circle fa-stack-2x"></i>
                  <i class="fab fa-facebook-f fa-stack-1x"></i>
                </span>
              </a>
            </li>
            <li>
              <a href="#"><i class="fab fa-instagram fa-2x"></i></a></li>
            <li>
              <a href="#"><i class="fab fa-tripadvisor fa-2x"></i></a></li>
          </ul>
          <span class="copyright">Copyright &copy; 2020 LOFT HOME</span>
        </li>
      </ul>
    </div>
    <Alert/>
    <Message/>
  </div>
</template>

<script>
import Alert from '@/components/Alert';
import Message from '@/components/Message';

export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  components: {
    Alert,
    Message,
  },
  created() {
    this.isMenuOpen = false;
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_mixin.scss';
@import '@/assets/_variable.scss';

// navbar

.navbar-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  background-color: $white;
  z-index: 99;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 0;
  @include desktop {
    padding: 1rem;
  }
  @include pad {
    padding: 0.25rem 0.5rem;
  }
}

.logo {
  display: block;
  width: 106px;
  height: 72px;
  margin-right: auto;
  background-image: url('../assets/logo.svg');
  text-indent: 101%;
  overflow: hidden;
  white-space: nowrap;
  @include pad {
    background-size: 80% 100%;
    background-repeat: no-repeat;
  }
}

.nav {
  display: flex;
  align-items: center;
  text-align: center;
  @include pad {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 5rem;
    right: 0;
    left: 0;
    li {
      width: 100%;
    }
  }
  &.active {
    display: flex;
  }
}

.nav_link {
  padding: 0.5rem 1.5rem;
  color: $dark;
  font-size: $font-m;
  &:hover, &:focus {
    color: $primary;
  }
  &:active {
    color: darken($primary, 20%);
  }
  @include pad {
    display: block;
    width: 100%;
    padding: 1rem 0;
    background-color: $primary;
    border-bottom: 1px solid $white;
    &:hover, &:focus, &:active {
      color: $white;
      background-color: darken($primary, 20%);
    }
  }
}

.nav_btn {
  border-radius: $arc-m;
  @include pad {
    display: none;
  }
}

.nav_ham {
  display: none;
  padding: 0.5rem 1rem;
  border: 1px solid $dark;
  border-radius: $arc-m;
  font-size: 1.5rem;
  @include pad {
    display: block;
  }
}

// contant
.content {
  margin-top: 6.5rem;
  min-height: calc(100vh - 6.5rem - 14rem);
  @include pad {
    margin-top: 5rem;
    min-height: calc(100vh - 5.5rem - 20rem);
  }
}

// footer
.footer {
  background-color: $secondary;
  padding: 2.5rem 0;
  @include desktop {
    padding: 2.5rem 1rem;
    text-align: center;
  }
  .logo {
    margin-right: 9rem;
    @include mobile-l {
      margin-right: 0;
      margin-bottom: 0.5rem;
    }
  }
}

.footer_info {
  display: flex;
  margin-bottom: 1.5rem;
  font-weight: lighter;
  @include mobile-l {
    flex-direction: column;
    align-items: center;
  }
  li {
    margin-bottom: 0.5rem;
  }
  &:last-child {
    justify-content: space-between;
    margin-bottom: 0;
  }
}

.social-media {
  display: flex;
  a {
    display: inline-block;
    margin-right: 0.5rem;
    &:hover {
      transform: scale(1.1);
      color: darken($primary, 20%);
    }
  }
}

.copyright {
  color: $muted;
  font-weight: lighter;
}

</style>
