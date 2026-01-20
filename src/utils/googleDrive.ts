import { Config, MonthSchedule } from '@/types';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
}

interface DriveFileList {
  files: DriveFile[];
}

/**
 * Google Drive에서 폴더를 찾거나 생성합니다.
 */
async function findOrCreateFolder(
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<string> {
  // 기존 폴더 검색
  let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const searchResponse = await fetch(
    `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchResponse.ok) {
    throw new Error('폴더 검색에 실패했습니다.');
  }

  const searchResult: DriveFileList = await searchResponse.json();

  if (searchResult.files.length > 0) {
    return searchResult.files[0].id;
  }

  // 폴더 생성
  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentId) {
    metadata.parents = [parentId];
  }

  const createResponse = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!createResponse.ok) {
    throw new Error('폴더 생성에 실패했습니다.');
  }

  const createdFolder: DriveFile = await createResponse.json();
  return createdFolder.id;
}

/**
 * JSON 파일을 Google Drive에 저장합니다.
 */
async function saveJsonFile(
  accessToken: string,
  fileName: string,
  data: unknown,
  folderId: string
): Promise<string> {
  // 기존 파일 검색
  const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`;
  const searchResponse = await fetch(
    `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchResponse.ok) {
    throw new Error('파일 검색에 실패했습니다.');
  }

  const searchResult: DriveFileList = await searchResponse.json();
  const existingFileId = searchResult.files.length > 0 ? searchResult.files[0].id : null;

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });

  if (existingFileId) {
    // 기존 파일 업데이트
    const updateResponse = await fetch(
      `${DRIVE_UPLOAD_BASE}/files/${existingFileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: blob,
      }
    );

    if (!updateResponse.ok) {
      throw new Error('파일 업데이트에 실패했습니다.');
    }

    return existingFileId;
  } else {
    // 새 파일 생성 (multipart upload)
    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    const createResponse = await fetch(
      `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      }
    );

    if (!createResponse.ok) {
      throw new Error('파일 생성에 실패했습니다.');
    }

    const createdFile: DriveFile = await createResponse.json();
    return createdFile.id;
  }
}

/**
 * Google Drive에서 JSON 파일을 읽습니다.
 */
async function readJsonFile<T>(
  accessToken: string,
  fileName: string,
  folderId: string
): Promise<T | null> {
  const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`;
  const searchResponse = await fetch(
    `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchResponse.ok) {
    throw new Error('파일 검색에 실패했습니다.');
  }

  const searchResult: DriveFileList = await searchResponse.json();

  if (searchResult.files.length === 0) {
    return null;
  }

  const fileId = searchResult.files[0].id;
  const downloadResponse = await fetch(
    `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!downloadResponse.ok) {
    throw new Error('파일 다운로드에 실패했습니다.');
  }

  return downloadResponse.json();
}

/**
 * 병원 스케줄 폴더 구조를 초기화합니다.
 * 반환: { rootFolderId, schedulesFolderId }
 */
export async function initializeDriveFolders(
  accessToken: string,
  hospitalName: string
): Promise<{ rootFolderId: string; schedulesFolderId: string }> {
  const folderName = hospitalName ? `${hospitalName}_스케줄` : '진료_스케줄';
  
  // 루트 폴더 생성/찾기
  const rootFolderId = await findOrCreateFolder(accessToken, folderName);
  
  // schedules 하위 폴더 생성/찾기
  const schedulesFolderId = await findOrCreateFolder(accessToken, 'schedules', rootFolderId);

  return { rootFolderId, schedulesFolderId };
}

/**
 * config.json을 Google Drive에 저장합니다.
 */
export async function saveConfig(
  accessToken: string,
  rootFolderId: string,
  config: Config
): Promise<void> {
  await saveJsonFile(accessToken, 'config.json', config, rootFolderId);
}

/**
 * config.json을 Google Drive에서 읽습니다.
 */
export async function loadConfig(
  accessToken: string,
  rootFolderId: string
): Promise<Config | null> {
  return readJsonFile<Config>(accessToken, 'config.json', rootFolderId);
}

/**
 * 월별 스케줄을 Google Drive에 저장합니다.
 */
export async function saveMonthSchedule(
  accessToken: string,
  schedulesFolderId: string,
  year: number,
  month: number,
  schedule: MonthSchedule
): Promise<void> {
  const fileName = `${year}-${String(month).padStart(2, '0')}.json`;
  await saveJsonFile(accessToken, fileName, schedule, schedulesFolderId);
}

/**
 * 월별 스케줄을 Google Drive에서 읽습니다.
 */
export async function loadMonthSchedule(
  accessToken: string,
  schedulesFolderId: string,
  year: number,
  month: number
): Promise<MonthSchedule | null> {
  const fileName = `${year}-${String(month).padStart(2, '0')}.json`;
  return readJsonFile<MonthSchedule>(accessToken, fileName, schedulesFolderId);
}

/**
 * 모든 월별 스케줄을 Google Drive에서 읽습니다.
 */
export async function loadAllSchedules(
  accessToken: string,
  schedulesFolderId: string
): Promise<Record<string, MonthSchedule>> {
  // schedules 폴더의 모든 JSON 파일 목록 가져오기
  const query = `'${schedulesFolderId}' in parents and mimeType='application/json' and trashed=false`;
  const listResponse = await fetch(
    `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!listResponse.ok) {
    throw new Error('스케줄 목록을 가져오는데 실패했습니다.');
  }

  const listResult: DriveFileList = await listResponse.json();
  const schedules: Record<string, MonthSchedule> = {};

  // 각 파일 다운로드
  for (const file of listResult.files) {
    const downloadResponse = await fetch(
      `${DRIVE_API_BASE}/files/${file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadResponse.ok) {
      const schedule: MonthSchedule = await downloadResponse.json();
      const key = file.name.replace('.json', '');
      schedules[key] = schedule;
    }
  }

  return schedules;
}

/**
 * 병원명 변경 시 폴더명도 변경합니다.
 */
export async function renameDriveFolder(
  accessToken: string,
  folderId: string,
  newHospitalName: string
): Promise<void> {
  const newFolderName = newHospitalName ? `${newHospitalName}_스케줄` : '진료_스케줄';
  
  const response = await fetch(`${DRIVE_API_BASE}/files/${folderId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newFolderName }),
  });

  if (!response.ok) {
    throw new Error('폴더 이름 변경에 실패했습니다.');
  }
}
