<template>
  <navbar-nav right>
    <template v-for="link in links">
      <nuxt-link v-if="!link.hasDropdown" :to="link.url">
        <navbar-item class="default-color font-weight-bold">{{link.name}}</navbar-item>
      </nuxt-link>
      <dropdown v-if="link.hasDropdown" tag="li" :aria-label="link.name" class="nav-item">
        <dropdown-toggle
          slot="toggle"
          class="font-weight-bold"
          tag="a"
          color="primary"
          waves-fixed
          navLink
        >{{link.name}}</dropdown-toggle>
        <dropdown-menu>
          <dropdown-item
            v-for="child in link.children"
            v-bind:key="child.name"
            :aria-label="child.name"
          >
            <nuxt-link :to="child.url">{{child.name}}</nuxt-link>
          </dropdown-item>
        </dropdown-menu>
      </dropdown>
    </template>
  </navbar-nav>
</template>

<script>
import {
  NavbarItem,
  NavbarNav,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  mdbNavbarToggler,
  mdbNavItem,
  mdbDropdown,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbInput,
  mdbDropdownItem
} from "~/node_modules/mdbvue";

export default {
  name: "NavLinks",
  components: {
    NavbarItem,
    NavbarNav,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    mdbNavbarToggler,
    mdbNavItem,
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbDropdownItem
  },
  data() {
    return {
      burgerExpand: false,
      gsid: null,
      chemname: null,
      result: null,
      share: false,
      homePage: true,
      currentUrl: "${process.env.baseUrl}",
      links: [
        {
          name: "Home",
          url: `/`,
          hasDropdown: false
        },
        {
          name: "Search",
          url: `/advancedSearch`,
          hasDropdown: false
        },
        {
          name: "Batch Search",
          url: `/batch-search`,
          hasDropdown: false
        },
        {
          name: "Lists",
          url: "",
          hasDropdown: true,
          children: [
            {
              name: "Lists of Chemicals",
              url: `/chemical-lists`
            },
            {
              name: "List of Assays",
              url: `/assay-endpoints`
            }
          ]
        },
        {
          name: "Predictions",
          url: `/predictions`,
          hasDropdown: false
        },
        {
          name: "Downloads",
          url: `/downloads`,
          hasDropdown: false
        }
      ],
      shareSites: [
        {
          name: "Facebook",
          icon: "facebook-official",
          baseUrl: "https://www.facebook.com/sharer/sharer.php?u="
        },
        {
          name: "Twitter",
          icon: "twitter",
          baseUrl: "https://twitter.com/home?status="
        },
        {
          name: "Google Plus",
          icon: "google-plus",
          baseUrl: "https://plus.google.com/share?url="
        }
      ]
    };
  },
  computed: {
    isAdmin() {
      return true;
    }
  }
};
</script>
