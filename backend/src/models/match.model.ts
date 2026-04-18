import mongoose, { Schema, Document } from 'mongoose'

interface IPlayer {
  name: string;
  skill: number;
  team: number;
}

interface IMatch extends Document {
  userId: string;
  players: IPlayer[];
  goals1: number;
  goals2: number;
  result: string;
  date: string;
}

const PlayerSchema: Schema<IPlayer> = new Schema<IPlayer>({
  name: { type: String, required: true },
  skill: { type: Number },
  team: { type: Number, required: true },
});

const MatchSchema: Schema<IMatch> = new Schema<IMatch>({
  userId: { type: String, required: true },
  players: { type: [PlayerSchema], required: true },
  goals1: { type: Number },
  goals2: { type: Number },
  result: { type: String, enum: ['Lose', 'Draw', 'Win'] },
  date: {
    type: String,
    match: /^\d{4}\-\d{2}\-\d{2}$/,
    required: false,
  },
}, {
  timestamps: true,
});

export { IMatch, IPlayer };

export default mongoose.model<IMatch>('Match', MatchSchema);
