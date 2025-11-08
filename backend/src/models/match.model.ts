import mongoose, { Schema, Document } from 'mongoose'

export interface Player {
  name: string
  skill: number
  team: number
}

export interface Match extends Document {
  userId: string
  players: Player[]
}

const PlayerSchema = new Schema<Player>({
  name: { type: String, required: true },
  skill: { type: Number, required: true },
  team: { type: Number, required: true },
})

const MatchSchema = new Schema<Match>({
  userId: { type: String, required: true },
  players: { type: [PlayerSchema], required: true },
})

export default mongoose.model<Match>('Match', MatchSchema)
