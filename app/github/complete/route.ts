import { notFound } from "next/navigation";
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

  const accessTokenResponse = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("error" in accessTokenResponse) {
    return new Response(null, {
      status: 400,
    });
  }

  return Response.json({ accessTokenResponse });
}
