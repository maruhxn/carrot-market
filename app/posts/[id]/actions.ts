"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const likePost = async (postId: number) => {
  const session = await getSession();
  await new Promise((r) => setTimeout(r, 5000));
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async (postId: number) => {
  const session = await getSession();
  await new Promise((r) => setTimeout(r, 5000));
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};

const commentSchema = z.object({
  payload: z
    .string({
      required_error: "Comment Payload is required.",
    })
    .min(1),
});

interface ActionState {
  postId: number;
}

export const createComment = async (
  prevState: ActionState,
  formData: FormData
) => {
  const data = {
    payload: formData.get("payload"),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success)
    return {
      postId: prevState.postId,
      error: result.error.flatten(),
    };

  const session = await getSession();

  if (!session.id) return redirect("/login");

  await db.comment.create({
    data: {
      payload: result.data.payload,
      user: {
        connect: {
          id: session.id,
        },
      },
      post: {
        connect: {
          id: prevState.postId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  revalidateTag(`comments-${prevState.postId}`);

  return {
    postId: prevState.postId,
  };
};
