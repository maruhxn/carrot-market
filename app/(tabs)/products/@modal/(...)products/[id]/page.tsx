import XButton from "@/components/x-button";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id); // 올바르지 않은 id값 에러 처리
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const deleteProduct = async () => {
    "use server";
    await db.product.delete({
      where: {
        id,
      },
    });

    redirect("/products");
  };

  return (
    <div className="absolute w-full h-full z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <XButton />
      <div className="w-2/3 md:w-1/2 max-w-screen-sm">
        <div className="h-full bg-neutral-700 text-neutral-200">
          <div className="aspect-square relative">
            <Image
              className="object-cover"
              fill
              src={product.photo}
              alt={product.title}
            />
          </div>
          <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <h3>{product.user.username}</h3>
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-lg font-semibold">{product.title}</h1>
            <p>{product.description}</p>
          </div>
          <div className="w-full p-5 flex justify-between items-center">
            <span className="font-semibold text-xl">
              {formatToWon(product.price)}원
            </span>
            {isOwner ? (
              <form action={deleteProduct}>
                <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                  Delete
                </button>
              </form>
            ) : null}
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={``}
            >
              채팅하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
/** Intercepting Routes
 * Intercepting Routes: 애플리케이션의 다른 부분에서 현재의 레이아웃으로 route를 불러올 수 있도록 해준다.
 * => 사용자가 '/product/[id]'로 가려고 product를 클릭할 때 사용자에게 실제로 /product/[id] 페이지를 보여주는 대신에 다른 component를 보여줄 수 있다.
 * 이건 사용자가 그 페이지로 가려고 제품을 클릭할 때만 발생한다. 즉, 그 페이지로 가는 것을 가로채는 것이다.
 *
 * 시작 폴더(페이지) 밑에 intecepting 할 routes를 생성해주면 된다.
 * 이때,작명 시 (..)(..)와 같이 대상 페이지의 파일 상대 경로를 찾아가는 것처럼 작명한다.
 * 현재 폴더 내의 라우트라면 (.), 상위 폴더 내의 라우트라면 (..), 루트 app 폴더라면 (....)
 * ex)
 * (tabs)/products
 *  -> (..)products/[id]
 * /products/[id]
 */
