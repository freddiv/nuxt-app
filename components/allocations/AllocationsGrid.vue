<template>
	<div style="width: 100%; height:100%;">
		<mdb-container  v-if="showConfirmation">
			<mdb-modal @close="showConfirmation = false">
				<mdb-modal-header>
					<mdb-modal-title>{{confirmationTitle}}</mdb-modal-title>
				</mdb-modal-header>
				<mdb-modal-body>{{confirmationText}}</mdb-modal-body>
				<mdb-modal-footer>
					<mdb-btn color="yellow" @click.native="showConfirmation = false"> Cancel </mdb-btn>
					<mdb-btn color="primary" @click.native="removeAllocation">Remove Allocation</mdb-btn>
				</mdb-modal-footer>
			</mdb-modal>
		</mdb-container>

		<ag-grid-vue v-if="allocationColumnDefs.length > 0 && allocationsList.length > 0" ref="recordAllocationGrid" v-bind:style="gridSize"
			class="ag-theme-balham"
			:gridOptions="gridOptions"
			:rowData="allocationsList"
			:defaultColDef="defaultColDef"
			:columnDefs="allocationColumnDefs"
			:suppressRowClickSelection="true"
			sortable="true"
			resizable="true"
			filterable="true"
			rowSelection="multiple"
			pagination="true"
			:paginationPageSize="paginationPageSize"
			@cell-clicked="onCellClicked"
			@model-changed="onModelReady"
			@component-state-changed="onComponentChanged"
			@grid-ready="onGridReady" />

		<mdb-card v-else class="card-body" style="width: 22rem; margin-top: 1rem;">
			<mdb-card-title>No Allocations Assigned</mdb-card-title>
			<mdb-card-text>Please click the "Allocate Records" button to create allocations</mdb-card-text>
		</mdb-card>
	</div>
</template>

<script>
import {eventBus} from '../../main'
import {AgGridVue} from 'ag-grid-vue'
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbContainer, mdbCard, mdbCardTitle, mdbCardText, } from 'mdbvue';
import {mapActions, mapGetters} from 'vuex'
import RenderTrashLink from '../../cell_renderers/RenderTrashLink'
import RenderListArray from '@/cell_renderers/RenderListArray'
import RenderObjArray from '@/cell_renderers/RenderObjArray'
import notify from '@/helpers/notification'



const GRID_KEY = 'recordAllocationGrid-config'
const gridStore = {
	fetch() {
		var savedGridConfig = JSON.parse(localStorage.getItem(GRID_KEY)) || ''
		return savedGridConfig
	},
	save(gridConfig) {
		localStorage.setItem(GRID_KEY, gridConfig)
	},
}

export default {
	name: 'RecordAllocationGrid',
	components: {
		AgGridVue,
		RenderTrashLink,
		RenderListArray,
		RenderObjArray,
		mdbModal,
		mdbModalHeader,
		mdbModalTitle,
		mdbModalBody,
		mdbModalFooter,
		mdbBtn,
		mdbContainer,
		mdbCard,
		mdbCardTitle,
		mdbCardText,
	},
	data() {
		return {
			showConfirmation: false,
			allocationId: 0,
			paginationPageSize: 100,
			selectedRecords: [],
			gridSize: {
				width: '95%',
				height: '70%',
			},
			defaultColDef: {
				width: 100,
				editable: false,
				sortable: true,
				resizable: true,
				filter: true,
			},
			gridOptions: null,
			gridApi: null,
			columnApi: null,
			userGridConfig: gridStore.fetch(GRID_KEY) || '',
		}
	},
	computed: {
		...mapGetters(['recordsList', 'unallocatedRecordsList', 'allocationColumnDefs', 'allocationsList']),
		gridRef() {
			return this.gridApi
		},
		confirmationTitle() {
			let titleText = 'Verify Allocation Removal'

			return titleText
		},
		confirmationText() {
			let confirmationText = 'Are you sure you want to remove the remaining records from this allocation?'

			return confirmationText
		},
	},
	created() {
		this.fetchAllocations()
	},
	beforeMount() {
		this.gridOptions = {};
	},
	mounted() {
		this.gridApi = this.gridOptions.api
		this.gridColumnApi = this.gridOptions.columnApi

		window.addEventListener('resize', this.handleResize)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		...mapActions(['fetchDatasetRecords', 'clearAllocation', 'fetchAllocations']),
		onGridReady(params) {
			this.gridOptions.api.sizeColumnsToFit()
			this.gridComponent = this.$refs.recordAllocationGrid
			this.handleResize()
		},
		onModelReady(params) {
		//	console.log('model-ready')
		},
		onComponentChanged() {
			this.gridOptions.api.sizeColumnsToFit()
		},
		handleResize() {
			this.gridOptions.api.sizeColumnsToFit()
		},
		onToolbarClearSelection() {
			this.gridApi.deselectAll()
			this.selectedRecords = []
			this.getPageDisplayedRows()
		},
		onCellClicked(params) {
			if (params.colDef.field === 'allocationId') {
				this.allocationId = params.value
				this.showConfirmation = true
			}
		},
		removeAllocation(){
			this.clearAllocation(this.allocationId).then( (response) => {
				if(response) {
					notify.success({message: 'Allocation removed successfully', position:'bottom right', timeOut: 5000})
					this.fetchAllocations()
				} else {
					notify.error({message: response.message, position:'bottom right', timeOut: 5000})
				}
				this.showConfirmation = false
			})
		},

	},
}

</script>

<style lang="scss">
.domains {
	margin: 4px 0px 1px 0px;
	padding: 5px 0px 5px 0px !important;
	display:block;
}
.listContainer {
	align-items: top;
	margin:  2px !important;
	width: 90%;
	height: 100%;
	overflow-y: auto;

	.badge {
		height:        15px;
		margin-bottom: 5px !important;
		padding-top:   4px;
		width:         95%;
	}
}
</style>
