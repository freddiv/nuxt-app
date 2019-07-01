<template>
	<mdb-navbar dark position="top" class="default-color lighten-1" scrolling>
		<mdb-navbar-brand class="med-width white-text">
			<router-link to="/">
				<QCLogo color="white">DataCheck - Enabling Quality Data</QCLogo>
			</router-link>
		</mdb-navbar-brand>
		<navbar-collapse>
			<NavLinks v-if="isLoggedIn" />
			<navbar-nav right>
				<WelcomeLogout v-if="isLoggedIn" :user="getUser" />
				<LoginForm v-else v-on:error="loginError" />
			</navbar-nav>
			<!-- Search form -->
		</navbar-collapse>
	</mdb-navbar>
</template>

<script>
import {mapGetters} from 'vuex'
import QCLogo from './QCLogo.vue'
import LoginForm from './LoginForm.vue'
import WelcomeLogout from './WelcomeLogout.vue'
import NavLinks from './NavLinks.vue'
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
} from 'mdbvue'

export default {
	name: 'QCHeader',
	components: {
		mdbNavbar,
		NavbarNav,
		NavbarCollapse,
		mdbNavbarBrand,
		Column,
		Badge,
		Row,
		Fa,
		Btn,
		QCLogo,
		LoginForm,
		WelcomeLogout,
		NavLinks,
	},
	data() {
		return {
			isError: false,
		}
	},
	computed: {
		...mapGetters(['getUser']),

		isLoggedIn() {
			return this.$store.getters.isLoggedIn
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
