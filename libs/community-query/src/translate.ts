type TFunction = (key: string) => string;

let _t: TFunction = (key: string) => key;

export function setTranslate(tFn: TFunction) {
  _t = tFn;
}

export function getTranslate(): TFunction {
  return _t;
}
