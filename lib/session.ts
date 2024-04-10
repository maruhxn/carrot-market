import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}

/**
 * IronSession을 사용하면 session table에 값을 저장하여 매칭되는 값을 찾아오는 방식이 아니라,
 * Jwt처럼 session 값 자체에 정보를 포함시켜서 데이터베이스 조회없이 바로 decode 후 정보를 사용 가능하다.
 */
