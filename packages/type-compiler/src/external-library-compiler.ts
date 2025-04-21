// node_modules/<package>/deepkit.metadata.json

// add custom "deepkit" type to exports in package.json

import { ReflectionTransformer } from './compiler';

export class ExternalLibraryTransformer extends ReflectionTransformer {
    override compilingExternalLibrary = true;
}
