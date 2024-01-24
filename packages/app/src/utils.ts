import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';

import { getCurrentFileName } from '@deepkit/core';

export function findParentPath(path: string, origin: string = dirname(getCurrentFileName())): string | undefined {
    let current = origin;

    while (!existsSync(join(current, path))) {
        const nextFolder = resolve(current, '..');

        if (nextFolder === current) {
            return undefined;
        }

        current = nextFolder;
    }

    return join(current, path);
}
