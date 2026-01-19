import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============ GENDER PREDICTION ============

export const recordVote = mutation({
  args: {
    prediction: v.union(v.literal("boy"), v.literal("girl")),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    await ctx.db.insert("votes", {
      prediction: args.prediction,
      timestamp,
    });
    return { success: true };
  },
});

export const getCurrentTotals = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();

    const totals = { boy: 0, girl: 0 };

    for (const vote of votes) {
      if (vote.prediction === "boy") {
        totals.boy++;
      } else {
        totals.girl++;
      }
    }

    return totals;
  },
});

// ============ ARRIVAL PREDICTION ============

export const recordArrivalVote = mutation({
  args: {
    prediction: v.union(v.literal("before"), v.literal("after")),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    await ctx.db.insert("arrivalVotes", {
      prediction: args.prediction,
      timestamp,
    });
    return { success: true };
  },
});

export const getArrivalTotals = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("arrivalVotes").collect();

    const totals = { before: 0, after: 0 };

    for (const vote of votes) {
      if (vote.prediction === "before") {
        totals.before++;
      } else {
        totals.after++;
      }
    }

    return totals;
  },
});

// ============ WEIGHT PREDICTION ============

export const recordWeightVote = mutation({
  args: {
    prediction: v.union(v.literal("over"), v.literal("under")),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    await ctx.db.insert("weightVotes", {
      prediction: args.prediction,
      timestamp,
    });
    return { success: true };
  },
});

export const getWeightTotals = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("weightVotes").collect();

    const totals = { over: 0, under: 0 };

    for (const vote of votes) {
      if (vote.prediction === "over") {
        totals.over++;
      } else {
        totals.under++;
      }
    }

    return totals;
  },
});
