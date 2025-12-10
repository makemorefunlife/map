import { Suspense } from "react";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

/**
 * Supabase 연결 테스트 페이지
 *
 * 이 페이지는 Supabase와의 연결을 테스트하고,
 * 데이터베이스에서 데이터를 조회하는 방법을 보여줍니다.
 *
 * 사용 방법:
 * 1. Supabase Dashboard에서 테스트용 테이블 생성
 * 2. 환경 변수 설정 확인
 * 3. 이 페이지에서 데이터 조회 확인
 */
async function SupabaseData() {
  const supabase = await createClerkSupabaseClient();

  // users 테이블에서 데이터 조회 (예시)
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .limit(10);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Supabase 연결 오류
        </h2>
        <p className="text-red-600 mb-4">{error.message}</p>
        <div className="bg-white p-4 rounded border border-red-200">
          <p className="text-sm font-mono text-red-800">
            {JSON.stringify(error, null, 2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          ✅ Supabase 연결 성공!
        </h2>
        <p className="text-green-600">
          {users?.length || 0}개의 사용자 데이터를 조회했습니다.
        </p>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">조회된 데이터:</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            ⚠️ 데이터가 없습니다. Supabase에서 테이블을 생성하고 데이터를 추가해보세요.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SupabaseTestPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Supabase 연결 테스트</h1>
        <p className="text-gray-600">
          이 페이지는 Supabase와의 연결을 테스트하고 데이터를 조회합니다.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">데이터를 불러오는 중...</p>
          </div>
        }
      >
        <SupabaseData />
      </Suspense>

      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">사용 방법</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Supabase Dashboard에서 테스트용 테이블을 생성하거나 기존 테이블을 사용합니다.
          </li>
          <li>
            환경 변수 파일(`.env`)에 Supabase URL과 API 키가 올바르게 설정되어 있는지 확인합니다.
          </li>
          <li>
            이 페이지에서 데이터 조회가 정상적으로 작동하는지 확인합니다.
          </li>
        </ol>
      </div>
    </div>
  );
}

