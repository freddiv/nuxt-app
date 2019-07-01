<template>
	<div style="width: 100%; height:100%;">
		<ag-grid-vue :ref="gridRefString" v-bind:style="gridSize"
			class="ag-theme-balham"
			:gridOptions="gridOptions"
			:rowData="dataProp"
			:defaultColDef="defaultColDef"
			:columnDefs="gridConfig"
			@model-updated="onModelUpdated"
			@first-data-rendered="onModelUpdated"
			@selection-changed="onSelectionChanged"
			@grid-ready="onGridReady"
			@cell-clicked="onCellClicked"
			:suppressRowClickSelection="false"
			:sorting="true"
			:filter="true"
			rowSelection="single" />
	</div>
</template>

<script>
import {eventBus} from '@/main'
import {AgGridVue} from 'ag-grid-vue'
import { mdbContainer } from 'mdbvue'
import router from '@/router'
import {mapActions, mapGetters, mapState} from 'vuex'
import EditUserLink from '@/cell_renderers/EditUserLink'
import RenderListArray from '@/cell_renderers/RenderListArray'
import RenderTrashLink from '@/cell_renderers/RenderTrashLink'
import RenderReviewLink from '@/cell_renderers/RenderReviewLink'
import RenderObjArray from '@/cell_renderers/RenderObjArray'

import notify from '@/helpers/notification'


export default {
	name: 'RecordAllocationGrid',
	props:{
		dataProp: Array,
		gridRefString: String,
		gridHeading: String,
		gridConfig: Array,
	},
	components: {
		AgGridVue,
		EditUserLink,
		RenderListArray,
		RenderObjArray,
		RenderTrashLink,
		RenderReviewLink,
		mdbContainer,
	},
	data () {
		return {
			paginationPageSize: 6,
			gridSize: {
				width: '100%',
				minWidth: '120px',
				height: '15rem',
				overflow: 'hidden'
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
			gridComponent: '',
		}
	},
	computed: {
		...mapGetters(['recordsList', 'unallocatedRecordsList', 'allocationColumnDefs', 'allocationsList', 'selectedUserAllocationDetails',
			'userAllocationDetailsColumnDefs',]),
	},
	created() {

	},
	beforeMount() {
		this.gridOptions = {};
	},
	mounted() {
		this.gridApi = this.gridOptions.api;
		this.gridColumnApi = this.gridOptions.columnApi;
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		...mapActions([
			'fetchDatasetRecords',
			'fetchAllocations',
			'fetchUserAllocations',
			'pushAllocation',
			'fetchAllocationDetailsById',
			'updateSelectedRecordId',
		]),
		onGridReady(params) {
			this.gridComponent = this.$refs[this.gridRefString]
			params.api.sizeColumnsToFit()
		},
		handleResize() {
				this.gridOptions.api.sizeColumnsToFit()
		},
		onCellClicked(params) {
			// if the grid is the user allocations grid  and the review button is clicked set the selected allocation get the details
			// and perform all required actions to load the first record into the review form view
			if (this.gridRefString === 'userAllocationsGrid' && params.colDef.field === 'allocationId'){
				const selectedAllocation = this.gridApi.getSelectedRows()[0]
				this.pushAllocation(selectedAllocation)
				eventBus.$emit('allocationUpdate', selectedAllocation)
				const params={
					allocationId: selectedAllocation.allocationId,
					statusId: 1,
				}
				this.fetchAllocationDetailsById(params).then( () => {
					eventBus.$emit('reviewAllocation', selectedAllocation)
					this.allocationId = params.value
					router.push('/records')
				})
			} else if(this.gridRefString === 'AllocationsDetailsGrid' && params.colDef.field === 'datasetDetailsId') {
				// if the review link in the details grid is clicked set the recordId and go to the review page
				this.updateSelectedRecordId(params.value)
				router.push('/records')
			}

		},
		onModelUpdated(params) {
			this.handleResize()
		},
		onSelectionChanged(params) {
			this.gridApi = params.api
			const selectedAllocation = this.gridApi.getSelectedRows()[0]
			if (this.gridRefString === 'userAllocationsGrid'){
					eventBus.$emit('allocationUpdate', selectedAllocation)
			}
		},
	},
}

</script>

<style lang="scss" scoped>
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
