const mongoose = require("mongoose");
const { Schema } = mongoose;
const likedsongSchema = new Schema({
  color: {
    type: Boolean,
  },
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Song",
      unique: true,
    },
  ],
  artist: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});
exports.LikedSong = mongoose.model("LikedSong", likedsongSchema);
