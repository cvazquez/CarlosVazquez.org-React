var express = require('express'),
    app		= express();

class blogAdmin {
	constructor(ds) {
		this.ds = ds;
	}

	getCategories() {
		return new Promise((resolve, reject) => {
			this.ds.query(`
				SELECT id, name
				FROM categories
				WHERE deletedAt IS NULL
				ORDER BY name;`,
			(err, rows) => {
				if (err) {
					if(app.get('env') === "development") {
						console.log("********* getCategories(body) error ***********");
						console.log(err);
					}

					resolve({
						failed	: true
					})
				}

				resolve(rows);
			})
		}).catch(err => {
			console.log("********* Promise Error: getCategories() *********");
			console.log(err);
		})
	}

	getPostById(entryId) {
		return new Promise(resolve => {
			this.ds.query(`
				SELECT	e.id,
						e.title,
						e.teaser,
						e.content,
						metaDescription,
						metaKeyWords,
						Date_Format(e.createdAt, '%Y-%m-%d %H:%i') AS createdAt,
						Date_Format(e.publishAt, '%Y-%m-%d %H:%i') AS publishAt,
						Date_Format(e.deletedAt, '%Y-%m-%d %H:%i') AS deletedAt
				FROM entries e
				WHERE e.id = ?;`, entryId,
				(err, rows) => {
					if (err) {
						if(app.get('env') === "development") {
							console.log("********* getPostById(body) error ***********");
							console.log(err);
						}

						resolve({
							failed	: true
						})
					}

				resolve(rows);
			})
		}).catch(err => {
			console.log("********* Promise Error: getPostById() *********");
			console.log(err);
		})
	}

	getPostCategories(id) {
		return new Promise((resolve, reject) => {
			this.ds.query(`	SELECT c.id, c.name
							FROM entrycategories ec
							INNER JOIN categories c ON	c.id = ec.categoryId
														AND c.deletedAt IS NULL
							WHERE	ec.entryId = ?
									AND ec.deletedAt IS NULL`, id,
					(err, rows) => {
						if (err) {
							if(app.get('env') === "development") {
								console.log("********* getPostCategories(body) error ***********");
								console.log(err);
							}

							resolve({
								failed	: true
							})
						}

						resolve(rows);
				})
		}).catch(err => {
			console.log("********* Promise Error: getPostCategories() *********");
			console.log(err);
		})
	}

	getPostsToEdit() {
		return new Promise(resolve => {
			this.ds.query(`
				SELECT	e.id,
						e.title,
						Date_Format(e.createdAt, '%Y-%m-%d %H:%i') AS createdAt,
						Date_Format(e.publishAt, '%Y-%m-%d %H:%i') AS publishAt,
						Date_Format(e.deletedAt, '%Y-%m-%d %H:%i') AS deletedAt
				FROM entries e
				ORDER BY e.createdAt DESC;`,
				(err, rows) => {
					if (err) {
						if(app.get('env') === "development") {
							console.log("********* getPostsToEdit(body) error ***********");
							console.log(err);
						}

						resolve({
							failed	: true
						})
					}

				resolve(rows);
			})
		}).catch(err => {
			console.log("********* Promise Error: getPostsToEdit() *********");
			console.log(err);
		})
	}

	saveDraft(body) {
		return new Promise((resolve, reject) => {
			this.ds.query(	`	INSERT INTO entrydrafts
								SET entryId = ?,
									content	= ?;`, [body.entryId, body.content],
								(err, rows) => {
									if(err) {
										if(app.get('env') === "development") {
											console.log("********* saveDraft(body) error ***********");
											console.log(err);
										}

										resolve({
											failed: true
										});
									}

									resolve(rows);
								})
		}).catch(err => {
			console.log("********* Promise Error: saveDraft() *********");
			console.log(err);
		})
	}

	updatePost(body) {
		return new Promise((resolve, reject) => {
			this.ds.query(`	UPDATE entries
							SET title			= ?,
								teaser			= ?,
								content			= ?,
								metaDescription	= ?,
								metaKeyWords	= ?,
								publishAt		= ?,
								updatedAt		= now()
							WHERE id = ?;`,
							[body.title, body.teaser, body.content, body.metaDescription, body.metaKeyWords, body.publishAt, body.entryId],
			(err, rows) => {
				if(err) {
					if(app.get('env') === "development") {
						console.log("********* updatePost(body) error ***********");
						console.log(err);
					}

					resolve({
						failed: true
					});
				}

				resolve(rows);
			}
		)}).catch(err => {
			console.log("********* Promise Error *********");
			console.log(err);
		})
	}

	updatePostCategories(entryId, categoryNames) {
		console.log("updatePostCategories")
		console.log(entryId)
		console.log(categoryNames)

		/* return new Promise((resolve, reject) => {
			this.ds.query(`	REPLACE INTO entrycategories (entryId, categoryId)
							VALUES (?, ?);`,
							[],
			(err, rows) => {
				if(err) {
					if(app.get('env') === "development") {
						console.log("********* updatePostCategories(body) error ***********");
						console.log(err);
					}

					resolve({
						failed: true
					});
				}

				resolve(rows);
			}
		)}).catch(err => {
			console.log("********* updatePostCategories(body) Promise Error *********");
			console.log(err);
		}) */
	}

}

exports.blogAdmin = blogAdmin;