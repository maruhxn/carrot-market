"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function FormButton({ text }: ButtonProps) {
  const { pending } = useFormStatus(); // 이 hook은 form의 자식 요소에서만 사용되어야 한다. => form의 상태에 따라 변경하고자 하는 component 내부에서 사용해야 한다. => FormButton에서 사용하자.
  // 자동으로 부모 form을 찾고 상호작용할 것.
  return (
    <button
      disabled={pending}
      className="primary-btn h-10
       disabled:bg-neutral-400
        disabled:text-neutral-300
         disabled:cursor-not-allowed"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
