import ProductList from "@/components/product-list";
import { PRODUCTS_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
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

// export const dynamic = "force-dynamic";
/**
 * dynamic은 route segment config 옵션 중 하나로, 이것은 page, layout, route handler의 동작을 구성할 수 있도록 해준다.
 * 기본값은 'auto'이다.
 *
 * - auto: 우리의 페이지가 가능한 한 많은 cache를 사용하게 될 것을 의미한다.
 * - force-dynamic: dynamic rendering을 강제로 실행시킨다. => 사용자가 페이지를 방문할 때마다 이전 버전의 HTML을 볼 수 없다. 즉, 방문할 때마다 새로운 HTML을 generate 한다.
 * => force-dynamic을 사용해야 nextCache가 의미있다.
 * - force-static
 * - error
 */

export const revalidate = 30;
/**
 * revalidate: 특정한 시간에 페이지를 revalidate 하도록 Next.js에게 지시할 수 있다.
 * Page 단위로 nextCache 및 revalidate 속성을 적용한 느낌이다.
 */

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/products"); // /products URL에 해당하는 페이지와 관련된 모든 내용을 새로고침
    // 문제는 제어권이 별로 없다는 것. 이 페이지에서 nextCache를 3번 사용했다면 revalidatePath("/products") 했을 때 3개의 cache가 새로고침됨.
    // 어떤 cache를 새로고침할지 정할 수 없음.. => 이건 revalidateTag를 사용해야 함.
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
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

/**
 * cache를 사용하지 않고 단순히 getInitialProducts를 사용한다면 이 페이지는 build 시 static page로 인식된다.
 * 필요한 데이터는 빌드 과정에서 미리 받아오고 response를 바탕으로 정적인 static html을 생성하여 이를 보여준다. (prod로 구동 시)
 * 그 이유는, 이 페이지는 cookie를 사용하지 않기 때문이다. => 보는 사람에 따라 내용이 달라지지 않는다 => static이다.
 *
 * 새로고침을 하더라도 database를 다시 호출하지 않는다. 다만, 오직 revalidate를 수행하는 경우에만 database를 다시 호출한다.
 * => NextJS는 revalidatePath 호출 시 해당 페이지의 모든 코드를 다시 실행하여 현재 보고 있는 HTML 파일을 교체한다.
 *
 * => static page라면, cache를 사용하지 않더라도 database 호출을 줄일 수 있다!
 * => 새로운 데이터를 페칭하고 싶다면 revalidatePath를 호출할 수 있는 무언가와 상호작용해야 한다!
 *
 * => revalidatePath를 호출하지 않아도 새로고침할 수 있는 Customization 옵션이 있다.
 *
 */
