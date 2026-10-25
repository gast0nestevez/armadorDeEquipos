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

  delete: (userId: string, ids: string[]): Promise<{ deletedCount: number }> =>
    Match.deleteMany({ _id: { $in: ids }, userId }),

  update: (
    userId: string,
    matchId: string,
    data: Record<string, unknown>
  ): Promise<IMatch | null> =>
    Match.findOneAndUpdate({ _id: matchId, userId }, data, {
      new: true,
      runValidators: true,
    }),
};
