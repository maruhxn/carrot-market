export default function Modal() {
  return <h1>Im Modal</h1>;
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
