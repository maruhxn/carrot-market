import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { URLSearchParams } from "url";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return notFound();

  const ACCESS_TOKEN_BASE_URL = "https://github.com/login/oauth/access_token";
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `${ACCESS_TOKEN_BASE_URL}?${accessTokenParams}`;

  const { error, access_token } = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, login, avatar_url } = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache", // Next.js에서 GET 요청 시 기본적으로 해당 요청은 캐싱되므로 꺼준다.
    })
  ).json();

  let user = null;

  user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        username: login,
        github_id: id + "",
        avatar: avatar_url,
      },
      select: {
        id: true,
      },
    });
  }

  const session = await getSession();
  session.id = user?.id;
  await session.save();

  return redirect("/profile");
}
