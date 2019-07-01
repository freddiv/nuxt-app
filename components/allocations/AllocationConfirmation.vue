<template>
	<mdb-modal v-if="showConfimation" @close="showConfimation = false">
		<mdb-modal-header>
			<mdb-modal-title>Modal title</mdb-modal-title>
		</mdb-modal-header>
		<mdb-modal-body>...</mdb-modal-body>
		<mdb-modal-footer>
			<mdb-btn color="secondary" @click.native="modal = false">Close</mdb-btn>
			<mdb-btn color="primary">Save changes</mdb-btn>
		</mdb-modal-footer>
	</mdb-modal>
</template>