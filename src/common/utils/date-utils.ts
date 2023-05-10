// 현재 시간 기준의 UTC Date를 얻어오는 함수
export function getCurrentUtcDate(): Date {
  const now: Date = new Date(); // 현재 시간
  const utcTimestamp: number = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  ); // 현재 시간 기준 UTC 타임스탬프

  return new Date(utcTimestamp); // UTC 시간 기준의 Date 객체
}

export function getDateResponse(date: Date): string {
  return date.toISOString().substring(0, 10);
}
