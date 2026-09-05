import { z } from 'zod';

export const SourceSchema = z.enum(['591', 'threads', 'fb_group', 'fb_marketplace', 'ptt', 'manual', 'other']);
export const RoomTypeSchema = z.enum(['套房', '雅房', '整層', '分租', '未知']);
export const StatusSchema = z.enum(['inbox', 'shortlist', 'contacted', 'viewing', 'viewed', 'rejected', 'signed']);
export const TierSchema = z.enum(['pass', 'unknown', 'fail']);
export const PetPolicySchema = z.enum(['allowed', 'not_allowed', 'negotiable', 'unknown']);
export const ExtractionMethodSchema = z.enum(['url', 'text_regex', 'cli_fetch', 'manual', 'llm']);

export const RuleReasonSchema = z.object({
  kind: z.enum(['fail', 'unknown', 'pass', 'bonus']),
  code: z.string(),
  message: z.string(),
});
export const RuleResultSchema = z.object({
  tier: TierSchema,
  reasons: z.array(RuleReasonSchema),
  softScore: z.number().min(0).max(100),
  evaluatedAt: z.string(),
});

export const ListingSchema = z.object({
  id: z.string().min(1),
  source: SourceSchema,
  sourceId: z.string().min(1),
  url: z.string().url().optional(),
  title: z.string(),
  rent: z.number().int().positive().optional(),
  depositMonths: z.number().nonnegative().optional(),
  managementFee: z.number().nonnegative().optional(),
  utilitiesNote: z.string().optional(),
  roomType: RoomTypeSchema,
  layout: z.string().optional(),
  areaPing: z.number().positive().optional(),
  floor: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  mrtNearest: z.string().optional(),
  mrtWalkMin: z.number().int().nonnegative().optional(),
  equipment: z.array(z.string()),
  petPolicy: PetPolicySchema.optional(),
  availableFrom: z.string().optional(),
  photos: z.array(z.string()),
  photoHashes: z.array(z.string()).optional(),
  contactRaw: z.string().optional(),
  phoneNormalized: z.string().optional(),
  rawText: z.string().optional(),
  postedAt: z.string().optional(),
  fetchedAt: z.string(),
  updatedAt: z.string(),
  extraction: z.object({
    method: ExtractionMethodSchema,
    confidence: z.number().min(0).max(1),
    missing: z.array(z.string()),
  }),
  enrichment: z.enum(['none', 'pending', 'done', 'failed']),
  status: StatusSchema,
  statusHistory: z.array(z.object({ status: StatusSchema, at: z.string() })),
  notes: z.string().optional(),
  pinned: z.boolean(),
  rule: RuleResultSchema.optional(),
  dedupeGroupId: z.string().optional(),
  extra: z.record(z.string(), z.string()),
});

export const ProfileSchema = z.object({
  budget: z.object({
    套房: z.number().positive(),
    雅房: z.number().positive(),
    整層: z.number().positive().optional(),
    分租: z.number().positive().optional(),
  }),
  budgetTolerance: z.number().nonnegative(),
  cities: z.array(z.string()).min(1),
  mrtWalkMaxMin: z.number().int().positive(),
  mustHave: z.array(z.string()),
  pets: z.object({ required: z.boolean(), note: z.string() }),
  dealBreakerKeywords: z.array(z.string()),
  bonusKeywords: z.array(z.string()),
  moveInBefore: z.string().optional(),
});

export const InboxItemSchema = z.object({
  id: z.string().min(1),
  receivedAt: z.string(),
  title: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
});

export const ExportFileSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  profile: ProfileSchema,
  listings: z.array(ListingSchema),
  inbox: z.array(InboxItemSchema),
});

export type Source = z.infer<typeof SourceSchema>;
export type RoomType = z.infer<typeof RoomTypeSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Tier = z.infer<typeof TierSchema>;
export type PetPolicy = z.infer<typeof PetPolicySchema>;
export type ExtractionMethod = z.infer<typeof ExtractionMethodSchema>;
export type RuleReason = z.infer<typeof RuleReasonSchema>;
export type RuleResult = z.infer<typeof RuleResultSchema>;
export type Listing = z.infer<typeof ListingSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type InboxItem = z.infer<typeof InboxItemSchema>;
export type ExportFile = z.infer<typeof ExportFileSchema>;

export const STATUS_ORDER: Status[] = ['inbox', 'shortlist', 'contacted', 'viewing', 'viewed', 'rejected', 'signed'];

export const DEFAULT_PROFILE: Profile = {
  budget: { 套房: 15000, 雅房: 10000 },
  budgetTolerance: 1000,
  cities: ['台北市', '新北市'],
  mrtWalkMaxMin: 15,
  mustHave: ['變頻冷氣', '冰箱', '對外窗', '洗衣機'],
  pets: { required: true, note: '2 隻貓' },
  dealBreakerKeywords: ['壁癌', '無對外窗', '壁紙', '隔音差', '不可養寵物', '禁寵', '限女', '限男', '頂加'],
  bonusKeywords: ['露台', '陽台', '可自繳', '電梯', '新裝潢', '乾濕分離'],
};
