import * as crypto from 'crypto';

export const hash = (value: string): string =>
    crypto.createHash('sha256').update(value).digest('hex')