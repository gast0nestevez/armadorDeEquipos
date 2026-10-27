import type { FilterQuery } from 'mongoose';

import type { IFormation } from '#models/formation.model.ts';
import type { FormationData } from '#utils/types.ts';

import Formation from '#models/formation.model.ts';

type FormationCreateData = FormationData & {
  userId: string;
};

export default {
  create: (data: FormationCreateData): Promise<IFormation> => Formation.create(data),

  findByUser: (userId: string): Promise<IFormation[]> =>
    Formation.find({ userId } as FilterQuery<FormationData>).sort({ createdAt: -1 }),

  findById: (userId: string, formationId: string): Promise<IFormation | null> =>
    Formation.findOne({ _id: formationId, userId }),

  delete: (userId: string, ids: string[]): Promise<{ deletedCount: number }> =>
    Formation.deleteMany({ _id: { $in: ids }, userId }),
};
