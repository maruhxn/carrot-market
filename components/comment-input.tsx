"use client";

import { createComment } from "@/app/posts/[id]/actions";
import Input from "@/components/input";
import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

interface CommentInputProps {
  postId: number;
}

export default function CommentInput({ postId }: CommentInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useFormState(createComment, null);
  const { pending } = useFormStatus();

  const onAction = (payload: FormData) => {
    dispatch(payload);
    ref.current!.value = "";
  };

  return (
    <form action={onAction} className="flex gap-2 my-4">
      <div className="flex-1">
        <Input
          ref={ref}
          type="text"
          name="payload"
          required
          placeholder="댓글을 입력하세요.."
          errors={state?.fieldErrors.payload}
        />
      </div>
      <input
        readOnly
        required
        id="postId"
        name="postId"
        type="number"
        defaultValue={postId}
        className="hidden"
      />
      <button
        disabled={pending}
        className="primary-btn h-10
       disabled:bg-neutral-400
        disabled:text-neutral-300
         disabled:cursor-not-allowed w-1/5"
      >
        {pending ? "Loading..." : "작성 완료"}
      </button>
    </form>
  );
}
