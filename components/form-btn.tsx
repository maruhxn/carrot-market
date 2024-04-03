interface FormButtonProps {
  isLoading: boolean;
  text: string;
}

export default function FormButton({ isLoading, text }: FormButtonProps) {
  return (
    <button
      disabled={isLoading}
      className="primary-btn h-10
       disabled:bg-neutral-400
        disabled:text-neutral-300
         disabled:cursor-not-allowed"
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
}
