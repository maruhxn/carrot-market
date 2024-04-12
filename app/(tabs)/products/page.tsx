import ProductList from "@/components/product-list";
import { PRODUCTS_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
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

export default async function Products() {
  const initialProducts = await getInitialProducts();
  return <ProductList initialProducts={initialProducts} />;
}
