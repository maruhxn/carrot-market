"use server";

import { PRODUCTS_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
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
    skip: page * PRODUCTS_PAGE_SIZE,
    take: PRODUCTS_PAGE_SIZE,
  });
  return products;
}
