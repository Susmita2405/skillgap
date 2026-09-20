import {
  useEffect,
  useState
} from "react";

import {
  Bookmark
} from "lucide-react";

import {
  getFavorites
} from "../services/favoriteService";

export default function SavedItems() {
  const [favorites, setFavorites] =
    useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response =
        await getFavorites();

      setFavorites(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold">
          Saved Items
        </h1>

        <p className="text-slate-400 mt-2">
          Your saved careers, projects and resources.
        </p>

        {favorites.length === 0 ? (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <Bookmark
              className="mx-auto text-slate-500"
              size={40}
            />

            <p className="text-slate-400 mt-4">
              You haven't saved anything yet.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-8">

            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >

                <span className="text-xs uppercase text-blue-400">
                  {favorite.itemType}
                </span>

                <p className="text-slate-300 mt-3">
                  Saved item
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {new Date(
                    favorite.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}