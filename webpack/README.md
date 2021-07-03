[相关资料](https://juejin.cn/post/6961961165656326152)

1. eval()相关,下面这么写会报错，如果去掉换行符或者使用 es6 的`` 代替''就不会报错了

```
eval('exports.default = function (a, b) {
  return a + b;
}')
```
