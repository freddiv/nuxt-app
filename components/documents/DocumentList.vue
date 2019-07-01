<template>
	<mdb-container>
		<mdb-modal v-if="showConfirmModal" @close="showConfirmModal = false">
			<mdb-modal-header>
				<mdb-modal-title>{{confirmationTitle}}</mdb-modal-title>
			</mdb-modal-header>
			<mdb-modal-body>{{confirmationText}}</mdb-modal-body>
			<mdb-modal-footer>
				<mdb-btn color="yellow" @click.native="showConfirmModal = false"> Cancel </mdb-btn>
				<mdb-btn color="primary" @click.native="removeAssociation">{{buttonText}}</mdb-btn>
			</mdb-modal-footer>
		</mdb-modal>
		<mdb-card v-if="detailRecordDocuments">
			<mdb-card-body>
				<mdb-card-title>Supporting Documents
					<mdb-tooltip :options="{placement: 'top'}">
						<div class="tooltip"> Add a Document</div>
						<i @click="showFileUpload" slot="reference" class="fas fa-2x fa-file-upload green-text ml-5" />
					</mdb-tooltip>
				</mdb-card-title>
				<mdb-list-group>
					<mdb-list-group-item v-for="doc in detailRecordDocuments" :action="true">
						<mdb-row class="w-100">
							<mdb-col col="1">
								<i v-if="doc.type != 'URL'" @click="openLink(doc)" :class="iconType(doc.type)"></i>
								<img v-else @click="openLink(doc)" style="margin-left: -5px !important; width:35px; height: 35px;" src="../../assets/html_icon.png">

							</mdb-col>
							<mdb-col col="9">
								<div>
									<mdb-badge color="primary-color" v-if="doc.primaryDoc" class="mr-1" style="width: 20px; height: 19px; margin-top: 0px !important;padding-top: 0px !important;"><p class="font-weight-bold h5"><small> * </small></p></mdb-badge>
									<a @click="openLink(doc)">{{ doc.name }}</a>
								</div>

							</mdb-col>
							<mdb-col col="2">
								<mdb-tooltip :options="{placement: 'top'}">
									<div class="tooltip">Unlink this document.</div>
									<i @click="showUnlink(doc)" slot="reference" class="fas fa-unlink red-text mr-0 float-right"></i>
								</mdb-tooltip>
							</mdb-col>
						</mdb-row>
					</mdb-list-group-item>
				</mdb-list-group>
			</mdb-card-body>
		</mdb-card>
	</mdb-container>
</template>

<script>
import {
		mdbListGroup,
		mdbListGroupItem,
		mdbContainer,
		mdbBtn,
		mdbModal,
		mdbModalHeader,
		mdbModalBody,
		mdbModalFooter,
		mdbModalTitle,
		mdbCard,
		mdbCardBody,
		mdbCardTitle,
		mdbTooltip,
		mdbRow,
		mdbCol,
		mdbIcon,
		mdbBadge, } from 'mdbvue'
import {mapActions, mapGetters, mapState} from 'vuex'
import {eventBus} from '@/main'

export default {
	name: 'DocumentList',
	components: {
		mdbListGroup,
		mdbListGroupItem,
		mdbCard,
		mdbCardBody,
		mdbCardTitle,
		mdbContainer,
		mdbBtn,
		mdbModal,
		mdbModalHeader,
		mdbModalTitle,
		mdbModalBody,
		mdbModalFooter,
		mdbTooltip,
		mdbRow,
		mdbCol,
		mdbIcon,
		mdbBadge,
	},
	data () {
		return {
			unlinkDoc: null,
			showConfirmModal: false,
		}
	},
	computed: {
		...mapGetters([
			'detailRecordDocuments',
			'selectedRecordId',
		]),
		confirmationTitle() {
			let titleText = 'Unlink Document from Record'

			return titleText
		},
		confirmationText() {
			let confirmationText = `Are you sure you want to remove this record's association with the selected document?`

			return confirmationText
		},
		buttonText() {
			let buttonText = 'Unlink Document'
			return buttonText
		}

	},
	mounted() {

	},
	methods: {
		...mapActions([
			'fetchDocumentsByDetailId',
			'removeDocumentAssociation',
		]),
		showFileUpload(){
			eventBus.$emit('toggleDocumentFormModal', true)
		},
		showUnlink(doc){
			this.unlinkDoc = doc
			this.showConfirmModal = true
		},
		openLink(doc) {
			const specs = `width=700, height=500, menubar=no, resizable=yes, scrollbars=yes, status=no, titlebar=no, toolbar=no, top=50, left=800`
			const name = doc.name
			window.open(doc.path, name, specs)
		},
		removeAssociation(){
			const params = {
				documentId: this.unlinkDoc.id,
				datasetDetailId: this.selectedRecordId,
			}
			this.removeDocumentAssociation(params).then((response)=> {
				this.fetchDocumentsByDetailId(this.selectedRecordId)
				this.unlinkDoc = null
				this.showConfirmModal = false
			})

		},
		iconType(name) {
			const fileNameArr = name.split('/')
			const initialFileExtention = fileNameArr[fileNameArr.length-1]
			let iconType = ''
			switch (initialFileExtention) {
				case 'doc':
					iconType = 'far fa-2x  blue-text mr-4 fa-file-word'
					break
				case 'docx':
					iconType = 'far fa-2x  blue-text mr-4 fa-file-word'
					break
				case 'pdf':
					iconType = 'far fa-2x  red-text mr-4 fa-file-pdf'
					break
				case 'txt':
					iconType = 'far fa-2x fa-file-file'
					break
				case 'rtf':
					iconType = 'far fa-2x fa-file-alt'
					break
				case 'tiff':
					iconType = 'far fa-2x  blue-text mr-4 fa-file-image'
					break
				case 'tif':
					iconType = 'far fa-2x  blue-text mr-4 fa-file-image'
					break
				case 'csv':
					iconType = 'far fa-2x  black-text mr-4 fa-file-csv'
					break
				case 'xls':
					iconType = 'far fa-2x  black-text mr-4 fa-file-excel'
					break
				default:
					iconType = 'far fa-2x  black-text mr-4 fa-file-alt'
			}
			const fileIcon = `${iconType}`
			return fileIcon
		}
	}
}
</script>

<style lang="scss" scoped>
ul {
	display: flex;
	align-items: top;
	margin:  2px !important;
	width: 90%;
	height: 100%;

	.badge{
		height: 15px;
		margin-bottom: 5px !important;
		padding-top: 4px;
		width: 90%;

		span {
			text-align: center;
			width: 100%;
		}
	}
}
.list-group-item {
	padding-right:0px !important;
}

</style>