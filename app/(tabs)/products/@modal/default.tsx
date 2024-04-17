export default function Default() {
  return null;
}

/** Parallel Routes
 * route를 가로채는 것은 가능하지만 아직 같은 페이지 내에서 모달처럼 렌더링 하는 법은 배우지 않았다. 이를 위해서는 Parallel Routes를 알아야 한다.
 * => 두 Routes를 동시에 렌더링하고 싶다!
 * => 여러 component를 같은 한 페이지 안에 렌더링 하고 싶다.
 * => 하나의 페이지에 여러 component를 직접 넣는 것과 다르게, 독자적인 페이지로서 독자적인 loading state, error boundary를 갖는다.
 * => 이들은 layout파일의 props로 전달될 것이고, 이 prop을 렌더링 하면 된다.
 *
 * 하지만 단순히 prop을 렌더링하기만 한다면, 우리가 만든 parallel route에는 url과 매칭되는 것이 없어서 404 error가 발생한다.
 * /home으로 접속 시, parallel route에는 home 폴더가 없기에 에러.
 * 즉, 브라우저에 있는 url이 parallel route와 일치하지 않았기 때문이다.
 * 우리는 이를 해결하기 위해 default routes를 설정해주어야 한다.
 * => parallel route 폴더 안에 반드시 default.tsx라는 이름으로 생성.
 *
 * Link 컴포넌트 등을 사용하면 soft navigation을 통해 페이지를 이동하게 되는데, 이때, parallel route는 다시 렌더링 되지 않는다. (parallel route의 Link를 누른게 아니라면)
 * 이는 parallel route에 해당하는 props는 변화 없이, children 부분만 다시 렌더링되기 때문이다.
 * (parallel route를 사용하면 layout 파일에 prop이 전달되고 이를 children과 함께 렌더링해야 함을 잊지 말자.)
 */
