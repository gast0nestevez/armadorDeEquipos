import type { FilterQuery } from 'mongoose';

import type { IMatch } from '../models/match.model';
import type { MatchData } from '../utils/types';

import Match from '../models/match.model';

type MatchCreateData = MatchData & {
  userId: string;
};

export default {
  create: (data: MatchCreateData): Promise<IMatch> => Match.create(data),

  findByUser: (userId: string): Promise<IMatch[]> =>
    Match.find({ userId } as FilterQuery<MatchData>).sort({ createdAt: -1 }),

  delete: (ids: string[]): Promise<{ deletedCount: number }> =>
    Match.deleteMany({ _id: { $in: ids } }),

  update: (matchId: string, data: Record<string, unknown>): Promise<IMatch | null> =>
    Match.findByIdAndUpdate(matchId, data, {
      new: true,
      runValidators: true,
    }),
};
