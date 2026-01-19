import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  votes: defineTable({
    prediction: v.union(v.literal("boy"), v.literal("girl")),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  // New prediction tables for additional markets
  arrivalVotes: defineTable({
    prediction: v.union(v.literal("before"), v.literal("after")),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  weightVotes: defineTable({
    prediction: v.union(v.literal("over"), v.literal("under")),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
