import {Controller} from 'cerebral'
import Model from 'cerebral/models/immutable'
import Devtools from 'cerebral-module-devtools'
import ModulesProvider from 'cerebral-provider-modules'

import AppModule from './modules/app'
import WindowModule from './modules/window'

import trello from './services/trello'

const controller = Controller(Model({}));

controller.addModules({

  // Mine:
  app: AppModule,
  window: WindowModule,
    
  devtools: Devtools(),

});

controller.addServices({trello});

controller.addContextProvider(ModulesProvider);

export default controller;

