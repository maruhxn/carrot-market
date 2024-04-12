export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime(); // 1970년 1월 1일 자정부터의 시간을 밀리초로 알려줌.
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko"); // 국제화와 관련된 API로, -3일 => 3일전으로 변경

  return formatter.format(diff, "days");
}
