import mongoose from "mongoose";

const { Schema, model } = mongoose;



const blogsSchema = new Schema(
  {
   
     name: {type: String , required: true},
     description: {type: String , required: true},
     brand: {type: String , required: true},
     imageUrl: {type: String , required: true},
     price: {type: Number , required: true},
     category: {type: String},
     reviews: [{ type: Schema.Types.ObjectId, ref: "review" }]
  
     }, 
  {
    timestamps: true,
  }
);

export default model("product", blogsSchema);
