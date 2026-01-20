import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Config, 
  Doctor, 
  WeeklySchedule, 
  RecurringRule, 
  HospitalHoliday,
  Hospital 
} from '@/types';

interface ConfigState extends Config {
  setHospital: (hospital: Hospital) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  removeDoctor: (id: string) => void;
  reorderDoctors: (doctorIds: string[]) => void;
  setDefaultSchedule: (doctorId: string, schedule: WeeklySchedule) => void;
  addRecurringRule: (rule: RecurringRule) => void;
  updateRecurringRule: (id: string, updates: Partial<RecurringRule>) => void;
  removeRecurringRule: (id: string) => void;
  addHospitalHoliday: (holiday: HospitalHoliday) => void;
  removeHospitalHoliday: (id: string) => void;
  resetConfig: () => void;
}

const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  sun: null,
  mon: { start: '09:00', end: '18:00' },
  tue: { start: '09:00', end: '18:00' },
  wed: { start: '09:00', end: '18:00' },
  thu: { start: '09:00', end: '18:00' },
  fri: { start: '09:00', end: '18:00' },
  sat: { start: '09:00', end: '13:00' },
};

const initialConfig: Config = {
  hospital: { name: '' },
  doctors: [],
  defaultSchedule: {},
  recurringRules: [],
  hospitalHolidays: [],
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...initialConfig,

      setHospital: (hospital) => set({ hospital }),

      addDoctor: (doctor) =>
        set((state) => ({
          doctors: [...state.doctors, doctor],
          defaultSchedule: {
            ...state.defaultSchedule,
            [doctor.id]: DEFAULT_WEEKLY_SCHEDULE,
          },
        })),

      updateDoctor: (id, updates) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      removeDoctor: (id) =>
        set((state) => {
          const { [id]: _, ...restSchedule } = state.defaultSchedule;
          return {
            doctors: state.doctors.filter((d) => d.id !== id),
            defaultSchedule: restSchedule,
            recurringRules: state.recurringRules.filter((r) => r.doctorId !== id),
          };
        }),

      reorderDoctors: (doctorIds) =>
        set((state) => ({
          doctors: doctorIds
            .map((id, index) => {
              const doctor = state.doctors.find((d) => d.id === id);
              return doctor ? { ...doctor, order: index } : null;
            })
            .filter((d): d is Doctor => d !== null),
        })),

      setDefaultSchedule: (doctorId, schedule) =>
        set((state) => ({
          defaultSchedule: {
            ...state.defaultSchedule,
            [doctorId]: schedule,
          },
        })),

      addRecurringRule: (rule) =>
        set((state) => ({
          recurringRules: [...state.recurringRules, rule],
        })),

      updateRecurringRule: (id, updates) =>
        set((state) => ({
          recurringRules: state.recurringRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      removeRecurringRule: (id) =>
        set((state) => ({
          recurringRules: state.recurringRules.filter((r) => r.id !== id),
        })),

      addHospitalHoliday: (holiday) =>
        set((state) => ({
          hospitalHolidays: [...state.hospitalHolidays, holiday],
        })),

      removeHospitalHoliday: (id) =>
        set((state) => ({
          hospitalHolidays: state.hospitalHolidays.filter((h) => h.id !== id),
        })),

      resetConfig: () => set(initialConfig),
    }),
    {
      name: 'schedule-config',
    }
  )
);
