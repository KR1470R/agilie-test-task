import { RawData } from 'ws';

/**
 * Translates response from chrome extension.
 * @param message Buffer
 * @returns RecorderResponse if it could parse response to JSON, otherwise Buffer - chunk of recorder.
 */
export function translateResponse(message: Buffer | RawData): any {
  try {
    const translated = JSON.parse(message.toString());
    if (typeof translated === 'object' && translated !== null)
      return translated;
    throw new Error('Got wrong response!');
  } catch (err) {
    return message;
  }
}

/**
 * Returns a promise that resolves after condition returns true till timeout expires,
 * and rejectes if timeout expired.
 * @param condition
 * @param ms
 * @returns
 */
export function timeoutWhileCondition(
  condition: () => boolean | Promise<boolean>,
  ms: number,
  throwable = true,
) {
  return new Promise<boolean>((resolve, reject) => {
    let counter = 0;
    const delay = 1000;
    const interval = setInterval(async () => {
      counter += delay;
      if (await condition()) {
        resolve(true);
        clearInterval(interval);
      } else {
        if (counter > ms) {
          if (throwable) {
            reject('timeout');
            clearInterval(interval);
          } else resolve(false);
        }
      }
    }, delay);
  });
}
