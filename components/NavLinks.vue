<template>
	<navbar-nav right>
		<nuxt-link v-if="isAdmin" to="/users">
			<navbar-item class="default-color font-weight-bold">
				Users
			</navbar-item>
		</nuxt-link>
		<nuxt-link v-if="isAdmin" to="/allocations">
			<navbar-item class="default-color font-weight-bold">
				Allocations
			</navbar-item>
		</nuxt-link>
		<dropdown tag="li" aria-label="Review" class="nav-item">
			<dropdown-toggle slot="toggle" class="font-weight-bold" tag="a" color="primary" waves-fixed navLink>
				Review
			</dropdown-toggle>
			<dropdown-menu>
				<dropdown-item aria-label="Dashboard">
					<nuxt-link v-if="isAdmin" to="/dashboard">Dashboard</nuxt-link>
					<nuxt-link v-else="isAdmin" to="/dashboard">Reviewer Dashboard</nuxt-link>
				</dropdown-item>
				<dropdown-item aria-label="Review">
					<nuxt-link to="/records">Review Records</nuxt-link>
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
}  from '~/node_modules/mdbvue'

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
	computed: {
		isAdmin() {
			return true
		},
	},
}
</script>
