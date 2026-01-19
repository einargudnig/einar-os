# Baby Prediction Market

A real-time prediction market for guessing baby gender, powered by Convex for instant sync across all connected clients.

## 🚀 Quick Start

1. **Initialize Convex (one-time setup):**
   ```bash
   npx convex dev
   ```
   - This will prompt you to create a Convex account and project
   - Generates TypeScript types automatically
   - Adds `NEXT_PUBLIC_CONVEX_URL` to your `.env.local` file

2. **Start development:**
   ```bash
   npm run dev:all
   ```
   - Runs both Convex and Next.js servers in one terminal
   - Watch for changes automatically

3. **Open in browser:**
   ```
   http://localhost:3000/baby
   ```

## 🎯 Features

- **Real-time Updates**: Votes appear instantly across all connected clients
- **Prediction Trend Line**: Live line chart showing sentiment over time (every vote)
  - Boy at top (100%)
  - Girl at bottom (0%)
  - Ties at middle (50%)
  - Updates automatically with each vote
- **Daily Prediction History**: See 7-day prediction history with bar chart
- **Statistics Panel**: View total votes and breakdown by gender
- **Optimistic UI**: Interface updates immediately, then syncs with server
- **Type-Safe**: Full TypeScript support from schema to client

## 📊 Database Schema

```typescript
{
  _id: string;
  prediction: "boy" | "girl";
  timestamp: number;
}
```

## 🔄 Convex Functions

All functions are defined in `convex/votes.ts`:

### Mutations
- `recordVote(prediction)` - Record a new vote

### Queries
- `getVoteTrend()` - Get complete voting history with sentiment for trend line
- `getDailyAggregates()` - Get daily prediction totals for bar chart
- `getCurrentTotals()` - Get current boy/girl totals

## 🎨 UI Components

- **Vote Cards**: Large, colorful buttons for quick voting
- **Prediction Trend Line**: Live line chart showing sentiment over every vote
  - Click any point to see vote details
  - Gradient color from blue (boy) to pink (girl)
  - Shows current sentiment percentage
- **Daily Prediction Chart**: Bar chart showing daily trends
- **Statistics Panel**: Total votes and gender breakdown

## 🔧 Development

### Schema Changes

When you modify `convex/schema.ts`, Convex automatically regenerates TypeScript types. No manual action needed.

### Adding New Features

1. Add new fields to `convex/schema.ts`
2. Create new query/mutation functions in `convex/votes.ts`
3. Use `useQuery` and `useMutation` hooks in components

### Environment Variables

After running `npx convex dev`, you'll have:
```
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

This is automatically added to `.env.local`.

## 📱 Responsive Design

- Mobile-first layout
- Touch-friendly voting buttons
- Adapts to all screen sizes

## 🌐 Deployment

### Convex Deployment
```bash
npx convex deploy
```

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `NEXT_PUBLIC_CONVEX_URL` as an environment variable
4. Deploy!

## 📚 Resources

- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Real-time Data Sync](https://docs.convex.dev/clients/react)

## 🤝 Contributing

Feel free to add new features like:
- Multiple prediction markets
- Historical accuracy tracking
- Social sharing
- Comment system

---

Made with ❤️ using Convex + Next.js
