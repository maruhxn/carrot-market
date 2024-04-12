"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const PAGE_SIZE = 1;
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
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  return products;
}
