import express from "express";
import createHttpError from "http-errors";
import reviewModel from "./model.js";





const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new reviewModel(req.body);
    const { _id } = await newReview.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewModel.find();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});
reviewsRouter.get("/:reviewID", async (req, res, next) => {
  try {
    const review = await reviewModel.findById(req.params.reviewID);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.reviewID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
reviewsRouter.put("/:reviewID", async (req, res, next) => {
  try {
    const updatedReview = await reviewModel.findByIdAndUpdate(
      req.params.reviewID,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedReview) {
      res.send(updatedReview);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.reviewID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
reviewsRouter.delete("/:reviewID", async (req, res, next) => {
  try {
    const deletedReview = await reviewModel.findByIdAndDelete(req.params.reviewID);
    if (deletedReview) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.reviewID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});



export default reviewsRouter;