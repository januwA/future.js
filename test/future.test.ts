import { Future } from "../src";

describe("future test", () => {
  it("res", done => {
    new Future((res, rej) => {
      res(1);
    }).then(r => {
      expect(r).toEqual(1);
      done();
    });
  });

  it("rej", done => {
    new Future((res, rej) => {
      rej(1);
    }).catch(er => {
      expect(er).toEqual(1);
      done();
    });
  });

  it("value", done => {
    Future.value(1).then(r => {
      expect(r).toEqual(1);
      done();
    });
  });

  it("error", done => {
    Future.error(1).catch(er => {
      expect(er).toEqual(1);
      done();
    });
  });

  it("delayed", done => {
    Future.delayed(1000).then(r => {
      expect(r).toEqual(null);
      done();
    });
  });

  it("wait", done => {
    let a = new Future(res => {
      setTimeout(() => {
        res(1);
      }, 500);
    });
    let b = Future.value("2");
    Future.wait<any>([b, a]).then(r => {
      expect(r).toEqual(["2", 1]);
      done();
    });
  });

  it("future", done => {
    Future.value(1)
      .then((id: number) => Future.value(id + 1))
      .then(r => {
        expect(r).toEqual(2);
        done();
      });
  });
});
