# Runner Game

React, TypeScript, PixiJS로 만든 2단 점프 러너 게임입니다. Supabase는 최고 기록 50개를 조회하고 새 기록을 저장하는 데만 사용됩니다. Supabase가 설정되지 않거나 일시적으로 접속할 수 없어도 게임은 실행됩니다.

## 로컬 실행

```sh
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 현재 활성 상태인 Supabase 프로젝트의 값을 설정합니다.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

환경 변수를 바꾼 뒤에는 Vite 개발 서버를 재시작해야 합니다. 브라우저에 노출되는 publishable/anon key만 사용하고 `service_role` key는 절대 넣지 마세요.

## 중지된 Supabase 프로젝트 이전

기존 `runner-game` 프로젝트는 2025년 6월 30일에 중지된 후 1년을 넘겨 기존 프로젝트 자체를 대시보드에서 재개할 수 없습니다. 아래 절차로 새 프로젝트에 이전합니다.

1. 기존 프로젝트 화면의 **Download backups**에서 데이터베이스 백업과 Storage 파일을 모두 다운로드합니다.
2. Supabase에서 새 프로젝트를 만듭니다.
3. 새 프로젝트의 **Connect** 화면에서 Session pooler 연결 문자열을 복사한 뒤 백업을 복원합니다.

   ```sh
   psql -d "NEW_PROJECT_SESSION_POOLER_URL" -f /path/to/backup.backup
   ```

4. 백업에 `scores` 테이블이 없거나 기존 데이터가 필요 없다면 새 프로젝트의 SQL Editor에서 `supabase/migrations/20261012000000_create_scores.sql`을 실행합니다.
5. 새 프로젝트의 URL과 publishable/anon key를 `.env.local`에 입력합니다.
6. `npm run dev`를 재시작하고 순위 조회와 점수 저장을 확인합니다.

백업을 복원하면 Auth 설정, API key, Edge Functions, Realtime 설정 등 데이터베이스 외부 설정은 자동으로 이전되지 않을 수 있습니다. 이 프로젝트의 현재 코드는 Auth, Storage, Edge Functions을 사용하지 않습니다.

## 검증

```sh
npm run lint
npm run build
```
