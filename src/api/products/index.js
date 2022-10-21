import express from "express";
import createHttpError from "http-errors";
import productModel from "./model.js";
import q2m from 'query-to-mongo'



const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
  

    const newProduct = new productModel(req.body);
    const { _id } = await newProduct.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQeury = q2m(req.query)
    console.log(mongoQeury.criteria.page)
    const products = await productModel.find().skip(0).limit(5).populate({
      path: "reviews",
      select: "comment rate",
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:price/:category", async (req, res, next) => {
  try {
    const products = await productModel.find(
      {$and: [{price: {$gt: req.params.price}}, {category: req.params.category}]}
    ).populate({
      path: "reviews",
      select: "comment rate",
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productID", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productID).populate({
      path: "reviews",
      select: "comment rate",
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(404, `Product with id ${req.params.productID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productID", async (req, res, next) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.productID,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: "reviews",
      select: "comment rate",
    });
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(404, `Product with id ${req.params.productID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productID", async (req, res, next) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.productID);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Product with id ${req.params.productID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});



export default productsRouter;
