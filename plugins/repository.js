import createRepository from '~/api/Repository.js'

export default (ctx, inject) => {
	const repositoryWithAxios = createRepository(ctx.$axios)

  const repositories = {
    posts: repositoryWithAxios('posts'),
    users: repositoryWithAxios('users')
    //...
	}

	inject('postRepository', repositoryWithAxios('/posts'))
}