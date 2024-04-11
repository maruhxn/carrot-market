import { GitHubEmail } from "./types";

export const getAccessToken = async (code: string) => {
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

  return access_token;
};

export const getUserProfile = async (accessToken: string) => {
  const { id, login, avatar_url } = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache", // Next.js에서 GET 요청 시 기본적으로 해당 요청은 캐싱되므로 꺼준다.
    })
  ).json();

  return { id, login, avatar_url };
};

export const getEmailData = async (accessToken: string) => {
  const emails: GitHubEmail[] | null | undefined = await (
    await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache", // Next.js에서 GET 요청 시 기본적으로 해당 요청은 캐싱되므로 꺼준다.
    })
  ).json();

  return emails && emails.length > 0 ? emails[0].email : null;
};
