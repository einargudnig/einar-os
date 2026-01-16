interface WhoopTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface WhoopRecovery {
  cycle_id: number;
  recovery_score: number;
  resting_heart_rate: number;
  hrv_rmssd_milli: number;
  spo2_percentage?: number;
  skin_temp_celsius?: number;
}

interface WhoopSleep {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score?: {
    stage_summary: {
      total_in_bed_time_milli: number;
      total_awake_time_milli: number;
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
    };
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
      need_from_recent_strain_milli: number;
      need_from_recent_nap_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

interface WhoopWorkout {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_id: number;
  score_state: string;
  score?: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
    distance_meter?: number;
    altitude_gain_meter?: number;
    altitude_change_meter?: number;
    zone_duration: {
      zone_zero_milli: number;
      zone_one_milli: number;
      zone_two_milli: number;
      zone_three_milli: number;
      zone_four_milli: number;
      zone_five_milli: number;
    };
  };
}

export class WhoopClient {
  private baseUrl = "https://api.prod.whoop.com/developer";
  private clientId: string;
  private clientSecret: string;
  private tokensFile: string;
  private tokens: WhoopTokens | null = null;

  constructor(
    clientId: string,
    clientSecret: string,
    tokensFile = ".whoop-tokens.json",
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokensFile = tokensFile;
  }

  async loadTokens(): Promise<void> {
    try {
      const file = Bun.file(this.tokensFile);
      const exists = await file.exists();
      if (exists) {
        this.tokens = await file.json();
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
      this.tokens = null;
    }
  }

  async saveTokens(tokens: WhoopTokens): Promise<void> {
    this.tokens = tokens;
    await Bun.write(this.tokensFile, JSON.stringify(tokens, null, 2));
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refresh_token) {
      throw new Error("No refresh token available. Please re-authenticate.");
    }

    const response = await fetch(
      "https://api.prod.whoop.com/oauth/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.tokens.refresh_token,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    await this.saveTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token || this.tokens.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    });
  }

  async ensureValidToken(): Promise<void> {
    await this.loadTokens();

    if (!this.tokens) {
      throw new Error("No tokens found. Please authenticate first.");
    }

    if (Date.now() >= this.tokens.expires_at - 60000) {
      await this.refreshAccessToken();
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    await this.ensureValidToken();

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.tokens!.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getRecovery(
    startDate?: Date,
    endDate?: Date,
  ): Promise<WhoopRecovery[]> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate.toISOString();
    if (endDate) params.end = endDate.toISOString();

    const response = await this.makeRequest<{ records: WhoopRecovery[] }>(
      "/v2/recovery",
      params,
    );
    return response.records;
  }

  async getSleep(startDate?: Date, endDate?: Date): Promise<WhoopSleep[]> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate.toISOString();
    if (endDate) params.end = endDate.toISOString();

    const response = await this.makeRequest<{ records: WhoopSleep[] }>(
      "/v2/activity/sleep",
      params,
    );
    return response.records;
  }

  async getWorkouts(startDate?: Date, endDate?: Date): Promise<WhoopWorkout[]> {
    const params: Record<string, string> = {};
    if (startDate) params.start = startDate.toISOString();
    if (endDate) params.end = endDate.toISOString();

    const response = await this.makeRequest<{ records: WhoopWorkout[] }>(
      "/v2/activity/workout",
      params,
    );
    return response.records;
  }

  async getUserProfile(): Promise<any> {
    return this.makeRequest("/v2/user/profile/basic");
  }

  async getBodyMeasurement(): Promise<any> {
    return this.makeRequest("/v2/user/measurement/body");
  }
}
