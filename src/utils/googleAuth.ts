const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

let tokenClient: google.accounts.oauth2.TokenClient | null = null;

export function initGoogleAuth(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !GOOGLE_CLIENT_ID) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID가 설정되지 않았습니다.'));
      return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken();
  });
}

export async function getUserInfo(accessToken: string): Promise<GoogleUser> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }

  return response.json();
}

export function revokeToken(accessToken: string): void {
  google.accounts.oauth2.revoke(accessToken, () => {});
}
