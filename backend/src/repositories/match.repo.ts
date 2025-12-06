import Match from '../models/match.model'

export default {
  create: (data: any) => Match.create(data),

  findByUser: (userId: string) =>
    Match.find({ userId }).sort({ createdAt: -1 }),

  delete: (matchId: string) =>
    Match.findByIdAndDelete(matchId),

  update: (matchId: string, data: any) =>
    Match.findByIdAndUpdate(matchId, data, {
      new: true,              // return the new doc
      runValidators: true
    })
}
