const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")


router.get("/test-me", function(req, res){
    res.send({status : true, msg : "working"})
})

router.post("/register", userController.createUser)

router.post("/login", userController.userLogin)

router.post("/books", bookController.createBook)

router.get("/books", bookController.getBooks)

router.post("/books/:bookId/review", reviewController.reviewer)

router.get("/books/:bookId", bookController.getBookDetailsById)

router.put("/books/:bookId", bookController.updateBooks)

router.delete("/books/:bookId", bookController.deleteBooks)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


module.exports = router;