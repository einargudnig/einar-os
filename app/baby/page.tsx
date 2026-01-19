"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Baby, TrendingUp, Loader2, Calendar, Scale } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

type VotingState = {
  gender: boolean;
  arrival: boolean;
  weight: boolean;
};

export default function BabyPage() {
  const [isVoting, setIsVoting] = useState<VotingState>({
    gender: false,
    arrival: false,
    weight: false,
  });

  // Gender prediction
  const genderTotals = useQuery(api.votes.getCurrentTotals);
  const recordGenderVote = useMutation(api.votes.recordVote);

  // Arrival prediction
  const arrivalTotals = useQuery(api.votes.getArrivalTotals);
  const recordArrivalVote = useMutation(api.votes.recordArrivalVote);

  // Weight prediction
  const weightTotals = useQuery(api.votes.getWeightTotals);
  const recordWeightVote = useMutation(api.votes.recordWeightVote);

  const handleGenderVote = async (gender: "boy" | "girl") => {
    setIsVoting((prev) => ({ ...prev, gender: true }));
    try {
      await recordGenderVote({ prediction: gender });
    } catch (error) {
      console.error("Error recording vote:", error);
      alert("Failed to record vote. Please try again.");
    } finally {
      setIsVoting((prev) => ({ ...prev, gender: false }));
    }
  };

  const handleArrivalVote = async (timing: "before" | "after") => {
    setIsVoting((prev) => ({ ...prev, arrival: true }));
    try {
      await recordArrivalVote({ prediction: timing });
    } catch (error) {
      console.error("Error recording vote:", error);
      alert("Failed to record vote. Please try again.");
    } finally {
      setIsVoting((prev) => ({ ...prev, arrival: false }));
    }
  };

  const handleWeightVote = async (weight: "over" | "under") => {
    setIsVoting((prev) => ({ ...prev, weight: true }));
    try {
      await recordWeightVote({ prediction: weight });
    } catch (error) {
      console.error("Error recording vote:", error);
      alert("Failed to record vote. Please try again.");
    } finally {
      setIsVoting((prev) => ({ ...prev, weight: false }));
    }
  };

  const isLoading = !genderTotals || !arrivalTotals || !weightTotals;

  // Gender stats
  const genderTotal = (genderTotals?.boy || 0) + (genderTotals?.girl || 0);
  const boyPercentage =
    genderTotal > 0
      ? Math.round(((genderTotals?.boy || 0) / genderTotal) * 100)
      : 0;
  const girlPercentage =
    genderTotal > 0
      ? Math.round(((genderTotals?.girl || 0) / genderTotal) * 100)
      : 0;

  // Arrival stats
  const arrivalTotal =
    (arrivalTotals?.before || 0) + (arrivalTotals?.after || 0);
  const beforePercentage =
    arrivalTotal > 0
      ? Math.round(((arrivalTotals?.before || 0) / arrivalTotal) * 100)
      : 0;
  const afterPercentage =
    arrivalTotal > 0
      ? Math.round(((arrivalTotals?.after || 0) / arrivalTotal) * 100)
      : 0;

  // Weight stats
  const weightTotal = (weightTotals?.over || 0) + (weightTotals?.under || 0);
  const overPercentage =
    weightTotal > 0
      ? Math.round(((weightTotals?.over || 0) / weightTotal) * 100)
      : 0;
  const underPercentage =
    weightTotal > 0
      ? Math.round(((weightTotals?.under || 0) / weightTotal) * 100)
      : 0;

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 mb-8">
      <div className="flex items-center gap-3">
        <Baby className="size-8 text-neutral-400" />
        <h1 className="font-semibold text-2xl font-serif">
          Baby Prediction Market
        </h1>
      </div>

      <div className="space-y-6">
        {/* Gender Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="size-4" />
                <span>Boy or Girl?</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="size-3" />
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <>
                <div className="flex justify-around text-center">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-blue-500">
                      {boyPercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">Boy</div>
                    <div className="text-xs text-neutral-600">
                      {genderTotals?.boy || 0} votes
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-pink-500">
                      {girlPercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">Girl</div>
                    <div className="text-xs text-neutral-600">
                      {genderTotals?.girl || 0} votes
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => handleGenderVote("boy")}
                    disabled={isVoting.gender}
                  >
                    {isVoting.gender ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Baby className="mr-2 size-4" />
                    )}
                    Vote Boy
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                    onClick={() => handleGenderVote("girl")}
                    disabled={isVoting.gender}
                  >
                    {isVoting.gender ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Baby className="mr-2 size-4" />
                    )}
                    Vote Girl
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Arrival Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Before or After Due Date?</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="size-3" />
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <>
                <div className="flex justify-around text-center">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-amber-500">
                      {beforePercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">Before</div>
                    <div className="text-xs text-neutral-600">
                      {arrivalTotals?.before || 0} votes
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-emerald-500">
                      {afterPercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">After</div>
                    <div className="text-xs text-neutral-600">
                      {arrivalTotals?.after || 0} votes
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                    onClick={() => handleArrivalVote("before")}
                    disabled={isVoting.arrival}
                  >
                    {isVoting.arrival ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Calendar className="mr-2 size-4" />
                    )}
                    Vote Before
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    onClick={() => handleArrivalVote("after")}
                    disabled={isVoting.arrival}
                  >
                    {isVoting.arrival ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Calendar className="mr-2 size-4" />
                    )}
                    Vote After
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Weight Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="size-4" />
                <span>Over or Under Average Weight?</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="size-3" />
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <>
                <p className="text-xs text-neutral-500 text-center">
                  Average newborn weight: ~3.5 kg (7.7 lbs)
                </p>
                <div className="flex justify-around text-center">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-violet-500">
                      {overPercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">Over</div>
                    <div className="text-xs text-neutral-600">
                      {weightTotals?.over || 0} votes
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-orange-500">
                      {underPercentage}%
                    </div>
                    <div className="text-sm text-neutral-500">Under</div>
                    <div className="text-xs text-neutral-600">
                      {weightTotals?.under || 0} votes
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                    onClick={() => handleWeightVote("over")}
                    disabled={isVoting.weight}
                  >
                    {isVoting.weight ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Scale className="mr-2 size-4" />
                    )}
                    Vote Over
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 max-w-xs bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                    onClick={() => handleWeightVote("under")}
                    disabled={isVoting.weight}
                  >
                    {isVoting.weight ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Scale className="mr-2 size-4" />
                    )}
                    Vote Under
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                This prediction market is powered by Convex, providing real-time
                updates as people cast their votes.
              </p>
              <p>
                Cast your predictions on three questions about the upcoming
                arrival!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
