<template>
	<div class="row justify-content-center">
		<column size="12" class="text-center mb-5">
			<card cascade class="text-left">
				<form
					id="userForm"
					ref="userForm"
					class="needs-validation"
					@keydown="stopRKey()"
					@submit.prevent="trySaveUser"
				>
					<mdb-card-header class="primary-color white-text">
						<h4 class="title">
							<i v-if="userId != 0" class="fa fa-edit"/>
							<i v-if="userId == 0" class="fa fa-user"/>
							{{userId == 0 ? "Add New" : "Edit"}} User
						</h4>
					</mdb-card-header>
					<card-body class="grey-text">
						<div class="input-group mt-3">
							<div class="input-group-prepend">
								<span id="basic-addon" class="input-group-text">
									<i class="fa fa-user prefix"/>
								</span>
							</div>
							<input
								id="first_name"
								v-model="userById.first_name"
								class="form-control border border-left-0 rounded"
								aria-label="First Name"
								type="text"
								name="first_name"
								label="First Name"
								placeholder="First Name"
								required
							>
							<div class="invalid-tooltip">Please enter a first name.</div>
						</div>
						<div class="input-group mt-3">
							<div class="input-group-prepend">
								<span id="basic-addon" class="input-group-text">
									<i class="fa fa-user prefix"/>
								</span>
							</div>
							<input
								id="last_name"
								v-model="userById.last_name"
								class="form-control border border-left-0 rounded"
								aria-label="Last Name"
								type="text"
								name="last_name"
								label="Last Name"
								placeholder="Last Name"
								required
							>
							<div class="invalid-tooltip">Please enter a last name.</div>
						</div>
						<div class="input-group mt-3">
							<div class="input-group-prepend">
								<span id="basic-addon" class="input-group-text">
									<i class="fa fa-envelope prefix"/>
								</span>
							</div>
							<input
								id="email"
								v-model="userById.email"
								class="form-control border border-left-0 rounded"
								aria-label="Email Address"
								type="email"
								name="email"
								label="Email Address"
								placeholder="Email Address"
								required
							>
							<div class="invalid-tooltip">Please enter a valid email address.</div>
						</div>
						<div class="mt-2">
							<label class="mb-0" for="roles" aria-label="User Roles">User Roles</label>
							<multiselect
								placeholder="Select Roles"
								select-label="Click or press enter key to add."
								label="name"
								track-by="name"
								:value="userById.roles"
								:options="roles"
								:multiple="true"
								:searchable="false"
								:allow-empty="false"
								:hide-selected="false"
								:max-height="150"
								:max="6"
								@input="updateSelectedRoles"
							/>
							<div class="invalid-tooltip">Select at least one role per user.</div>
						</div>
						<div class="mt-3">
							<label class="mb-0" for="domains" aria-label="Domains">Domains</label>
							<multiselect
								placeholder="Select Domains"
								select-label="Click or press enter key to add."
								:value="userById.domains"
								:options="domains"
								label="name"
								track-by="name"
								:multiple="true"
								:searchable="true"
								:allow-empty="false"
								:hide-selected="false"
								:max-height="150"
								:max="6"
								@input="updateSelectedDomains"
								@select="updateSelectedDomains"
							/>
							<div class="invalid-tooltip">Select at least one Domain per user.</div>
						</div>
						<!-- Default unchecked -->
						<div class="custom-control custom-checkbox mt-3">
							<input
								id="is_active"
								v-model="userById.is_active"
								type="checkbox"
								aria-label="User is Active"
								class="custom-control-input"
								name="is_active"
								value="true"
							>
							<label class="custom-control-label" for="is_active">Check to make user active</label>
						</div>
					</card-body>
					<mdb-card-footer>
						<btn color="warning" @click.native="cancel">Cancel</btn>
						<btn color="green">{{userId == 0 ? "Add New User" : "Save"}}</btn>
					</mdb-card-footer>
				</form>
			</card>
		</column>
	</div>
</template>

<script>
import {eventBus} from '../../main'
import {mapActions, mapGetters} from 'vuex'
import Multiselect from 'vue-multiselect'
import {Btn, Card, CardBody, Column, mdbCardFooter, mdbCardHeader} from 'mdbvue'
import notify from '@/helpers/notification'



export default {
	name: 'UserForm',
	components: {
		Card,
		CardBody,
		mdbCardHeader,
		mdbCardFooter,
		Column,
		Btn,
		Multiselect,
	},
	props: ['userId'],
	data() {
		return {
			userById: {
				id: 0,
				first_name: '',
				last_name: '',
				email: '',
				description: '',
				is_active: false,
				roles: [],
				domains: '',
				expertise: '',
				sources: '',
				date_created: '',
			},
			cachedUser: {},
			roles: [
				{id: 'ROLE_REVIEWER', name: 'Reviewer'},
				{id: 'ROLE_ADMIN', name: 'Admin'},
			],
			showModal: false,
		}
	},
	computed: {
		...mapGetters(['domains', 'sources', 'expertises', 'getUser']),
	},
	created() {
		this.fetchUser(this.userId)
		const userByIdString = JSON.stringify(this.$store.state.users.userById)
		this.userById = JSON.parse(userByIdString)
		delete this.userById.links
		this.cachedUser = this.$store.state.users.userById
	},
	methods: {
		...mapActions([
			'fetchUser',
			'fetchUsers',
			'fetchDomains',
			'fetchSources',
			'fetchExpertise',
			'saveUser',
		]),
		cancel(ev) {
			ev.preventDefault()
			const eventData = {
				userId: this.userId,
				selectedView: 'UserGrid',
			}
			eventBus.$emit('showUserForm', eventData)
		},
		updateSelectedRoles(value) {
			this.userById.roles = value
		},
		updateSelectedDomains(value) {
			this.userById.domains = value
		},
		trySaveUser(event) {
			this.updateSelectedDomains(this.userById.domains)
			event.target.classList.add('was-validated')
			if (this.userById.email.indexOf('@epa.gov') < 0) {
				return false
			}
			// call this to create a new user
			if (this.userById.id === '') {
				delete this.userById.id
			}
			this.userById.create_by = parseInt(this.getUser.id)
			this.userById.modify_by = parseInt(this.getUser.id)

			this.saveUser(this.userById).then( response => {
				if(response.data) {
					notify.success({message: 'User saved successfully', position:'bottom right', timeOut: 5000})
					const eventData = {
						userId: response.data.userId,
						selectedView: 'UserGrid',
					}
					eventBus.$emit('showUserForm', eventData)
				} else {
					notify.alert({message: response, position:'bottom right', timeOut: 5000})
				}
			})
			return true
		},
		stopRKey() {
			if (event.keyCode === 13) {
				event.stopPropagation()
				event.stopImmediatePropagation()
				event.preventDefault()
				return false
			}
		},
	},
}
</script>
<style src='vue-multiselect/dist/vue-multiselect.min.css'></style>
<style scoped>
.card-cascade {
	width: 900px
}

.invalid-tooltip {
	position: relative
}
</style>
