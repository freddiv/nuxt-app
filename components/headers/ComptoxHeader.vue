<template>
  <mdb-navbar dark class="default-color lighten-1">
    <mdb-navbar-brand class="med-width white-text">
      <nuxt-link to="/">
        <img src="~/assets/images/epa_logo_281.png" />
      </nuxt-link>
    </mdb-navbar-brand>
    <navbar-collapse>
      <NavLinks />
      <mdb-navbar-nav right>
        <!-- Search form -->
      </mdb-navbar-nav>
    </navbar-collapse>
  </mdb-navbar>
</template>

<script>
import NavLinks from "~/components//headers/NavLinks.vue";
import {
  Badge,
  Btn,
  Column,
  Fa,
  mdbNavbar,
  mdbNavbarBrand,
  NavbarCollapse,
  NavbarNav,
  Row,
  mdbNavbarNav
} from "~/node_modules/mdbvue";

export default {
  name: "ComptoxHeader",
  components: {
    mdbNavbar,
    NavbarNav,
    NavLinks,
    NavbarCollapse,
    mdbNavbarBrand,
    mdbNavbarNav,
    Column,
    Badge,
    Row,
    Fa,
    Btn
  },
  data() {
    return {
      enterClass: true,
      mainClass: false,
      isError: false
    };
  },
  computed: {},
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    setTimeout(function() {
      window.scroll({
        top: 90,
        left: 100,
        behavior: "smooth"
      });
    }, 1000);
  },
  methods: {
    loginError() {
      if (this.isError === true) {
        this.isError = false;
      } else {
        this.isError = true;
      }
    },
    handleScroll() {
      console.log(window.scrollY);
      if (window.scrollY < 90 && this.mainClass === true) {
        console.log("moved up");
        this.moveNav();
      } else if (window.scrollY >= 90 && this.mainClass === false) {
        this.moveNav();
        console.log("moved down");
      }
    },
    moveNav() {
      /*       if (this.enterClass === true) {
        this.enterClass = false;
      } else {
        this.navcenterClasslass = true;
      }
      if (this.mainClass === true) {
        this.mainClass = false;
      } else {
        this.mainClass = true;
      } */
    }
  }
};
</script>


<style scoped>
.navbar {
  margin-top: 0px;
  height: 52px !important;
}
.navbar-main {
  margin-top: 0px;
  height: 52px !important;
}
</style>
