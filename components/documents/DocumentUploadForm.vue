<template>
	<mdb-container>
		<mdb-modal cascade class="text-left" @close="toggleVisibility">
			<form id="documentUploadForm" class="needs-validation" @keydown="stopRKey()" @submit.prevent="fileSubmit()">
				<mdb-modal-header class="primary-color white-text">
					<h4 class="title"><i class="fas fa-3x fa-file-upload" /> Add a Document</h4>
				</mdb-modal-header>
				<mdb-modal-body class="grey-text">
					<div class="input-group mt-3">
						<input id="file_description" v-model="documentForm.description"
							class="form-control border border-left-0"
							aria-label="File Description"
							type="text"
							name="file_description"
							label="File Description"
							placeholder="File Description"
							required>
						<div class="invalid-tooltip">Please enter a file description.</div>
					</div>
					<div class="mt-2">
						<label class="mb-0" for="document_type" aria-label="Select a dataset">Document Type</label>
						<select
							id="document_type"
							class="browser-default custom-select"
							label="document_type"
							name="document_type"
							@change="updateDocumentType"
							required>
							<option value="">Select a Document Type</option>
							<option
								v-for="listItem in documentTypes"
								:selected="listItem == documentForm.type"
								:value="listItem.id"> {{listItem.name}}
							</option>
						</select>
						<div class="invalid-tooltip">Select a document type.</div>
					</div>
					<div v-if="documentForm.type === 'file'" class="mt-3">
						<file-select :validFileTypes="fileTypeValidationList" id="file" v-model="documentForm.file" required></file-select>
						<p v-if="documentForm.file">{{documentForm.file.name}}</p>
						<div class="invalid-tooltip">Select a file.</div>
					</div>
					<div v-else-if="documentForm.type === 'url'" class="mt-3">
						<label class="mb-0" for="url" aria-label="Enter Url">Url:</label>
						<input id="url" v-model="documentForm.url"class="form-control"
							aria-label="Url" type="url" label="url" placeholder="Web page url"
							required>
						<div class="invalid-tooltip">Please enter a valid url.</div>
					</div>

					<!-- Default unchecked -->
					<div class="custom-control custom-checkbox">
						<mdb-input type="checkbox" id="isPrimary" @change="handleCheckboxChange" label="Check to make document source primary."  :checked="documentForm.isPrimary"  />
					</div>
				</mdb-modal-body>
				<mdb-modal-footer>
					<mdb-btn color="warning" @click.native="toggleVisibility">Close</mdb-btn>
					<mdb-btn color="green" :disabled="documentForm.type === 'file' && documentForm.file ==null ">Add Document</mdb-btn>
				</mdb-modal-footer>
			</form>
		</mdb-modal>
	</mdb-container>
</template>

<script>
import {eventBus} from '../../main'
import FileSelect from '@/components/custom_form_components/FileSelect.vue'
import {mapActions, mapState, mapGetters} from 'vuex'
import {mdbInput, mdbContainer, mdbBtn, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter, Row} from 'mdbvue'
import notify from '@/helpers/notification'

export default {
	name: 'DocumentUploadForm',
	components: {
		FileSelect,
		mdbContainer,
		mdbBtn,
		mdbModal,
		mdbModalHeader,
		mdbModalBody,
		mdbModalFooter,
		mdbInput,
	},
	data() {
		return {
			showDocumentFormModal: false,
			fileTypeValidationList: [],
			documentForm: {
				datasetDetailsId: 0,
				currentUser: 0 ,
				description: '',
				file: null,
				url: null,
				isPrimary: true,
				type: ''
			},
		}
	},
	computed: {
		...mapGetters([
			'detailRecordDocuments',
			'selectedRecordId',
			'documentTypes',
			'documentFileTypes',
			'documentSourceTypes',
			'getUser',
		]),

	},
	created() {
		this.getDocFileTypeList().then( (result) => {
			this.fileTypeValidationList = result
		})
	},
	methods: {
		...mapActions([
			'fetchUser',
			'addUser',
			'addDocument',
			'getDocFileTypeList',
			'fetchDocumentsByDetailId',
		]),
		updateDocumentType(e) {
			this.documentForm.type = e.target.value
		},
		handleCheckboxChange(val) {
			this.documentForm.isPrimary = val
		},
		fileSubmit() {
			this.documentForm.datasetDetailsId = this.selectedRecordId
			this.documentForm.currentUser = parseInt(this.getUser.id)

			console.log(this.documentForm)

			var formData = new FormData()
			Object.entries(this.documentForm).forEach(entry => {
				let key = entry[0];
				let value = entry[1];
				formData.set(key, value)
			})
			// update the file element
			console.log(this.documentForm.file)
			if(this.documentForm.type === 'file') {
				let newName = this.documentForm.file.name.split('.')[0]
				let fileExt = this.documentForm.file.name.split('.')[1]
				var newFileName = `${newName}_${Date.now()}.${fileExt}`
				console.log(newFileName)
				formData.set('file', this.documentForm.file, newFileName)
			}

			this.addDocument(formData).then((result)=> {
				console.log(result.status)
				if (result.status === 201) {
					this.fetchDocumentsByDetailId(this.selectedRecordId)
					const message = `Document added successfully.`
					notify.success({
						message,
						timeOut: 5000,
						position: 'bottom right',
					})
					this.toggleVisibility()
				} else {
					const message = `Error adding documents. Please try again ${result.data.message}`
					notify.error({
						message,
						timeOut: 5000,
						position: 'bottom right',
					})
					this.toggleVisibility()
				}
			})
		},
		toggleVisibility() {
			eventBus.$emit('toggleDocumentFormModal', false)
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

<style scoped>
.invalid-tooltip {
	position: relative;
}
</style>
