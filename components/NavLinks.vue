<template>
	<navbar-nav right>
		<router-link v-if="isAdmin" to="/users">
			<navbar-item class="default-color font-weight-bold">
				Users
			</navbar-item>
		</router-link>
		<router-link v-if="isAdmin" to="/allocations">
			<navbar-item class="default-color font-weight-bold">
				Allocations
			</navbar-item>
		</router-link>
		<dropdown tag="li" aria-label="Review" class="nav-item">
			<dropdown-toggle slot="toggle" class="font-weight-bold" tag="a" color="primary" waves-fixed navLink>
				Review
			</dropdown-toggle>
			<dropdown-menu>
				<dropdown-item aria-label="Dashboard">
					<router-link v-if="isAdmin" to="/dashboard">Dashboard</router-link>
					<router-link v-else="isAdmin" to="/dashboard">Reviewer Dashboard</router-link>
				</dropdown-item>
				<dropdown-item aria-label="Review">
					<router-link to="/records">Review Records</router-link>
				</dropdown-item>
			</dropdown-menu>
		</dropdown>
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
} from 'mdbvue'
import {mapGetters} from 'vuex'

export default {
	name: 'NavLinks',
	components: {
		NavbarItem,
		NavbarNav,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
	},
	computed: mapGetters(['isAdmin']),
}
</script>
