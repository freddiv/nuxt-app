import createRepository from '~/api/Repository'

export default (ctx, inject) => {
	const repositoryWithAxios = createRepository(ctx.$axios)

	inject('postRepository', repositoryWithAxios('/posts'))
	inject("userRepository", repositoryWithAxios("/users"));
}