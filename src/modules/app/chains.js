import _ from 'lodash';
import { set, copy} from 'cerebral/operators';
import { updateMsg, msgFail, waitTrelloExists, authorizeTrello,
         fetchLivestockListIds,
         fetchCardsFactory, cardsToRecordsFactory } from './actions'


// Factory to return fetchCards for a particular list
export const chainFetchCards = list => [ //async
  fetchCardsFactory(list), {
    fail:  [ msgFail('Failed to retrieve cards from list '+list) ],
    success: [
      copy('input:cards', 'state:app.trello.lists.'+list+'.cards'),
      cardsToRecordsFactory(list),
      set('state:app.trello.lists.'+list+'.cardsValid', true),
      updateMsg,
    ]
  },
];


export const chainDoAuthorization = [ // async:
  waitTrelloExists, { 
    fail: [ msgFail('Failed to load Trello library') ],
    success: [ 
      [ // async:
        authorizeTrello, { 
          fail: [ msgFail('Failed trello authorization') ],
          success: [ 
            ({state}) => state.set('app.trello.authorized', true), 
            updateMsg,
            [ //async
              fetchLivestockListIds, {
                fail: [ msgFail('Failed to find Trello lists. Please refresh to try again.') ],
                success: [
                  ({input,state}) => _.each(input.listids, (id,key) => state.set('app.trello.lists.'+key+'.id',id)),
                  chainFetchCards('config'),
                  chainFetchCards('treatments'),
                  chainFetchCards('dead'),
                  chainFetchCards('incoming'),
                ],
              },
            ],
          ],
        },
      ],
    ],
  },
];

