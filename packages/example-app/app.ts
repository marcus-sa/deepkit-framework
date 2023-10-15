#!/usr/bin/env ts-node-script
import { createCrudRoutes, FrameworkModule, onServerMainBootstrapDone } from '@deepkit/framework';
import { Author, Book, SQLiteDatabase, User } from './src/database.js';
import { MainController } from './src/controller/main.http.js';
import { UsersCommand } from './src/controller/users.cli.js';
import { Config } from './src/config.js';
import { JSONTransport, Logger, LoggerInterface } from '@deepkit/logger';
import { App } from '@deepkit/app';
import { RpcController } from './src/controller/rpc.controller.js';
import { ApiConsoleModule } from '@deepkit/api-console-module';
import { OrmBrowserModule } from '@deepkit/orm-browser';
import { OpenAPIModule } from 'deepkit-openapi';
import { FilesystemLocalAdapter, provideFilesystem } from '@deepkit/filesystem';

const bookStoreCrud = createCrudRoutes([Author, Book]);

const app = new App({
    config: Config,
    providers: [
        SQLiteDatabase, MainController,
        provideFilesystem(() => new FilesystemLocalAdapter({ root: __dirname + '/public' })),
    ],
    controllers: [MainController, UsersCommand, RpcController],
    listeners: [
        onServerMainBootstrapDone.listen((event, logger: LoggerInterface, environment: Config['environment']) => {
            logger.log(`Environment <yellow>${environment}</yellow>`);
        })
    ],
    imports: [
        createCrudRoutes([User], { identifier: 'username', identifierChangeable: true }),
        bookStoreCrud,

        new OpenAPIModule({ prefix: '/openapi/' }),
        new OrmBrowserModule({ path: '/data' }),
        new ApiConsoleModule({ path: '/api' }).filter(filter => filter.excludeModules(bookStoreCrud)),
        new ApiConsoleModule({
            path: '/api/bookstore',
            markdown: `
             # Bookstore

             Welcome to my little bookstore API. Feel free to manage the content.

             Have fun
            `
        }).filter(filter => filter.forModules(bookStoreCrud)),

        new FrameworkModule({
            publicDir: 'public',
            httpLog: true,
            migrateOnStartup: true,
        }),
    ]
});

app.setup((module, config) => {
    if (config.environment === 'development') {
        module.getImportedModuleByClass(FrameworkModule).configure({ debug: true });
    }

    if (config.environment === 'production') {
        //enable logging JSON messages instead of formatted strings
        module.setupGlobalProvider<Logger>().setTransport([new JSONTransport]);
    }
});

app.loadConfigFromEnv().run();
