<template>
	<mdb-container v-cloak fluid>
		<div class="mb-5">
			<p class="h3 blue-text mt-4">Administrator Dashboard</p>
			<p class="h5 grey-text mt-3">Welcome to National Center for Computational Toxicology DataCheck – Enabling Quality Data. </p>
			<hr>
		</div>
		<section class="mb-5">
			<!--Grid row-->
			<div class="row">
				<div class="col-lg-6 col-md-12 mb-4">
					<div v-if="selectedUserAllocation" class="card card-cascade narrower">
						<div class="view view-cascade gradient-card-header blue lighten-4">
							<mdb-bar-chart v-if="userAllocationsChartData.allocated" :data="userGraphData" :options="barChartOptions" :height="150"></mdb-bar-chart>
						</div>
						<div class="card-body card-body-cascade text-center">
						</div>
					</div>
					<!--Card-->
					<div class="card card-cascade narrower">
						<!--Card image-->
						<div class="view view-cascade gradient-card-header mdb-color lighten-4">
							<router-link to="/allocations"><p class="h4 font-weight-bold blue-text">{{getUser.first_name}}'s Allocations</p></router-link>
						</div>
						<!--/Card image-->
						<!--Card content-->
						<div class="card-body card-body-cascade">
							<dashboard-allocations-grid
								:dataProp="userAllocations"
								:grid-config="UserAllocationColumnDefs"
								grid-ref-string="userAllocationsGrid"></dashboard-allocations-grid>
						</div>
						<!--/.Card content-->
					</div>
					<!--/.Card-->
				</div>
				<!--Grid column-->
				<div class="col-lg-6 col-md-12 mb-4">
					<!--Card-->
					<div class="card card-cascade narrower">
						<!--Card image-->
						<div class="view view-cascade gradient-card-header mdb-color lighten-4">
							<router-link to="/allocations"><p class="h4 font-weight-bold blue-text">Review Records</p></router-link>
						</div>
						<!--/Card image-->
						<!--Card content-->
						<div class="card-body card-body-cascade">
							<dashboard-allocations-grid
								:dataProp="selectedUserAllocationDetails"
								:grid-config="userAllocationDetailsColumnDefs"
								grid-ref-string="AllocationsDetailsGrid"></dashboard-allocations-grid>
						</div>
						<!--/.Card content-->
					</div>
					<!--/.Card-->
				</div>				<!--Grid column-->
			</div>
			<!--Grid row-->
			<div class="row">
				<!--Grid column-->
				<div v-if="isAdmin" class="col-lg-6 col-md-12 mb-4">
					<!--Card-->
					<div class="card card-cascade narrower">
						<!--Card image-->
						<div class="view view-cascade gradient-card-header mdb-color lighten-4">
							<router-link to="/allocations"><p class="h4 font-weight-bold blue-text">All Allocations</p></router-link>
						</div>
						<!--/Card image-->
						<!--Card content-->
						<div class="card-body card-body-cascade">
							<dashboard-allocations-grid
								:dataProp="allocationsList"
								:grid-config="AllAllocationColumnDefs"
								grid-ref-string="allAllocationsGrid"></dashboard-allocations-grid>
						</div>
						<!--/.Card content-->
					</div>
					<!--/.Card-->
				</div>
				<!--Grid column-->
			</div>
			<!--Grid row-->
		</section>
	</mdb-container>
</template>

<script>
import {mdbContainer, mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbBadge, mdbBtn, mdbPieChart, mdbBarChart, mdbSimpleChart} from 'mdbvue'
import {eventBus} from '../../main'
import {AgGridVue} from 'ag-grid-vue'
import {mapActions, mapGetters} from 'vuex'
import DashboardAllocationsGrid from '@/components/dashboard/DashboardAllocationsGrid'

export default {
	name: 'AdminDashboard',
	components: {
		AgGridVue,
		mdbContainer,
		mdbRow,
		mdbCol,
		mdbCard,
		mdbView,
		mdbCardBody,
		mdbBadge,
		mdbBtn,
		mdbPieChart,
		mdbBarChart,
		mdbSimpleChart,
		DashboardAllocationsGrid,
	},
	data () {
		return {
			paginationPageSize: 100,
			barChartOptions: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [
						{
							barPercentage: 1,
							gridLines: {
								display: true,
								color: 'rgba(0, 0, 0, 0.1)'
							}
						}
					],
					yAxes: [
						{
							gridLines: {
								display: true,
								color: 'rgba(0, 0, 0, 0.1)'
							},
							ticks: {
								beginAtZero: true,
								min: 0
							}
						}
					]
				}
			},
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
			'isAdmin',
			'selectedUserAllocation',
			'selectedUserAllocationDetails',
			'userAllocationDetailsColumnDefs',
			'selectedRecordId',
			'userAllocationsChartData']),
		gridRef() {
			return this.gridApi
		},
		userGraphData() {
			const pending = this.userAllocationsChartData.pending
			const allocated = this.userAllocationsChartData.allocated
			const completed = this.userAllocationsChartData.completed

			const 	barChartData = {
					labels: ['Pending', 'Completed', 'Allocated'],
					datasets: [
						{
							label: 'Allocation Progress',
							data: [pending, completed, allocated],
							backgroundColor: 'rgba(255, 255, 255, 0.6)',
							borderColor: '#fff',
							borderWidth: 1
						}
						]
				}
			return barChartData
		},
		AllAllocationColumnDefs() {
			const defs = [
				{
					"headerName":"Reviewer",
					"field":"reviewer",
					"hide": false,
					"filter": "agTextColumnFilter",
					"width": 70
				},
				{
					"headerName":"Allocated",
					"field":"allocated",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60
				},
				{
					"headerName":"Completed",
					"field":"completed",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60
				},
				{
					"headerName":"Pending",
					"field":"pending",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"width": 60
				},
				{
					"headerName":"Domain",
					"field":"domain",
					"hide": false,
					"filter": "agTextColumnFilter",
					"width": 60
				},
				{
					"headerName":"Sources",
					"field":"sources",
					"hide": false,
					"cellClass": "listContainer",
					"filter": "agTextColumnFilter",
					"cellRendererFramework": "RenderObjArray",
					"width": 100
				},
				{
					"headerName":"Dataset",
					"field":"dataset",
					"hide": false,
					"filter": "agTextColumnFilter",
					"width": 60
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
		UserAllocationColumnDefs() {
			const defs = [
				{
					"headerName": "",
					"field": "allocationId",
					"hide": false,
					"filter": "agTextColumnFilter",
					"cellRendererFramework": "RenderReviewLink",
					"autoHeight": true,
					"width": 70
				},
				{
					"headerName":"Allocated",
					"field":"allocated",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"minWidth": 60,
					"maxWidth": 90
				},
				{
					"headerName":"Completed",
					"field":"completed",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"minWidth": 60,
					"maxWidth": 90
				},
				{
					"headerName":"Pending",
					"field":"pending",
					"headerTooltip": "Pending",
					"hide": false,
					"filter": "agNumberColumnFilter",
					"minWidth": 60,
					"maxWidth": 90
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
		IcolumnDefs() {
			const defs = [ {
				"headerName": "CASRN",
				"field": "casrn",
				"hide": false,
				"filter": "agTextColumnFilter",
				"width": 60
			}, {
				"headerName": "Name",
				"field": "name",
				"tooltipField": "name",
				"hide": false,
				"filter": "agTextColumnFilter",
				"width": 120
			}, {
				"headerName": "Domain",
				"field": "domain",
				"hide": false,
				"filter": "agTextColumnFilter",
				"width": 60
			}, {
				"headerName": "Source",
				"field": "source",
				"hide": false,
				"filter": "agTextColumnFilter",
				"width": 80
			}, {
				"headerName": "",
				"field": "datasetDetailsId",
				"hide": false,
				"filter": "agTextColumnFilter",
				"cellRendererFramework": "RenderReviewLink",
				"autoHeight": true,
				"width": 60
			}]
			return defs
		},

	},
	created() {
		this.fetchAllocations()
		this.fetchUserAllocations().then(() => {
			if(this.selectedUserAllocation) {
				const params={
					allocationId: this.selectedUserAllocation.allocationId,
					statusId: 1,
				}
				this.fetchAllocationDetailsById(params).then( () => {

				})
			}
		})
		eventBus.$on('allocationUpdate', (allocation) => {
			this.pushAllocation(allocation)
			this.updateSelectedAllocationId(allocation.allocationId)

			const params={
				allocationId: allocation.allocationId,
				statusId: 1,
			}
			this.fetchAllocationDetailsById(params).then( () => {})
		})
	},
	mounted() {
		//console.log(this.unallocatedRecordsGridColumnDefs)
		window.addEventListener('resize', this.handleResize)
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
			'logout',
			'updateSelectedAllocationId',
		]),
		onGridReady(params) {
			this.gridComponent = this.$refs.dashboardAllocationGrid
			this.gridApi = params.api
			this.gridApi.sizeColumnsToFit()
			this.columnApi = params.columnApi
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
	font-weight: normal;
}
gradient-card-header {
	padding: .5rem !important;

}
.home-feature-box {
	padding: 40px 0;
}

.home-feature-box i {
	font-size: 6rem;
}
.home-feature-box span {
	display:     block;
	color:       black;
	font-size:   20px;
	font-weight: bold;
	padding-top: 20px;
}

ul {
	list-style-type: none;
	padding:         0;
}

li {
	display: inline-block;
}

a {
	color: #42b983;
}
</style>
