import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  console.log("product");
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
const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail", "xxx"],
});

async function getProductTitle(id: number) {
  console.log("title");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

// nextCache가 받아온 인자를 자동으로 첫번째 인자 함수에 전달함.
const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxx"], // tags는 unique하지 않아도 된다.어플리케이션의 여러 cache들은 같은 tags를 공유할 수 있다.
  // 특정 태그를 가진 캐시를 revalidate하는 것이 가능하다.
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id); // 올바르지 않은 id값 에러 처리
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

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

  const revalidate = async () => {
    "use server";
    revalidateTag("xxx");
  };

  return (
    <div>
      <div className="relative aspect-square">
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
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          // <form action={deleteProduct}>
          //   <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
          //     Delete product
          //   </button>
          // </form>
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
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
  );
}

/**
 * 외부 API로부터 데이터를 fetch 함수를 통해 cookies나 headers를 쓰지 않으면, GET 요청 시 자동으로 데이터를 캐싱해줄 것이다.
 * 이때의 cache는 이제까지 배운 nextCache와 동일한 역할을 수행한다.
 * fetch("https://api.com", {
    next: {
      revalidate: 60,
      tags: ["hello"],
    },
  }); 
  => revalidatePath나 revalidateTag 등을 통해 fetch 호출까지 새로고침 해줄 수 있다.
 */
