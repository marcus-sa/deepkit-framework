import { readFileSync } from 'fs';
import { access, readFile, stat } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

import { ReflectionConfig } from './src/config';
import { ExternalLibraryTransformer } from './src/external-library-compiler';


const packageJsonCache: { dir: string, content: any | null }[] = [];

export async function findPackageRoot(packageName: string, filePath: string) {
    let dir = dirname(filePath);
    while (dir !== parse(dir).root) {
        const packageJsonPath = join(dir, 'package.json');
        if (dir.endsWith(packageName) && (await stat(packageJsonPath)).isFile()) {
            return dir;
        }
        dir = dirname(dir);
    }
}

export async function readNearestPackageJson(filePath: string): Promise<any> {
    const cachedEntry = packageJsonCache
        .filter(entry => filePath.startsWith(entry.dir))
        .sort((a, b) => b.dir.length - a.dir.length)[0];

    if (cachedEntry) return cachedEntry.content;

    let dir = dirname(filePath);
    while (dir !== parse(dir).root) {
        const packageJsonPath = join(dir, 'package.json');
        try {
            const content = JSON.parse(await readFile(packageJsonPath, 'utf8'));
            packageJsonCache.push({ dir, content });
            return content;
        } catch {}
        dir = dirname(dir);
    }
}

const config: ReflectionConfig = {
    externalLibraryImports: {
        rxjs: true,
    },
};
// const config = JSON.parse(await readFile(join(process.cwd(), 'tsconfig.json'))) as ReflectionConfig;
if (config.externalLibraryImports === undefined) {
    throw new Error('External library imports have not been specified')
}

if (config.externalLibraryImports === true) {
    // TODO: glob all
} else {
    // TODO: consolidate sub-paths into a single path
    for (const [importSpecifier] of Object.entries(config.externalLibraryImports)) {
        // determine module type from package.json
        // determine imports entry-points from package.json exports
        // if package.json exports do not exist, read `<package>/<path>.d.ts` or `<package/path/index.d.ts`
        // TODO: read <package>/.deepkit/metadata.json
        interface Metadata {
            version: string;
            files: {
                symbols: [];
            }[];
        }
        // TODO: detect if @types/${importSpecifier} exists
        const importPath = fileURLToPath(import.meta.resolve(importSpecifier));
        const pkgName = importSpecifier.split('/')[0];
        const pkgRoot = await findPackageRoot(pkgName, importPath);
        const pkg = JSON.parse(await readFile(join(pkgRoot, 'package.json')));
        const indexTypesPath = pkg.exports?.['.'].types || pkg.types;
        const rootNames = [join(pkgRoot, indexTypesPath)];
        console.log(pkg, rootNames);

        const glob = new Bun.Glob('**/*.d.ts');
        const files = await Array.fromAsync(glob.scan(pkgRoot));

        const options = {
            module: ts.ModuleKind.ESNext, // Or ESNext, depending on your target
            outDir: join(pkgRoot, '.deepkit'),
            declaration: false, // Since we are transforming `.d.ts` files
            emitDeclarationOnly: false,
            noEmitOnError: false,
            allowJs: true,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
        };
        const compilerHost = ts.createCompilerHost(options);
        const program = ts.createProgram([indexTypesPath], options, compilerHost);

        files.map(async fileName => ts.createSourceFile(fileName, await readFile(fileName)));



        const sourceFiles = program.getSourceFiles().filter(file => file.fileName.includes(pkgRoot) && file.fileName.endsWith('.d.ts'));

        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

        sourceFiles.forEach(sourceFile => {
            const transform = ts.transform(sourceFile, [(context) => (node) => new ExternalLibraryTransformer(context).forHost(compilerHost).withReflection({reflection: 'default'}).transformSourceFile(node)]);
            const code = printer.printNode(ts.EmitHint.SourceFile, transform.transformed[0], transform.transformed[0]);
            console.log(sourceFile.fileName, code);
            // const transformedFile = transformedSource.transformed[0];
            //
            // const outputFilePath = path.join(OUTPUT_DIR, path.relative("src", sourceFile.fileName).replace(/\.d\.ts$/, ".js"));
            // const outputDir = path.dirname(outputFilePath);
            //
            // if (!fs.existsSync(outputDir)) {
            //     fs.mkdirSync(outputDir, { recursive: true });
            // }
            //
            // const printed = printer.printFile(transformedFile);
            // fs.writeFileSync(outputFilePath, printed);
        });

        console.log(sourceFiles);
    }
}
