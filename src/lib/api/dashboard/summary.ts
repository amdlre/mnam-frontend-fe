import { dashboardApi } from './fetcher';
import { DASHBOARD_ENDPOINTS } from './endpoints';

import type { DashboardSummary } from '@/types/dashboard';

interface ApiSummary {
  kpis: {
    current_month_revenue: number;
    current_guests: number;
    total_units: number;
    occupancy_rate?: number;
    booked_units?: number;
    cleaning_units?: number;
    maintenance_units?: number;
  };
  today_focus: {
    arrivals: Array<{ booking_id: string; guest_name: string; project_name: string; unit_name: string }>;
    departures: Array<{ booking_id: string; guest_name: string; project_name: string; unit_name: string }>;
    pending_checkins?: Array<{
      booking_id: string;
      guest_name: string;
      project_name: string;
      unit_name: string;
    }>;
  };
  upcoming_bookings: Array<{
    booking_id: string;
    guest_name: string;
    project_name: string;
    unit_name: string;
    check_in_date: string;
    total_price: number;
  }>;
  employee_performance?: {
    daily_bookings: number;
    daily_completed: number;
    daily_rate: number;
    daily_target: number;
    weekly_bookings: number;
    weekly_completed: number;
    weekly_rate: number;
    weekly_target: number;
  };
}

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  try {
    const data = await dashboardApi.get<ApiSummary>(DASHBOARD_ENDPOINTS.dashboard.summary);
    return {
      kpis: {
        currentMonthRevenue: data.kpis.current_month_revenue,
        currentGuests: data.kpis.current_guests,
        totalUnits: data.kpis.total_units,
        occupancyRate: data.kpis.occupancy_rate || 0,
        bookedUnits: data.kpis.booked_units || 0,
        cleaningUnits: data.kpis.cleaning_units || 0,
        maintenanceUnits: data.kpis.maintenance_units || 0,
      },
      todayFocus: {
        arrivals: data.today_focus.arrivals.map((a) => ({
          bookingId: a.booking_id,
          guestName: a.guest_name,
          projectName: a.project_name,
          unitName: a.unit_name,
        })),
        departures: data.today_focus.departures.map((d) => ({
          bookingId: d.booking_id,
          guestName: d.guest_name,
          projectName: d.project_name,
          unitName: d.unit_name,
        })),
        pendingCheckins: (data.today_focus.pending_checkins || []).map((p) => ({
          bookingId: p.booking_id,
          guestName: p.guest_name,
          projectName: p.project_name,
          unitName: p.unit_name,
        })),
      },
      upcomingBookings: data.upcoming_bookings.map((u) => ({
        bookingId: u.booking_id,
        guestName: u.guest_name,
        projectName: u.project_name,
        unitName: u.unit_name,
        checkInDate: u.check_in_date,
        totalPrice: u.total_price,
      })),
      employeePerformance: data.employee_performance
        ? {
            dailyBookings: data.employee_performance.daily_bookings,
            dailyCompleted: data.employee_performance.daily_completed,
            dailyRate: data.employee_performance.daily_rate,
            dailyTarget: data.employee_performance.daily_target,
            weeklyBookings: data.employee_performance.weekly_bookings,
            weeklyCompleted: data.employee_performance.weekly_completed,
            weeklyRate: data.employee_performance.weekly_rate,
            weeklyTarget: data.employee_performance.weekly_target,
          }
        : null,
    };
  } catch {
    return null;
  }
}
