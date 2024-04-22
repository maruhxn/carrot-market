import CommentInput from "@/components/comment-input";
import CommentList from "@/components/comment-list";
import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowLeftIcon, EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(id: number) {
  await new Promise((r) => setTimeout(r, 5000));
  try {
    const post = await db.post.update({
      // update하고, 그 결과를 return 해줌.
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

function getCachedPost(postId: number) {
  const cachedOperation = nextCache(getPost, ["post-detail"], {
    tags: [`post-detail-${postId}`],
    revalidate: 60,
  });
  return cachedOperation(postId);
}

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

async function getComments(id: number) {
  try {
    console.log("comments hit!!");
    const comments = await db.comment.findMany({
      where: {
        postId: id,
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        payload: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 10,
    });
    return comments;
  } catch (e) {
    return null;
  }
}

export type InitialComments = Prisma.PromiseReturnType<typeof getComments>;

function getCachedComments(postId: number) {
  const cacheOperation = nextCache(getComments, ["product-comments"], {
    tags: [`comments-${postId}`],
    revalidate: 60,
  });
  return cacheOperation(postId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const comments = await getCachedComments(id);

  return (
    <div className="p-5 text-white">
      <Link className="my-5 text-white block" href="/life">
        <ArrowLeftIcon className="size-6" />
      </Link>
      <div className="flex items-center gap-2 mb-2">
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
        ) : (
          <UserIcon className="size-7 rounded-full" />
        )}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentInput postId={id} />
      <CommentList comments={comments} />
    </div>
  );
}
