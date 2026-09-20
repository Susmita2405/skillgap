import Favorite from "../models/Favorite.js";

import asyncHandler from "../utils/asyncHandler.js";

export const getFavorites =
  asyncHandler(async (req, res) => {
    const favorites =
      await Favorite.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    res.json({
      success: true,
      data: favorites
    });
  });

export const addFavorite =
  asyncHandler(async (req, res) => {
    const {
      itemType,
      item
    } = req.body;

    const allowedTypes = [
      "role",
      "project",
      "resource"
    ];

    if (!allowedTypes.includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid favorite type"
      });
    }

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "Item is required"
      });
    }

    const favorite =
      await Favorite.findOneAndUpdate(
        {
          user: req.user._id,
          itemType,
          item
        },
        {
          user: req.user._id,
          itemType,
          item
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

    res.status(201).json({
      success: true,
      message: "Saved successfully",
      data: favorite
    });
  });

export const removeFavorite =
  asyncHandler(async (req, res) => {
    const favorite =
      await Favorite.findOneAndDelete({
        user: req.user._id,
        itemType: req.params.itemType,
        item: req.params.itemId
      });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found"
      });
    }

    res.json({
      success: true,
      message: "Removed from saved items"
    });
  });