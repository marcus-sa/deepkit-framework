import { expect, test } from '@jest/globals';
import { transpile, transpileExternalLibrary } from './utils.js';

test('resolve import', () => {
    const res = transpileExternalLibrary({ name: 'logger' }, {
        'app': `
            import { Logger } from 'logger';
            function fn(logger: Logger) {}
        `,
        'node_modules/logger/index.d.ts': `export declare interface Logger { log(message: string): void };`,
    }, {
        logger: ['Logger'],
    });

    console.log(res);
    expect(res.app).toContain('() => logger_1.Logger');
    expect(res.app).toContain('() => logger_1.Logger');
});
