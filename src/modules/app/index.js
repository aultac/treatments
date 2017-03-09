import moment from 'moment';

import { set,copy } from 'cerebral/operators';

import { updateRecord,recordToTreatmentCardOutput,
         updateMsg, putTreatmentCardName,
         msgFail, msgSuccess } from './actions';

import { chainFetchTreatmentCards, chainDoAuthorization } from './chains';

export default module => {
  module.addState({

    trello: {
      authorized: false,
      lists: {
        treatments: { id: '', cards: [], cardsValid: false, },
              dead: { id: '', cards: [], cardsValid: false, },
            config: { id: '', cards: [], cardsValid: false, },
          incoming: { id: '', cards: [], cardsValid: false, },
      },
    },

    treatmentEditorActive: false,
    historySelector: {
      active: 'date', // date/tag/group/dead
    },

    msg: {
      type: 'bad',
      text: 'Treatment record not saved.'
    },

    record: {
      date: moment().format('YYYY-MM-DD'),
      treatment: 'ZSDRMB',
      tag: {
        color: '',
        number: '',
      },
      is_saved: true,
    },

    treatmentCodes: [
      { code: 'Z',  name: 'zuprevo' },
      { code: 'Za', name: 'zactran' },
      { code: 'N',  name: 'nuflor' },
      { code: 'Ba', name: 'baytril' },
      { code: 'No', name: 'noromycin' },
      { code: 'P',  name: 'pennicillin' },
      { code: 'S',  name: 'sulfa' },
      { code: 'D',  name: 'dexamethasone' },
      { code: 'R',  name: 'TDN rocket' },
      { code: 'M',  name: 'maxi-b' },
      { code: 'B',  name: 'banamine' },
    ],

    colors: { 
      YELLOW: '#E9E602',
       GREEN: '#02BB02',
        BLUE: '#113E9C',
         RED: '#E90202',
      PURPLE: '#AE027F',
       WHITE: '#FFFFFF',
    },

    records: {
      treatments: [],
      dead: [],
      incoming: [],
    },

  });

  module.addSignals({

    showTreatmentEditor: [ set('state:app.treatmentEditorActive',true) ],
    hideTreatmentEditor: [ set('state:app.treatmentEditorActive',false) ],

    historySelectionChangeRequested: [ copy('input:active', 'state:app.historySelector.active'), ],

    recordUpdateRequested: {
      chain: [ updateRecord, updateMsg ],
      immediate: true,
    },

    recordSaveClicked: [ 
      recordToTreatmentCardOutput,
      set('state:app.trello.treatmentcardsValid', false),
      [ // async:
        putTreatmentCardName, {
          fail: [ msgFail('Could not put card to Trello!') ],
          success: [ 
            set('state:app.record.is_saved', true),
            set('state:app.record.tag.number', ''),
            set('state:app.historySelector.active', 'date'),
            msgSuccess('Saved card - wait for card list refresh'),
            chainFetchTreatmentCards,
          ],
        },
      ],
    ],

    authorizationNeeded: [ chainDoAuthorization ], // async, so don't ...expand

  });
}
