<template>
	<mdb-navbar id="allocationsToolbar" class="blue-grey lighten-4 mt-1 ml-2" reverse>
		<mdb-btn size="sm" outline="default" icon="refresh" class="font-weight-bold" @click.native="selectAll">Select All</mdb-btn>
		<mdb-btn size="sm" outline="default" icon="refresh" class="font-weight-bold" @click.native="clearSelections">Clear</mdb-btn>
		<select id="pageSize" @change="rowLimit" class="form-control"  style="width: 115px; display: inline !important; padding-right: .25em">
			<option v-for="pageSize in pageSizes" :selected="pageSize == selectedPageSize" :value="pageSize">{{ pageSize }} Rows </option>
		</select>
		<navbar-nav right>
			<form class="form">
				<input id="quickFilterInput" class="form-control mr-sm-2" style="width: 150px;" type="text" placeholder="Type text to filter..."
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
	name: 'AllocationToolBar',
	components: {
		mdbNavbar,
		NavbarNav,
		mdbBtn,
	},
	data() {
		return {
			pageSizes: [ 25, 50, 75, 100],
			selectedPageSize: 50,
		}
	},
	created() {
		eventBus.$on('toolbarSetPageSize', (size) => {
			this.onToolbarSetPageSize(size)
		})
	},
	methods: {
		showAllocationForm() {
			const eventData = {
				selectedView: 'AllocationForm',
			}
			eventBus.$emit('showUserForm', eventData)
		},
		onQuickFilterChange(event) {
			eventBus.$emit('toolbarFilter', event.target.value)
		},
		selectAll() {
			eventBus.$emit('toolbarSelectAll')
		},
		clearSelections() {
			eventBus.$emit('toolbarClearSelections')
		},
		rowLimit(ev) {
			this.selectedPageSize = parseInt(ev.target.value)
			eventBus.$emit('toolbarSetPageSize', this.selectedPageSize)
		},
		onToolbarSetPageSize(size) {
			this.selectedPageSize = size
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

#allocationsToolbar {
	width: 96%;
}

.btn-outline-default {
	background-color: aliceblue !important;
}
</style>
