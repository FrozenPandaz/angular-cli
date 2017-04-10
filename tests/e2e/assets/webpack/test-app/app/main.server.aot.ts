import 'core-js/es7/reflect';
import {platformServer} from '@angular/platform-server';
import {ServerAppModuleNgFactory} from './ngfactory/app/server-app.module.ngfactory';

platformServer().bootstrapModuleFactory(ServerAppModuleNgFactory);
