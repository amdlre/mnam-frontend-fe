import { DASHBOARD_ENDPOINTS } from './endpoints';
import { dashboardApi } from './fetcher';

export interface TeamAchievement {
  dailyChallenge: {
    unitOccupancy: number;
    guestNights: number;
    todayIncome: number;
    totalCancellations: number;
  };
  weeklyPerformance: {
    totalNights: number;
    weeklyOccupancyRate: number;
    revenueCollection: number;
    totalCancellations: number;
  };
  monthlyHarvest: {
    monthlyOccupancyRate: number;
    nightsSales: number;
    projectIncome: number;
    totalCancellations: number;
  };
}

interface ApiTeamAchievement {
  daily_challenge: {
    unit_occupancy?: number;
    guest_nights?: number;
    today_income?: number;
    total_cancellations?: number;
  };
  weekly_performance: {
    total_nights?: number;
    weekly_occupancy_rate?: number;
    revenue_collection?: number;
    total_cancellations?: number;
  };
  monthly_harvest: {
    monthly_occupancy_rate?: number;
    nights_sales?: number;
    project_income?: number;
    total_cancellations?: number;
  };
}

const ZERO_ACHIEVEMENT: TeamAchievement = {
  dailyChallenge: { unitOccupancy: 0, guestNights: 0, todayIncome: 0, totalCancellations: 0 },
  weeklyPerformance: { totalNights: 0, weeklyOccupancyRate: 0, revenueCollection: 0, totalCancellations: 0 },
  monthlyHarvest: { monthlyOccupancyRate: 0, nightsSales: 0, projectIncome: 0, totalCancellations: 0 },
};

export async function fetchTeamAchievement(): Promise<TeamAchievement> {
  try {
    const data = await dashboardApi.get<ApiTeamAchievement>(DASHBOARD_ENDPOINTS.transactions.teamAchievement);
    return {
      dailyChallenge: {
        unitOccupancy: data.daily_challenge.unit_occupancy ?? 0,
        guestNights: data.daily_challenge.guest_nights ?? 0,
        todayIncome: data.daily_challenge.today_income ?? 0,
        totalCancellations: data.daily_challenge.total_cancellations ?? 0,
      },
      weeklyPerformance: {
        totalNights: data.weekly_performance.total_nights ?? 0,
        weeklyOccupancyRate: data.weekly_performance.weekly_occupancy_rate ?? 0,
        revenueCollection: data.weekly_performance.revenue_collection ?? 0,
        totalCancellations: data.weekly_performance.total_cancellations ?? 0,
      },
      monthlyHarvest: {
        monthlyOccupancyRate: data.monthly_harvest.monthly_occupancy_rate ?? 0,
        nightsSales: data.monthly_harvest.nights_sales ?? 0,
        projectIncome: data.monthly_harvest.project_income ?? 0,
        totalCancellations: data.monthly_harvest.total_cancellations ?? 0,
      },
    };
  } catch {
    return ZERO_ACHIEVEMENT;
  }
}
