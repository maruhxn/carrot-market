import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image src={photo} alt={title} fill />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}

/**
 * Next Image
 * Image에 대한 일종의 placeholder를 만들어준다.
 * image loading optimize, placeholder 생성
 * -> 이미지가 로딩되는 동안 component 또는 image 주변의 content 위치가 바뀌지 않는다.
 * = Layout Shift 현상을 막아준다.
 *
 * 1. lazy load -> user가 이 이미지를 보고있는 동안에만 load
 * 2. srcset -> 다른 스크린 해상도에서 다른 image를 보여줄 수 있도록 허용
 * image loading 시 기본적으로 transparent 박스, invisible 박스를 갖게된다.
 * 크기만 전달하면 된다.
 *
 * 단, 크기를 모를 경우? => fill 옵션을 사용하자.
 */
