import mongoose from 'mongoose';

const playerEventSchema = new mongoose.Schema(
  {
    createEvent: [],
    acceptEvent: [],
  },
  {
    collection: 'playerEvents',
    timestamps: true,
  },
);


const PlayerEventModel =
  mongoose.models.PlayerEventModel || mongoose.model('PlayerEventModel', playerEventSchema);

export default PlayerEventModel;
