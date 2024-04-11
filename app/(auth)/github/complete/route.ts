import db from "@/lib/db";
import { saveLoginSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getAccessToken, getEmailData, getUserProfile } from "./request";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code)
    return new Response(null, {
      status: 400,
    });

  const accessToken = await getAccessToken(code);
  const { id, login, avatar_url } = await getUserProfile(accessToken);
  const email = await getEmailData(accessToken);

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
    const existingUser = await db.user.findUnique({
      where: {
        username: login,
      },
      select: {
        id: true,
      },
    });

    user = await db.user.create({
      data: {
        username: existingUser ? `${login}_gh` : login,
        github_id: id + "",
        avatar: avatar_url,
        email,
      },
      select: {
        id: true,
      },
    });
  }

  await saveLoginSession(user.id);

  return redirect("/profile");
}
