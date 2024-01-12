const express = require("express");
const router = express.Router();
const { LikedSong } = require("../model/LikedSong");
const { Song } = require("../model/Song");
const passport = require("passport");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songId } = req.body;
    const artist = req.user;

    try {
      const song = await Song.findOne({ _id: songId });
      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }

      // Check if the song already exists in the LikedSongs for the current artist
      const likedSongForArtist = await LikedSong.findOne({
        artist: artist._id,
      });

      if (likedSongForArtist && likedSongForArtist.songs.includes(songId)) {
        return res
          .status(200)
          .json({ error: "Song already exists in liked songs" });
      }

      // Create a LikedSong for the current artist if it doesn't exist
      if (!likedSongForArtist) {
        const createdSong = await LikedSong.create({
          artist: artist._id,
          songs: [songId],
        });

        await createdSong.populate("songs");
        return res.status(200).json(createdSong);
      }

      // Add the song to the liked songs of the current artist
      likedSongForArtist.songs.push(songId);
      await likedSongForArtist.save();
      await likedSongForArtist.populate("songs");

      return res.status(200).json(likedSongForArtist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get/mylikedsongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const songs = await LikedSong.find({ artist: req.user._id })
        .populate({
          path: "songs",
          populate: { path: "artist" }, // Populate the artist field within songs
        })
        .populate("artist"); // Populating the artist field in LikedSong itself

      return res.status(200).json({ data: songs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
router.get(
  "/get/particular-artist-song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const artistId = req.user._id;
    console.log(artistId);
    try {
      const likedSongs = await LikedSong.findOne({ artist: artistId }).exec();

      if (likedSongs) {
        res.json({ artistId: artistId, likedSongs: likedSongs.songs });
      } else {
        res.status(404).json({ error: "No liked songs found for the artist" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
exports.router = router;
