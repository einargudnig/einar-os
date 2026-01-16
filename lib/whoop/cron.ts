#!/usr/bin/env bun

import { WhoopClient } from './client';

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) {
  console.error('Error: WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET must be set');
  process.exit(1);
}

const client = new WhoopClient(WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET);

async function fetchWhoopData() {
  const now = new Date();
  const timestamp = now.toISOString();

  console.log(`\n[${ timestamp }] 🏃 Fetching Whoop data...\n`);

  try {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const [recovery, sleep, workouts] = await Promise.all([
      client.getRecovery(yesterday, now),
      client.getSleep(yesterday, now),
      client.getWorkouts(yesterday, now),
    ]);

    console.log('📊 Recovery Data:');
    if (recovery.length > 0) {
      const latest = recovery[recovery.length - 1];
      console.log(`  Score: ${latest.recovery_score}%`);
      console.log(`  Resting HR: ${latest.resting_heart_rate} bpm`);
      console.log(`  HRV: ${latest.hrv_rmssd_milli} ms`);
      if (latest.spo2_percentage) console.log(`  SpO2: ${latest.spo2_percentage}%`);
      if (latest.skin_temp_celsius) console.log(`  Skin Temp: ${latest.skin_temp_celsius}°C`);
    } else {
      console.log('  No recovery data available');
    }

    console.log('\n😴 Sleep Data:');
    if (sleep.length > 0) {
      const latest = sleep[sleep.length - 1];
      if (latest.score) {
        const totalSleepHours = latest.score.stage_summary.total_in_bed_time_milli / (1000 * 60 * 60);
        console.log(`  Total Sleep: ${totalSleepHours.toFixed(2)} hours`);
        console.log(`  Performance: ${latest.score.sleep_performance_percentage}%`);
        console.log(`  Efficiency: ${latest.score.sleep_efficiency_percentage}%`);
        console.log(`  Consistency: ${latest.score.sleep_consistency_percentage}%`);
        console.log(`  Respiratory Rate: ${latest.score.respiratory_rate} bpm`);
      } else {
        console.log(`  Sleep session from ${latest.start} to ${latest.end} (processing...)`);
      }
    } else {
      console.log('  No sleep data available');
    }

    console.log('\n💪 Workout Data:');
    if (workouts.length > 0) {
      workouts.forEach((workout) => {
        if (workout.score) {
          const durationMinutes = (new Date(workout.end).getTime() - new Date(workout.start).getTime()) / (1000 * 60);
          console.log(`  Workout on ${new Date(workout.start).toLocaleDateString()}`);
          console.log(`    Duration: ${durationMinutes.toFixed(0)} minutes`);
          console.log(`    Strain: ${workout.score.strain}`);
          console.log(`    Avg HR: ${workout.score.average_heart_rate} bpm`);
          console.log(`    Max HR: ${workout.score.max_heart_rate} bpm`);
          console.log(`    Calories: ${workout.score.kilojoule.toFixed(0)} kJ`);
          if (workout.score.distance_meter) {
            console.log(`    Distance: ${(workout.score.distance_meter / 1000).toFixed(2)} km`);
          }
        }
      });
    } else {
      console.log('  No workouts available');
    }

    const dataDir = './data/whoop';
    await Bun.write(
      `${dataDir}/${now.toISOString().split('T')[0]}.json`,
      JSON.stringify(
        {
          timestamp,
          recovery,
          sleep,
          workouts,
        },
        null,
        2
      )
    );

    console.log(`\n✅ Data saved to ${dataDir}/${now.toISOString().split('T')[0]}.json\n`);
  } catch (error) {
    console.error('❌ Error fetching Whoop data:', error);
  }
}

if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.includes('--once')) {
    await fetchWhoopData();
    process.exit(0);
  }

  const intervalMinutes = parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1] || '60');
  console.log(`🕐 Running Whoop data fetcher every ${intervalMinutes} minutes`);
  console.log('   Press Ctrl+C to stop\n');

  await fetchWhoopData();

  setInterval(async () => {
    await fetchWhoopData();
  }, intervalMinutes * 60 * 1000);
}
