<template>
	<mdb-navbar dark position="top" class="default-color lighten-1" scrolling>
		<mdb-navbar-brand class="med-width white-text">
			<nuxt-link to="/">
				<QCLogo color="white">DataCheck - Enabling Quality Data</QCLogo>
			</nuxt-link>
		</mdb-navbar-brand>
		<navbar-collapse>
			<NavLinks v-if="isLoggedIn" />
			<navbar-nav right>
				<WelcomeLogout v-if="isLoggedIn" />
			</navbar-nav>
			<!-- Search form -->
		</navbar-collapse>
	</mdb-navbar>
</template>

<script>
import QCLogo from '~/components/QCLogo.vue'
import LoginForm from '~/components/LoginForm.vue'
import WelcomeLogout from '~/components/WelcomeLogout.vue'
import NavLinks from '~/components/NavLinks.vue'
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
} from '~/node_modules/mdbvue'

export default {
	name: 'QCHeader',
  components: {
    mdbNavbar,
		NavbarNav,
		NavLinks,
		LoginForm,
		WelcomeLogout,
		QCLogo,
		NavbarCollapse,
		mdbNavbarBrand,
		Column,
		Badge,
		Row,
		Fa,
		Btn,
  },
	data() {
		return {
			isError: false,
		}
	},
	computed: {
		getUser() {
			const user = {
				firstName: 'Freddie',
				lastName: 'Valone',
				id: 1,
			}
		},
		isLoggedIn() {
			return true
		},
	},
	methods: {
		loginError() {
			if (this.isError === true) {
				this.isError = false
			} else {
				this.isError = true
			}
		},
	},
}
</script>


<style scoped>
.navbar {
	height: 52px !important
}
</style>
