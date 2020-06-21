const	express 		= require('express'),
		router  		= express.Router();

// Get list of blogs
router.get('/getEditList', function(req, res) {
	(async (blogAdminModel, res) => {
		const	posts	= blogAdminModel.getPostsToEdit();

		res.json( {
					posts	: await posts
		});
	})(req.app.get('blogAdminModel'), res);

});

// /getPost/191
router.get('/getPost/:id', function(req, res) {

	(async (blogAdminModel, res, id) => {
		const	post			= blogAdminModel.getPostById(id),
				postCategories	= blogAdminModel.getPostCategories(id),
				categories		= blogAdminModel.getCategories();

		res.json( {
					post			: await post,
					postCategories	: await postCategories,
					categories		: await categories
		});
	})(req.app.get('blogAdminModel'), res, req.params.id);

});

router.post('/saveDraft', (req, res) => {

	if(req.is('json')) {
		(async (body) => {
			const saveResponse = {
				status	: await req.app.get('blogAdminModel').saveDraft(body),
				reqBody	: body
			};

			res.json(saveResponse);
		})(req.body)

	} else {
		res.json({status	: 'Incorrent Content Type: ' + req.headers["content-type"] + '. Expected application/json.'});
	}
})

router.post('/updatePost', (req, res) => {

	if(req.is('json')) {
		(async (body) => {
			const 	savePost 				= req.app.get('blogAdminModel').updatePost(body),
					deletePostCategories	= req.app.get('blogAdminModel').deletePostCategories(body.entryId, body.categoryNamesSelected),
					savePostCategories		= req.app.get('blogAdminModel').savePostCategories(body.entryId, body.categoryNamesSelected);

			res.json({
						savePost				: await savePost,
						deletePostCategories	: await deletePostCategories,
						savePostCategories		: await savePostCategories
			});
		})(req.body)

	} else {
		res.json({status	: 'Incorrent Content Type: ' + req.headers["content-type"] + '. Expected application/json.'});
	}
})


module.exports = router;