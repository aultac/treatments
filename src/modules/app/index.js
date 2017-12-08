import moment from 'moment';

import { set,copy } from 'cerebral/operators';

import { treatmentCodes, colors } from './defaults';
import { updateRecord,recordToTreatmentCardOutput,
         updateMsg, putTreatmentCardName,
         msgFail, msgSuccess } from './actions';

import { chainFetchCards, chainDoAuthorization } from './chains';

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
    historyGroup: {
      sort: 'date', // date/name/dead/perc
    },

    msg: {
      type: 'bad',
      text: 'Treatment record not saved.',
    },

    record: {
      date: moment().format('YYYY-MM-DD'),
      treatment: 'NoExHt',
      tag: {
        color: '',
        number: 0,
      },
      is_saved: true,
    },

    treatmentCodes,
    colors,

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
            chainFetchCards('treatments'),
          ],
        },
      ],
    ],

    authorizationNeeded: [ chainDoAuthorization ], // async, so don't ...expand
    logoutClicked: [ 
      ({state,services}) => { state.set('app.trello.authorized', false); services.trello.deauthorize(); },
      chainDoAuthorization,
    ],

    historyGroupSortClicked: [ copy('input:sort', 'state:app.historyGroup.sort') ],

  });
}
