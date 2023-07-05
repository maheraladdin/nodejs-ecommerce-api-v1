// Purpose: review routes
// require express
const express = require("express");
// require router
const router = express.Router();

// require utils validators
const { getReviewByIdValidator, createReviewValidator, deleteReviewValidator, updateReviewValidator } = require("../utils/ValidationLayer/Validators/reviewValidators");

// require controllers
const {getReviews, getReviewById, createReview, updateReviewById, deleteReviewById} = require("../controllers/reviewController");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .get(getReviews)
    .post(protect, restrictTo("user"), createReviewValidator, createReview);

router.route("/:id")
    .get(getReviewByIdValidator, getReviewById)
    .put(protect, restrictTo("user"), updateReviewValidator, updateReviewById)
    .delete(protect, deleteReviewValidator, deleteReviewById);

module.exports = router;
