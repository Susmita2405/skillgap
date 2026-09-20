import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    itemType: {
      type: String,
      enum: [
        "role",
        "project",
        "resource"
      ],
      required: true
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

favoriteSchema.index(
  {
    user: 1,
    itemType: 1,
    item: 1
  },
  {
    unique: true
  }
);

export default mongoose.model(
  "Favorite",
  favoriteSchema
);