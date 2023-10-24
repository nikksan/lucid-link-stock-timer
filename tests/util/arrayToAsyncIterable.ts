export default function arrayToAsyncIterable<T>(arr: Array<T>): AsyncIterable<T> {
  return (async function *() {
    for (const item of arr) {
      yield item;
    }
  })();
}
