<template>
	<div style="width: 100%; height:100%;">
		<ag-grid-vue ref="UserAllocationsGrid" v-bind:style="gridSize"
			class="ag-theme-balham"
			:gridOptions="gridOptions"
			:colResizeDefault="colResizeDefault"
			:rowData="userAllocations"
			:defaultColDef="defaultColDef"
			:columnDefs="userAllocationColumnDefs"
			:cellClicked="onCellClicked"
			:selectionChanged="onSelectionChanged"
			:suppressRowClickSelection="false"
			:enableSorting="true"
			:enableFilter="true"
			:componentStateChanged="handleResize"
			rowSelection="single"
			:gridReady="onGridReady" />
	</div>
</template>

<script>
import {eventBus} from '@/main'
import {AgGridVue} from 'ag-grid-vue'
import { mdbContainer } from 'mdbvue';
import {mapActions, mapGetters} from 'vuex'
import RenderTrashLink from '@/cell_renderers/RenderTrashLink'
import EditUserLink from '@/cell_renderers/EditUserLink'
import RenderListArray from '@/cell_renderers/RenderListArray'
import RenderObjArray from '@/cell_renderers/RenderObjArray'
import notify from '@/helpers/notification'


export default {
	name: 'UserAllocationsGrid',
	components: {
		AgGridVue,
		EditUserLink,
		RenderListArray,
		RenderObjArray,
		mdbContainer,
		RenderTrashLink,
	},
	data () {
		return {
			rowdata: [],
			paginationPageSize: 6,
			gridSize: {
				width: '100%',
				minWidth: '120px',
				height: '15rem',
				overflow: 'hidden'
			},
			gridOptions: null,
			gridApi: null,
			colResizeDefault: null,
			columnApi: null,
			columnDefs: null,
			defaultColDef: null,
			rowData: null
		}
	},
	computed: {
		...mapGetters([
			'recordsList',
			'unallocatedRecordsList',
			'allocationColumnDefs',
			'allocationsList',
			'userAllocationsColumnDefs',
			'userAllocations',
			'getUser',
			'selectedUserAllocation',
			'selectedUserAllocationDetails',
			'userAllocationDetailsColumnDefs']),
		userAllocationColumnDefs() {
			const defs = [
				{
					"headerName":"Review Data",
					"field":"allocationId",
					"resizable": true,
					"hide": false,
					"headerTooltip": "Click on pencil icon to review remaining records for allocation.",
					"suppressFilter": true,
					"suppressSorting": true,
					"cellRendererFramework": "EditUserLink",
					"autoHeight": true,
					"width": 50
				},
				{
					"headerName":"Allocated",
					"field":"allocated",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60,
					"maxWidth": 90
				},
				{
					"headerName":"Completed",
					"field":"completed",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60,
					"maxWidth": 90
				},
				{
					"headerName":"Pending",
					"field":"pending",
					"resizable": true,
					"headerTooltip": "Pending",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60
				},
				{
					"headerName":"Domain",
					"field":"domain",
					"headerTooltip": "Domain",
					"hide": false,
					"filter": "agTextColumnFilter",
					"width": 60,
					"maxWidth": 90
				},
				{
					"headerName":"Sources",
					"field":"sources",
					"hide": false,
					"cellClass": "listContainer",
					"filter": "agTextColumnFilter",
					"cellRendererFramework": "RenderObjArray",
					"minWidth": 80
				},
				{
					"headerName":"Dataset",
					"field":"dataset",
					"hide": false,
					"filter": "agTextColumnFilter",
					"width": 50
				},
				{
					"headerName":"Due Date",
					"field":"dueDate",
					"hide": false,
					"filter": "agDateColumnFilter",
					"width": 60
				}
			]

			return defs
		},
	},
	created() {
		this.fetchAllocations()
		this.fetchUserAllocations().then(() => {
				const params={
					allocationId: this.selectedUserAllocation.allocationId,
					statusId: 1,
				}
				this.fetchAllocationDetailsById(params).then( () => {
			})
		})
		eventBus.$on('allocationUpdate', (chart) => {
			this.pushAllocation(chart)
				const params={
					allocationId: chart.allocationId,
					statusId: 1,
				}
				this.fetchAllocationDetailsById(params).then( () => {
				this.userAllocationDetails()
			})
		})
	},
	beforeMount() {
		this.gridOptions = {};
	},
	mounted() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		...mapActions(['fetchDatasetRecords','fetchAllocations', 'fetchUserAllocations', 'pushAllocation', 'fetchAllocationDetailsById']),
		onGridReady(params) {
			this.columnDefs = this.userAllocationsColumnDefs
			this.gridApi = params.api
			console.log('ongridready:', this.userAllocationsColumnDefs)
			this.handleResize()
		},
		handleResize() {
			console.log('handled')
			this.gridOptions.api.sizeColumnsToFit()
		},
		onCellClicked(params) {
		//	console.log(params)
			if (params.colDef.field === 'allocationId') {
				this.allocationId = params.value
				eventBus.$emit('allocationChartUpdate', params.data)
			}
		},
		onSelectionChanged(params) {
			this.gridApi = params.api
			const selectedAllocation = this.gridApi.getSelectedRows()[0]

		},
		loadData() {
			if(this.dataProp === 'selectedAllocationDetails') {
				console.log('selectedUserAllocationDetails')
				this.rowdata = this.selectedUserAllocationDetails
			}
			else if(this.dataProp === 'allocationsList') {
				console.log('allocationsList')
				this.rowdata = this.allocationsList
			}
			else if(this.dataProp === 'userAllocations') {
				console.log('userAllocations')
				this.rowdata = this.userAllocations
			}

		}
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
