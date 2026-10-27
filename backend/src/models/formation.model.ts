import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

import type { IPlayer } from '#models/match.model.ts';

type IFormation = {
  userId: Schema.Types.ObjectId;
  players: IPlayer[];
} & Document;

const FormationPlayerSchema: Schema<IPlayer> = new Schema<IPlayer>({
  name: { type: String, required: true },
  skill: { type: Number },
  team: { type: Number, required: true },
});

const FormationSchema: Schema<IFormation> = new Schema<IFormation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    players: { type: [FormationPlayerSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export type { IFormation };

export default mongoose.model<IFormation>('Formation', FormationSchema);
