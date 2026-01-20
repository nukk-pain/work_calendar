export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 개인정보의 처리 목적</h2>
            <p>
              '진료 스케줄러'는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>서비스 제공 및 관리: Google 계정 연동을 통한 데이터 동기화 및 저장</li>
              <li>서비스 개선: 접속 빈도 파악 및 서비스 이용에 대한 통계 (Google Analytics 사용)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 처리하는 개인정보의 항목</h2>
            <p>
              '진료 스케줄러'는 서비스 제공을 위해 다음의 개인정보를 처리하고 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>필수항목: Google 계정 정보 (이메일, 이름, 프로필 사진)</li>
              <li>수집방법: Google OAuth 2.0 연동을 통한 자동 수집</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h2>
            <p>
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Google Drive 접근 토큰: 30일 (자동 로그인 유지 목적)</li>
              <li>Google 계정 정보: 로그아웃 시까지 (브라우저 로컬 저장소)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. 개인정보의 파기</h2>
            <p>
              이용자는 언제든지 로그아웃 기능을 통해 저장된 개인정보(토큰 및 프로필 정보)를 로컬 저장소에서 즉시 파기할 수 있습니다. Google 계정 연동 해제는 Google 계정 관리 페이지에서 가능합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. 쿠키의 사용</h2>
            <p>
              '진료 스케줄러'는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)' 등을 사용합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>사용 목적: 자동 로그인 유지, 설정 정보 저장</li>
              <li>거부 방법: 웹브라우저 옵션 설정을 통해 쿠키 허용/차단 가능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. 문의처</h2>
            <p>
              서비스 이용 중 발생하는 개인정보 관련 문의사항은 아래 연락처로 문의 주시기 바랍니다.
            </p>
            <p className="mt-2 font-medium">이메일: nukkpain@gmail.com</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            ← 메인 화면으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
