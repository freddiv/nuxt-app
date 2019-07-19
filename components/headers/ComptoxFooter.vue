<template>
  <Footer color="default-color align-middle">
    <div class="d-flex flex-row justify-content-around w-100 pt-2">
      <nuxt-link to="/about" class="info-ic">
        <mdb-tooltip :options="{placement: 'top'}">
          <span slot="tip">About/Disclaimer</span>
          <i slot="reference" class="fa fa-info-circle white-text mr-md-5 mr-3 fa-3x" />
        </mdb-tooltip>
      </nuxt-link>
      <nuxt-link
        to="https://www.epa.gov/chemical-research/comptox-chemistry-dashboard-help"
        class="info-ic"
      >
        <mdb-tooltip :options="{placement: 'top'}">
          <span slot="tip">Comptox Help</span>
          <i slot="reference" class="far fa-question-circle white-text mr-md-5 mr-3 fa-3x" />
        </mdb-tooltip>
      </nuxt-link>
      <nuxt-link to="/contact" class="info-ic">
        <mdb-tooltip :options="{placement: 'top'}">
          <span slot="tip">Contact us</span>
          <i slot="reference" class="fa fa-at white-text mr-md-5 mr-3 fa-3x" />
        </mdb-tooltip>
      </nuxt-link>
      <nuxt-link to="/downloads" class="info-ic">
        <mdb-tooltip :options="{placement: 'top'}">
          <span slot="tip">Downloads</span>
          <i slot="reference" class="fas fa-file-download white-text mr-md-5 mr-3 fa-3x" />
        </mdb-tooltip>
      </nuxt-link>
    </div>
  </Footer>
</template>


<script>
import { Footer, mdbTooltip } from "~/node_modules/mdbvue";

export default {
  name: "ComptoxFooter",
  components: {
    Footer,
    mdbTooltip
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    isError() {
      return this.error;
    },
    isLoggedIn() {
      return true;
    }
  },
  methods: {
    close() {}
  },
  onRender() {}
};
</script>

<style scoped>
footer {
  height: 65px !important;
}
</style>
