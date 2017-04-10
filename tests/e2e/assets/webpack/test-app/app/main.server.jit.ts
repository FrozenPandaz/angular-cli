import 'core-js/es7/reflect';
import {platformDynamicServer} from '@angular/platform-dynamic-server';
import {ServerAppModule} from './server-app.module';

platformDynamicServer().bootstrapModule(ServerAppModule);
