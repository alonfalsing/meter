import invariant from "tiny-invariant";

export function padStart(s: string, n: number, pad: string = " ") {
  invariant(n > 0);
  invariant(pad.length === 1);

  return s.length < n ? pad.repeat(n - s.length) + s : s;
}
