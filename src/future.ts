enum FutureState {
  pending,
  fulfilled,
  rejected
}

export interface IRes<T> {
  (value: T): void;
}
export interface IRej<T extends any> {
  (error: T): void;
}
export interface IThen<T, R> {
  (value: T): R;
}
export interface ICatch {
  (error: any): void;
}

abstract class FutureBase<T> {
  abstract then<R>(f: IThen<T, R>): Future<R>;
  abstract catch(f: ICatch): Future<T>;
}

export class Future<T> implements FutureBase<T> {
  static value<T>(value: T): Future<T> {
    return new Future<T>(res => {
      res(value);
    });
  }

  static error<T>(error: T): Future<T> {
    return new Future<T>((_, rej) => {
      rej(error);
    });
  }

  static delayed(duration: number): Future<any> {
    return new Future<any>(res => {
      setTimeout(() => {
        res(null);
      }, duration);
    });
  }

  static wait<T extends any>(futures: Future<T>[]): Future<T[]> {
    let status = 0;
    const result: any[] = [];
    return new Future<T[]>(res => {
      futures.forEach(f => {
        status++;
        f.then(d => {
          result.push(d);
          status--;
          if (status === 0) {
            res(result);
          }
        });
      });
    });
  }

  /**
   *
   * @param f 有可能返回新的值，也有可能返回新的Future
   */
  then<R>(f: IThen<T, R>): Future<R> {
    return new Future<R>(res => {
      this._handle<R>({
        f: f,
        res: res
      });
    });
  }

  private _handle<R>({ f, res }: { f: IThen<T, R>; res?: IRes<R> }) {
    // 加入回调钩子
    if (this._state === FutureState.pending) {
      this._listener.push(f);
      return;
    }

    // 这里很可能返回另一个Future
    this._result = f(this._result);
    if (res) res(this._result);
  }

  catch(f: ICatch): Future<T> {
    this._errorListener = f;
    return this;
  }

  private _state: FutureState = FutureState.pending;

  private _result: any;
  private _listener: any[] = [];

  private _error: any;
  private _errorListener?: ICatch;

  private _res: IRes<T> = (value: T) => {

    // 如果是Future，那么就订阅
    if (value instanceof Future) {
      value.then(this._res);
      return;
    }

    this._result = value;
    this._state = FutureState.fulfilled;
    setTimeout(() => {
      try {
        this._listener.forEach(f => {
          this._handle({ f });
        });
      } catch (error) {
        this._rej(error);
      }
    }, 0);
  };

  private _rej: IRej<any> = (error: any) => {
    this._error = error;
    this._state = FutureState.rejected;
    setTimeout(() => {
      if (this._errorListener) this._errorListener(this._error);
    }, 0);
  };

  constructor(computation: (res: IRes<T>, rej: IRej<any>) => void) {
    computation(this._res, this._rej);
  }
}
