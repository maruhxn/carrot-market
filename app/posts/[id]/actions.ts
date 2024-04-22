"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
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
  payload: z.string({
    required_error: "Comment Payload is required.",
  }),
  postId: z.coerce.number({
    required_error: "Post Id is required.",
  }),
});

export const createComment = async (_: any, formData: FormData) => {
  const data = {
    payload: formData.get("payload"),
    postId: formData.get("postId"),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success) return result.error.flatten();

  const session = await getSession();

  if (!session.id) return;

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
          id: result.data.postId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  revalidateTag(`comments-${result.data.postId}`);
};
