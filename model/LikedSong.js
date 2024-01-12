const mongoose = require("mongoose");
const { Schema } = mongoose;
const likedsongSchema = new Schema({
  color: {
    type: Boolean,
  },
  artist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Song",
      unique: true,
    },
  ],
});
exports.LikedSong = mongoose.model("LikedSong", likedsongSchema);
