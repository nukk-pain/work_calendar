'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Calendar, SettingsSidebar, PdfExportModal, SetupWizard } from '@/components';
import { useConfigStore, useScheduleStore, useAuthStore } from '@/stores';
import { generateMonthSchedule } from '@/utils/scheduleGenerator';
import { initGoogleAuth, requestAccessToken, getUserInfo, revokeToken } from '@/utils/googleAuth';
import { initializeDriveFolders, saveConfig, loadConfig, saveMonthSchedule, loadAllSchedules } from '@/utils/googleDrive';
import { PublicHoliday, DoctorDaySchedule, DayOfWeek, Config, MonthSchedule } from '@/types';

const AUTOSAVE_DELAY = 3000;

interface CalendarPageClientProps {
  year: number;
  month: number;
  publicHolidays: PublicHoliday[];
}

const DAY_OF_WEEK_MAP: Record<number, DayOfWeek> = {
  0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat',
};

export default function CalendarPageClient({
  year,
  month,
  publicHolidays,
}: CalendarPageClientProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedDataRef = useRef<string>('');

  const config = useConfigStore();
  const { setMonthSchedule, getMonthSchedule, updateDaySchedule, setAllSchedules, schedules } = useScheduleStore();
  const { 
    isLoggedIn, 
    user, 
    accessToken, 
    driveInfo,
    isLoading: authLoading,
    error: authError,
    setUser,
    setDriveInfo,
    logout,
    setLoading,
    setError,
    isTokenValid,
    clearExpiredToken,
  } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
    initGoogleAuth();
    clearExpiredToken();
  }, [clearExpiredToken]);

  useEffect(() => {
    if (isHydrated && config.doctors.length === 0 && !config.hospital.name) {
      setShowSetupWizard(true);
    }
  }, [isHydrated, config.doctors.length, config.hospital.name]);

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      const timer = setTimeout(() => setShowLoginBanner(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowLoginBanner(false);
  }, [isHydrated, isLoggedIn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsPdfModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const debouncedSyncToCloud = useCallback(async () => {
    if (!isLoggedIn || !accessToken || !driveInfo) return;

    const currentData = JSON.stringify({ config, schedules });
    if (currentData === lastSyncedDataRef.current) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        await saveConfig(accessToken, driveInfo.rootFolderId, config);
        
        const monthSchedule = schedules[`${year}-${String(month).padStart(2, '0')}`];
        if (monthSchedule) {
          await saveMonthSchedule(accessToken, driveInfo.schedulesFolderId, year, month, monthSchedule);
        }
        
        lastSyncedDataRef.current = currentData;
      } catch (err) {
        console.error('자동 저장 실패:', err);
      } finally {
        setIsSyncing(false);
      }
    }, AUTOSAVE_DELAY);
  }, [isLoggedIn, accessToken, driveInfo, config, schedules, year, month]);

  useEffect(() => {
    debouncedSyncToCloud();
  }, [schedules, debouncedSyncToCloud]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  const syncToGoogleDrive = useCallback(async (
    token: string,
    folders: { rootFolderId: string; schedulesFolderId: string },
    configData: Config,
    schedulesData: Record<string, MonthSchedule>
  ) => {
    await saveConfig(token, folders.rootFolderId, configData);
    for (const [key, schedule] of Object.entries(schedulesData)) {
      const [y, m] = key.split('-').map(Number);
      await saveMonthSchedule(token, folders.schedulesFolderId, y, m, schedule);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await requestAccessToken();
      const userInfo = await getUserInfo(token);
      
      setUser(
        { email: userInfo.email, name: userInfo.name, picture: userInfo.picture },
        token
      );

      setIsSyncing(true);
      const folders = await initializeDriveFolders(token, config.hospital.name);
      setDriveInfo(folders);

      const cloudConfig = await loadConfig(token, folders.rootFolderId);
      const cloudSchedules = await loadAllSchedules(token, folders.schedulesFolderId);

      if (cloudConfig) {
        config.setHospital(cloudConfig.hospital);
        cloudConfig.doctors.forEach(d => {
          if (!config.doctors.find(cd => cd.id === d.id)) {
            config.addDoctor(d);
          }
        });
      }

      if (Object.keys(cloudSchedules).length > 0) {
        setAllSchedules(cloudSchedules);
      } else {
        await syncToGoogleDrive(token, folders, config, schedules);
      }

      setIsSyncing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      setIsSyncing(false);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    if (accessToken) {
      revokeToken(accessToken);
    }
    logout();
  };

  const handleGenerateSchedule = () => {
    const schedule = generateMonthSchedule(
      year,
      month,
      config,
      publicHolidays,
      getMonthSchedule(year, month)
    );
    setMonthSchedule(year, month, schedule);
  };

  const handleUpdateSchedule = (day: number, doctorId: string, schedule: DoctorDaySchedule) => {
    updateDaySchedule(year, month, day, doctorId, schedule);
  };

  const handleResetSchedule = (day: number, doctorId: string) => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dayOfWeekKey = DAY_OF_WEEK_MAP[dayOfWeek];
    const defaultSchedule = config.defaultSchedule[doctorId];
    const daySchedule = defaultSchedule?.[dayOfWeekKey];

    if (!daySchedule) {
      updateDaySchedule(year, month, day, doctorId, { status: 'off', isManualEdit: false });
    } else {
      updateDaySchedule(year, month, day, doctorId, {
        status: 'work',
        start: daySchedule.start,
        end: daySchedule.end,
        isManualEdit: false,
      });
    }
  };

  const monthSchedule = getMonthSchedule(year, month);
  const activeDoctors = config.doctors.filter((d) => d.active).sort((a, b) => a.order - b.order);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showLoginBanner && !isLoggedIn && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-blue-700">
              Google 계정으로 로그인하면 데이터가 클라우드에 안전하게 저장됩니다.
            </p>
            <button
              onClick={() => setShowLoginBanner(false)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {config.hospital.name || '진료 스케줄러'}
          </h1>
          <div className="flex items-center gap-4">
            {isSyncing && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                동기화 중...
              </span>
            )}
            <button
              onClick={handleGenerateSchedule}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              스케줄 생성
            </button>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              PDF 내보내기
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={authLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    로그인 중...
                  </>
                ) : (
                  'Google 로그인'
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {authError && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-700">{authError}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">등록된 의사가 없습니다.</p>
            <p className="text-sm text-gray-400">
              우측 하단의 설정 버튼을 클릭하여 의사를 추가하고 스케줄을 생성해주세요.
            </p>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              설정 열기
            </button>
          </div>
        ) : (
          <Calendar
            year={year}
            month={month}
            hospitalName={config.hospital.name}
            doctors={activeDoctors}
            dayData={monthSchedule?.days || {}}
            onUpdateSchedule={handleUpdateSchedule}
            onResetSchedule={handleResetSchedule}
          />
        )}
      </main>

      <SettingsSidebar
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        year={year}
        month={month}
        hospitalName={config.hospital.name}
        doctors={activeDoctors}
        dayData={monthSchedule?.days || {}}
      />

      {showSetupWizard && (
        <SetupWizard onComplete={() => setShowSetupWizard(false)} />
      )}

      <footer className="py-8 border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <p>© {year} 진료 스케줄러. All rights reserved.</p>
          <a href="/privacy" className="hover:text-gray-900">
            개인정보처리방침
          </a>
        </div>
      </footer>
    </div>
  );
}
