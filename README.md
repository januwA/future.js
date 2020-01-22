模拟Promise

- [参考](https://mengera88.github.io/2017/05/18/Promise%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90/)

```ts
new Future((res, rej) => {
  res(1);
}).then(r => {
  expect(r).toEqual(1);
});

new Future((res, rej) => {
  rej(1);
}).catch(er => {
  expect(er).toEqual(1);
});

Future.value(1).then(r => {
  expect(r).toEqual(1);
});

Future.error(1).catch(er => {
  expect(er).toEqual(1);
});

Future.delayed(1000).then(r => {
  expect(r).toEqual(null);
});

var a = Future.value(1);
var b = Future.value("2");
Future.wait<any>([a, b]).then(r => {
  expect(r).toEqual([1, "2"]);
});

Future.value(1)
  .then((id: number) => Future.value(id + 1))
  .then(r => {
    expect(r).toEqual(2);
  });
```