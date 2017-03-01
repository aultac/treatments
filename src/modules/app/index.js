import moment from 'moment';

import { saveRecordToTrello, sanitizeRecord, updateRecord,
         updateMsg } from './actions';

export default module => {
  module.addState({

    msg: {
      type: 'bad',
      text: 'Treatment record not saved.'
    },

    record: {
      date: moment().format('YYYY-MM-DD'),
      treatment: 'ZSDRMB',
      tag: {
        color: 'YELLOW',
        number: '259',
      },
      is_saved: false,
    },

    treatmentCodes: {
      Z: 'zuprevo',
      Za:'zactran',
      N: 'nuflor',
      Ba:'baytril',
      No:'noromycin',
      P: 'pennicillin',
      S: 'sulfa',
      D: 'dexamethasone',
      R: 'TDN rocket',
      M: 'maxi-b',
      B: 'banamine',
    },

    colors: { 
      YELLOW: '#E9E602',
       GREEN: '#02BB02',
        BLUE: '#113E9C',
         RED: '#E90202',
      PURPLE: '#AE027F',
    },

    records: [
      { date: '2017-02-25', tag: 'YELLOW257', treatment: 'ZSDRMB' },
      { date: '2017-02-24', tag: 'YELLOW257', treatment: 'ZSDRMB' },
      { date: '2017-02-22', tag: 'YELLOW257', treatment: 'ZSDRMB' },
    ],
  
  });

  module.addSignals({
 
    recordUpdateRequested: {
      chain: [ updateRecord, updateMsg ],
      immediate: true,
    },
    recordSaveClicked: [ 
      sanitizeRecord,
      saveRecordToTrello,
      updateMsg,
    ],
  
  });
}
