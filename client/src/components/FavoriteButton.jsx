import { useEffect, useState } from "react";

import {
  Bookmark
} from "lucide-react";

import {
  addFavorite,
  removeFavorite
} from "../services/favoriteService";

export default function FavoriteButton({
  itemType,
  itemId,
  initialSaved = false
}) {
  const [saved, setSaved] =
    useState(initialSaved);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const toggle = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (saved) {
        await removeFavorite(
          itemType,
          itemId
        );

        setSaved(false);
      } else {
        await addFavorite(
          itemType,
          itemId
        );

        setSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={`p-2 rounded-lg ${
        saved
          ? "bg-blue-500/10 text-blue-400"
          : "bg-slate-800 text-slate-400"
      }`}
      title={
        saved
          ? "Remove from saved"
          : "Save"
      }
    >
      <Bookmark
        size={18}
        fill={
          saved
            ? "currentColor"
            : "none"
        }
      />
    </button>
  );
}