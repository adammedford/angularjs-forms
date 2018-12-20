import { Observable } from 'rxjs'

export function isPromise(obj: any): obj is Promise<any> {
  // allow any Promise/A+ compliant thenable.
  // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function'
}

/**
 * Determine if the argument is an Observable
 */
export function isObservable(obj: any | Observable<any>): obj is Observable<any> {
  // TODO: use Symbol.observable when https://github.com/ReactiveX/rxjs/issues/2415 will be resolved
  return !!obj && typeof obj.subscribe === 'function'
}

export function looseIdentical(a: any, b: any): boolean {
  return a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))
}

export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token
  }

  if (token instanceof Array) {
    return '[' + token.map(stringify).join(', ') + ']'
  }

  if (token == null) {
    return '' + token
  }

  if (token.overriddenName) {
    return `${token.overriddenName}`
  }

  if (token.name) {
    return `${token.name}`
  }

  const res = token.toString()

  if (res == null) {
    return '' + res
  }

  const newLineIndex = res.indexOf('\n')
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex)
}

/**
 * Returns whether Angular is in development mode. After called once,
 * the value is locked and won't change any more.
 *
 * By default, this is true, unless a user calls `enableProdMode` before calling this.
 *
 * @experimental APIs related to application bootstrap are currently under review.
 */
export function isDevMode(): boolean {
  return false
}

export function getClosureSafeProperty<T>(objWithPropertyToExtract: T): string {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === (getClosureSafeProperty as any)) {
      return key
    }
  }
  throw Error('Could not find renamed property on target object.')
}

export const NG_INJECTABLE_DEF = getClosureSafeProperty({ ngInjectableDef: getClosureSafeProperty })
export const NG_INJECTOR_DEF = getClosureSafeProperty({ ngInjectorDef: getClosureSafeProperty })
