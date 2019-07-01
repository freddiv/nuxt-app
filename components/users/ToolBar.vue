<template>
	<mdb-navbar id="userToolbar" class="blue-grey lighten-4 mt-1" reverse>
		<mdb-btn size="sm" outline="default" icon="user-plus" class="font-weight-bold" @click.native="showUserForm"> Add
			User
		</mdb-btn>
		<navbar-nav right>
			<form class="form-inline">
				<input id="quickFilterInput" class="form-control mr-sm-2" type="text" placeholder="Type text to filter..."
					aria-label="Search" @keyup="onQuickFilterChange">
			</form>
		</navbar-nav>
	</mdb-navbar>
</template>

<script>
import {eventBus} from '../../main'
import {
	mdbNavbar,
	NavbarItem,
	NavbarNav,
	mdbBtn,
} from 'mdbvue'

export default {
	name: 'UserToolBar',
	components: {
		mdbNavbar,
		NavbarNav,
		mdbBtn,
	},
	data() {
		return {}
	},
	methods: {
		showUserForm() {
			const eventData = {
				userId: 0,
				selectedView: 'UserForm',
			}
			eventBus.$emit('showUserForm', eventData)
		},
		onQuickFilterChange(event) {
			eventBus.$emit('toolbarFilter', event.target.value)
		},
		resetGrid() {

		},
	},
}

</script>

<style scoped>
.btn.btn-sm {
	padding:          0.5rem .6rem;
	background-color: aliceblue;
}

.navbar {
	margin-top:       25px;
	margin-bottom:    25px;
	background-color: darkgrey;
}

#userToolbar {
	width: 100%;
}

.btn-outline-default {
	background-color: aliceblue !important;
}
</style>
