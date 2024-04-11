import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const permitAllUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
}; // 인증되지 않은 user가 갈 수 있는 URL
// array가 아닌 object로 저장한 이유는, 검색 시간이 object가 O(1)로 더 빠르기 때문.

// app 폴더와 같은 레벨에 있어야 한다.
export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = permitAllUrls[request.nextUrl.pathname];
  if (!session.id) {
    // 로그아웃 상태에서 permitAllUrl이 아닌 라우트에 접근 시
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (exists) {
      // 로그인한 유저가 permitAllUrl로 접근 시,
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

/**
 * middleware는 페이지를 변경할 때마다 실행될 뿐만 아니라,
 * 모든 request 하나마다 실행된다.
 * 즉, user가 페이지를 변경할 때 뿐만 아니라 모든 상호작용에 대해 실행되는 것이다.
 * ex) Image 가져올때, Javascript 코드 다운로드할때, css 코드 다운 받을 때, robot이 웺사이트를 볼 때, favicon을 가져올 때 등등
 *
 */

// Edge Runtime
/**
 * middleware는 Edge runtime에서 실행되고, node.js에서 실행되지 않는다.
 * Edge runtime: 일종의 제한된 버전의 node.js로, node.js처럼 동작하지만 NodeJs가 할 수 있는 걸 모두 하지는 못한다.
 * 이를 사용하는 이유는, middleware가 모든 단일 request에 대해 실행되어야 하기 때문이다.
 * 모든 요청에 대해 node.js 코드를 실행하는 것은 모든 요청에 대해 nodejs runtime을 싱행해야 하므로 매우 느릴 것.
 *
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
