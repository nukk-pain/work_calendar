# 환경 변수 설정 가이드

이 프로젝트를 실행하기 위해 필요한 Google Cloud Platform(GCP) 및 Google Analytics(GA4) 키를 발급받는 방법입니다.

---

## 1. Google OAuth Client ID 발급 (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`)

Google 로그인 및 Google Drive 연동을 위해 필요합니다.

### 1단계: 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 좌측 상단 프로젝트 선택 메뉴에서 **"새 프로젝트"**를 클릭합니다.
3. 프로젝트 이름(예: `Work Calendar`)을 입력하고 **"만들기"**를 클릭합니다.

### 2단계: Google Drive API 활성화
1. 좌측 메뉴에서 **"API 및 서비스" > "라이브러리"**로 이동합니다.
2. 검색창에 `Google Drive API`를 검색합니다.
3. **"사용"** 버튼을 클릭하여 활성화합니다.

### 3단계: OAuth 동의 화면 구성
1. 좌측 메뉴에서 **"API 및 서비스" > "OAuth 동의 화면"**으로 이동합니다.
2. User Type을 **"외부(External)"**로 선택하고 "만들기"를 클릭합니다.
3. 앱 정보 입력:
   - **앱 이름**: 진료 스케줄러 (사용자에게 표시됨)
   - **사용자 지원 이메일**: 본인 이메일 선택
   - **개발자 연락처 정보**: 본인 이메일 입력
4. "저장 후 계속" 클릭.
5. **범위(Scopes)** 설정:
   - "범위 추가 또는 삭제" 클릭.
   - `../auth/drive.file` (Google Drive의 파일 보기 및 관리)를 검색하여 체크하고 업데이트합니다.
   - (참고: `drive.file` 스코프는 이 앱이 생성한 파일만 접근 권한을 가집니다.)
6. "저장 후 계속" 클릭.
7. **테스트 사용자**:
   - 앱 게시 상태가 "테스트"인 경우, 로그인할 Google 계정을 추가해야 합니다.
   - "ADD USERS"를 클릭하여 본인 계정을 추가합니다.

### 4단계: 사용자 인증 정보(Credentials) 생성
1. 좌측 메뉴에서 **"API 및 서비스" > "사용자 인증 정보"**로 이동합니다.
2. 상단 **"사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"**를 선택합니다.
3. 애플리케이션 유형: **"웹 애플리케이션"** 선택.
4. 이름: `Work Calendar Web` (식별용).
5. **승인된 자바스크립트 원본 (Authorized JavaScript origins)**:
   - `http://localhost:3000` (개발용)
   - `https://your-app-name.vercel.app` (배포 후 도메인 추가)
6. **승인된 리디렉션 URI**: (이 프로젝트는 팝업 방식을 사용하므로 비워두거나 원본과 동일하게 설정해도 무방합니다.)
7. **"만들기"** 클릭.
8. 생성된 **"클라이언트 ID"**를 복사합니다. (비밀번호(Client Secret)는 프론트엔드 전용이므로 필요하지 않습니다.)

---

## 2. Google Analytics 4 ID 발급 (`NEXT_PUBLIC_GA_ID`)

방문자 통계 수집을 위해 필요합니다.

1. [Google Analytics](https://analytics.google.com/)에 접속합니다.
2. 좌측 하단 **"관리(Admin)"** (톱니바퀴 아이콘)를 클릭합니다.
3. **"계정 만들기"** 또는 기존 계정에서 **"속성 만들기"**를 클릭합니다.
4. 속성 이름(예: `Work Calendar`)을 입력하고 다음으로 진행합니다.
5. 비즈니스 정보는 적절히 선택하고 "만들기"를 클릭합니다.
6. **데이터 수집 시작** 화면에서 플랫폼으로 **"웹"**을 선택합니다.
7. 웹사이트 URL:
   - 개발 중이면 `localhost:3000` 입력 가능 (나중에 수정 가능).
   - 배포 후엔 실제 도메인 입력.
   - 스트림 이름: `Work Calendar Web`.
8. "스트림 만들기" 클릭.
9. 생성된 화면에서 **"측정 ID (Measurement ID)"**를 복사합니다. (형식: `G-XXXXXXXXXX`)

---

## 3. 환경 변수 적용

프로젝트 최상위 폴더에 `.env.local` 파일을 생성하고 아래 내용을 붙여넣으세요.

```bash
# Google Cloud Console -> API 및 서비스 -> 사용자 인증 정보
NEXT_PUBLIC_GOOGLE_CLIENT_ID=복사한_클라이언트_ID

# Google Analytics -> 관리 -> 데이터 스트림
NEXT_PUBLIC_GA_ID=복사한_측정_ID
```

### 주의사항
- `.env.local` 파일은 git에 커밋되지 않도록 `.gitignore`에 포함되어 있습니다 (기본 설정).
- Vercel 배포 시에는 Vercel 프로젝트 설정의 **Settings > Environment Variables** 메뉴에 동일한 키와 값을 추가해야 합니다.
