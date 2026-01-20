import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MonthSchedule, DayData, DoctorDaySchedule } from '@/types';

interface ScheduleState {
  schedules: Record<string, MonthSchedule>;
  setMonthSchedule: (year: number, month: number, schedule: MonthSchedule) => void;
  updateDaySchedule: (
    year: number,
    month: number,
    day: number,
    doctorId: string,
    schedule: DoctorDaySchedule
  ) => void;
  updateDayData: (year: number, month: number, day: number, data: Partial<DayData>) => void;
  getMonthSchedule: (year: number, month: number) => MonthSchedule | undefined;
  clearMonthSchedule: (year: number, month: number) => void;
  setAllSchedules: (schedules: Record<string, MonthSchedule>) => void;
  resetAllSchedules: () => void;
}

const getScheduleKey = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`;

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: {},

      setMonthSchedule: (year, month, schedule) =>
        set((state) => ({
          schedules: {
            ...state.schedules,
            [getScheduleKey(year, month)]: schedule,
          },
        })),

      updateDaySchedule: (year, month, day, doctorId, schedule) =>
        set((state) => {
          const key = getScheduleKey(year, month);
          const monthSchedule = state.schedules[key];
          if (!monthSchedule) return state;

          const dayKey = String(day);
          const dayData = monthSchedule.days[dayKey] || { isHoliday: false, doctors: {} };

          return {
            schedules: {
              ...state.schedules,
              [key]: {
                ...monthSchedule,
                days: {
                  ...monthSchedule.days,
                  [dayKey]: {
                    ...dayData,
                    doctors: {
                      ...dayData.doctors,
                      [doctorId]: schedule,
                    },
                  },
                },
              },
            },
          };
        }),

      updateDayData: (year, month, day, data) =>
        set((state) => {
          const key = getScheduleKey(year, month);
          const monthSchedule = state.schedules[key];
          if (!monthSchedule) return state;

          const dayKey = String(day);
          const dayData = monthSchedule.days[dayKey] || { isHoliday: false, doctors: {} };

          return {
            schedules: {
              ...state.schedules,
              [key]: {
                ...monthSchedule,
                days: {
                  ...monthSchedule.days,
                  [dayKey]: { ...dayData, ...data },
                },
              },
            },
          };
        }),

      getMonthSchedule: (year, month) => {
        const key = getScheduleKey(year, month);
        return get().schedules[key];
      },

      clearMonthSchedule: (year, month) =>
        set((state) => {
          const key = getScheduleKey(year, month);
          const { [key]: _, ...rest } = state.schedules;
          return { schedules: rest };
        }),

      setAllSchedules: (schedules) => set({ schedules }),

      resetAllSchedules: () => set({ schedules: {} }),
    }),
    {
      name: 'schedule-data',
    }
  )
);
