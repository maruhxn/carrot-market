import { InitialComments } from "@/app/posts/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface CommentListProps {
  comments: InitialComments;
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div>
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-center gap-2 mb-2">
          {comment.user.avatar ? (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={comment.user.avatar!}
              alt={comment.user.username}
            />
          ) : (
            <UserIcon className="size-7 rounded-full" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {comment.user.username}
              </span>
              <span className="text-xs font-thin">
                {formatToTimeAgo(comment.updated_at.toString())}
              </span>
            </div>
            <div className="text-sm">
              <span>{comment.payload}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
