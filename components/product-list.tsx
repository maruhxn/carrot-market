"use client";

import { getMoreProducts } from "@/app/(tabs)/products/actions";
import { InitialProducts } from "@/app/(tabs)/products/page";
import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";

interface ProductListProps {
  initialProducts: InitialProducts;
}
// 1. 유저가 trggier를 보게되면 trggier를 observe 핟가ㅏ, trggier 관찰 중단.
// 2. 새로운 product를 얻어옴.
// 3. page를 증가시키면 useEffect 내의 코드 실행되고, 다시 trggier 관찰 시작.
export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[], // IntersectionObserver가 observe하는 모든 요소
        observer: IntersectionObserver // Observer 자체
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1); // page 변경되고 다시 useEffect() 실행
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      // unobserve한 다음 page를 바꾸고, observer 다시 등록 (정확히는, unmount될 때마다.)
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto 
          px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
