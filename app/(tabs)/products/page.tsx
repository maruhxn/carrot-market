import ProductList from "@/components/product-list";
import { PRODUCTS_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(
  getInitialProducts,
  ["home-products"],
  { revalidate: 60 }
  // 60초마다 실행한다는 것이 아니라, 함수가 호출된 후 60초가 지나지 않은 경우 NextJS는 cache 안에 있는 데이터를 return 한다는 의미.
  // 60초가 지난 상태라면, NextJs는 최신 데이터 복사본을 얻기위해 이 함수를 다시 실행
  // => 언제 cache 안의 데이터가 오래됐다고 간주하는지, 새로고침을 필요로 하는지에 대한 것.
  // user가 최초 페이지 방문을 한지 1주일이 지난 후 재방문을 했다면, 이는 오래됐다고 간주하고 함수를 실행할 것. 60초마다 실행하는게 아님.
);
// 일단 Next.Js Cache로 가서 key에 대한 데이터를 조회하고, 있으면 반환, 없으면 getInitialProducts 실행하여 response를 메모리에 저장해줄 것.
async function getInitialProducts() {
  console.log("hit!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: PRODUCTS_PAGE_SIZE,
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed
      bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
