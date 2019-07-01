<template>
	<form id="login-form" ref="form" class="needs-validation" novalidate @submit.prevent="tryLogin">
		<div class="form-row align-items-center">
			<div class="col-md-4">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="fa fa-envelope prefix" />
						</span>
					</div>
					<input id="emailAddress" v-model="userLogin.email" class="form-control"
						aria-label="Email Address" type="email" label="emailAddress" placeholder="Email Address"
						required>
					<div class="invalid-tooltip">Please enter a valid email address.</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="fa fa-lock prefix" />
						</span>
					</div>
					<label for="password" class="sr-only">Password</label>
					<input id="password" v-model="userLogin.password" class="form-control" aria-label="Your password"
						label="Your password" placeholder="Your password" type="password" required>
					<div class="invalid-tooltip">Please enter a password.</div>
				</div>
			</div>
			<div class="col-md-4">
				<mdb-btn type="submit" icon="user" iconClass="pr-2" iconLeft :disabled="isPending">
					<span class="white-text font-weight-bold">Log In</span>
				</mdb-btn>
			</div>
		</div>
	</form>
</template>

<script>
import {mdbBtn} from 'mdbvue'
import {mapActions} from 'vuex'


export default {
	name: 'LoginForm',
	components: {mdbBtn},
	data() {
		return {
			userLogin: {
				email: '',
				password: '',
			},
			isPending: false,
		}
	},
	methods: {
		...mapActions(['login',
			'fetchDomains',
			'fetchSources',
			'fetchExpertise',
			'getQcFlagValues',
			'getQualityFlagValues',
			'getFailureReasons',
			'getDocumentFileTypes',
			'getDocumentTypes',
			'getDocumentSourceTypes',
		]),
		tryLogin(ev) {
			ev.preventDefault()
			ev.target.classList.add('was-validated')
			if (this.$refs.form.checkValidity()) {
				this.isPending = true
				this.login(this.userLogin).then(() => {
					this.$notify.success({message: 'Logged In!', position: 'bottom right', timeOut: 5000})
					this.fetchDomains()
					this.fetchSources()
					this.fetchExpertise()
					this.getQcFlagValues()
					this.getDocumentTypes()
					this.getDocumentFileTypes()
					this.getDocumentSourceTypes()
					this.getQualityFlagValues()
					this.getFailureReasons()
				}).catch(err => {
					this.$notify.error({message: err.message, position: 'bottom right', timeOut: 5000})
				}).finally(() => {
					this.isPending = false
				})
			}
		},
	},
}
</script>
