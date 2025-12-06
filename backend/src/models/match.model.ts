import mongoose, { Schema, Document } from 'mongoose'

export interface Player {
  name: String
  skill: Number
  team: Number
}

export interface Match extends Document {
  userId: String
  players: Player[]
  goals1: Number
  goals2: Number
  result: String
  date: String
}

const PlayerSchema = new Schema<Player>({
  name: { type: String, required: true },
  skill: { type: Number },
  team: { type: Number, required: true },
})

const MatchSchema = new Schema<Match>({
  userId: { type: String, required: true },
  players: { type: [PlayerSchema], required: true },
  goals1: { type: Number },
  goals2: { type: Number },
  result: { type: String, enum: ['Lose', 'Draw', 'Win'] },
  date: { 
    type: String, 
    match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    required: false
  }
}, {
  timestamps: true
})

export default mongoose.model<Match>('Match', MatchSchema)
