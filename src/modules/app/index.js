import moment from 'moment';

import { set,copy } from 'cerebral/operators';

import { updateRecord,recordToTreatmentCardOutput,
         updateMsg, authorizeTrello, waitTrelloExists,
         fetchTreatmentCards, putTreatmentCardName,
         treatmentCardsToRecords } from './actions';

// Handy wrappers:
const msgFail = (msg) => ({input,state}) => {
  state.set('app.msg', { type: 'bad', text: msg + ': err = ' + input.err });
};
const msgSuccess = (msg) => ({input,state}) => {
  state.set('app.msg', { type: 'good', text: msg });
};

export default module => {
  module.addState({

    trello: {
      authorized: false,
      treatmentcards: [],
      treatmentcardsValid: false,
    },

    treatmentEditorActive: false,

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
      is_saved: false,
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

    treatmentRecords: [],
  });

  module.addSignals({

    showTreatmentEditor: [ set('state:app.treatmentEditorActive',true) ],
    hideTreatmentEditor: [ set('state:app.treatmentEditorActive',false) ],

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
            msgFail('Saved card - wait for card list refresh'),
            [ //async
              fetchTreatmentCards, {
                fail: [ msgFail('Failed to retrieve list of cards after save.') ],
                success: [
                  copy('input:cards', 'state:app.trello.treatmentcards'),
                  treatmentCardsToRecords,
                  set('state:app.trello.treatmentcardsValid', true),
                  updateMsg 
                ],
              },
            ],
          ],
        },
      ],
    ],

    authorizationNeeded: [
      [ // async:
        waitTrelloExists, { 
          fail: [ msgFail('Failed to load Trello library') ],
          success: [ 
            [ // async:
              authorizeTrello, { 
                fail: [ msgFail('Failed trello authorization') ],
                success: [ 
                  ({state}) => state.set('app.trello.authorized', true), 
                  updateMsg,
                  [ // async:
                    fetchTreatmentCards, {
                      success: [ 
                        msgSuccess('Treatments loaded.'),
                        copy('input:cards', 'state:app.trello.treatmentcards'),
                        treatmentCardsToRecords,
                        set('state:app.trello.treatmentcardsValid', true),
                      ],
                      fail: [ msgFail('Failed to load treatment cards') ],
                    },
                  ],
                ],
              },
            ],
          ],
        },
      ],
    ],

  });
}
