// Purpose: review routes
// require express
const express = require("express");
// require router
const router = express.Router({ mergeParams: true });

// require utils validators
const { getReviewByIdValidator, createReviewValidator, deleteReviewValidator, updateReviewValidator } = require("../utils/ValidationLayer/Validators/reviewValidators");

// require controllers
const {getReviews, getReviewById, createReview, updateReviewById, deleteReviewById} = require("../controllers/reviewController");

const { createFilterObject, setBodyPropertyToParamsId } = require("../controllers/handlersFactory");

// require auth controllers
const { protect, restrictTo } = require("../controllers/authController");

// routes
router.route("/")
    .get(createFilterObject("product"), getReviews)
    .post(protect, restrictTo("user"), setBodyPropertyToParamsId("product",{getUserByToken: true}), createReviewValidator, createReview);

router.route("/:id")
    .get(getReviewByIdValidator, getReviewById)
    .put(protect, restrictTo("user"), updateReviewValidator, updateReviewById)
    .delete(protect, deleteReviewValidator, deleteReviewById);

module.exports = router;
