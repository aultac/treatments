import _ from 'lodash';

import {nameToRecord,recordToName,
        deadToRecord} from '../../lib/cards';

export const waitTrelloExists = ({services,output}) => {
  let count = 0;
  const check = () => {
    if (count++ > 10) return output.fail({err: 'Could not load Trello client library'});
    if (services.trello.isLoaded()) return output.success();
    setTimeout(check, 500);
  };
  return check();
};
waitTrelloExists.async = true;
waitTrelloExists.outputs = [ 'success', 'fail' ];

export const authorizeTrello = ({state,output,services}) => {
  return services.trello.authorize()
  .then(output.success)
  .catch((err) => {
    console.log('authorizeTrello action: fail: err = ', err);
    output.fail({err});
  });
}
authorizeTrello.async = true;
authorizeTrello.outputs = [ 'success', 'fail' ];

export const fetchCardsFactory = list => { 
  const ret = ({output,state,services}) => {
    const listid = state.get('app.trello.lists.'+list+'.id');
    if (!listid || listid === '') output.fail('Could not fetch '+list+' cards: '+list+' ID invalid');
    return services.trello.get('lists/'+listid+'/cards',{fields:'name,id,closed,desc,dateLastActivity'})
    .filter(c => c && !c.closed) // filter any archived cards
    .then(cards => {
      output.success({cards})
    }).catch(err => output.fail({err}));
  };
  ret.async = true;
  ret.outputs = [ 'success', 'fail' ];
  ret.displayName='fetchCardsFactory('+list+')';
  return ret;
};

export const fetchLivestockListIds = ({output,state,services}) => {
  return services.trello.get('members/me/boards',{fields:'name,id,closed'})
  .filter(b => b && !b.closed)
  .then(result => {
    const livestockboard = _.find(result, b => b.name === 'Livestock');
    if (!livestockboard) throw new Error('Could not find livestock board');
    return services.trello.get('boards/'+livestockboard.id+'/lists',{fields:'name,id,closed'})
  })
  .filter(l => l && !l.closed)
  .then(result => {
    const lists = [ 
      { trelloName: 'Treatments', key: 'treatments' },
      { trelloName:       'Dead', key: 'dead'       },
      { trelloName:     'Config', key: 'config'     },
      { trelloName:         'In', key: 'incoming'   },
    ];
    const ret = _.reduce(lists, (acc,listinfo) => {
      const list = _.find(result, l => l.name === listinfo.trelloName);
      if (!list) throw new Error('Could not find '+listinfo.trelloName+' list!');
      acc[listinfo.key] = list.id;
      return acc;
    },{});
    output.success({listids: ret});
  }).catch(err => {
    console.log('Failed in getting lists.  Full error = ', err);
    output.fail({ err });
  });
};
fetchLivestockListIds.async = true;
fetchLivestockListIds.outputs = [ 'success', 'fail' ];


export const putTreatmentCardName = ({input,output,services}) => {
  const tc = input.treatmentcard;
  let method = services.trello.post;
  let url = 'cards/';
  if (tc.id) { // not an existing card, post a new one:
    method = services.trello.put;
    url = 'cards/'+tc.id+'/';
  }
  return method(url, { name: tc.name, idList: tc.idList })
  .then(() => output.success())
  .catch(err => output.fail({err}));
};
putTreatmentCardName.async = true;
putTreatmentCardName.outputs = [ 'success', 'fail' ];


export function updateMsg({input,state}) {
  if (input.msg) 
    return state.set('app.msg', input.msg);
  if (!state.get('app.trello.authorized'))
    return state.set('app.msg', { type: 'bad', text: 'You are not logged in to Trello.' });
  if (state.get('app.record.is_saved')) 
    return state.set('app.msg', { type: 'good', text: 'Treatment record saved.'});
  state.set('app.msg', { type: 'bad', text: 'Treatment record not saved'});
}

const cardMappers = {
  treatments: c => nameToRecord(c.name),
  config: c => {
    if (c.name === 'Treatment Types') {
      return { type: 'treatment_types', codes: JSON.parse(c.desc) };
    }
    if (c.name === 'Tag Colors') {
      return { type: 'tag_colors', colors: JSON.parse(c.desc) };
    }
  },
  dead: c => deadToRecord(c.name),
  incoming: c => { return {};
    // TODO
  },
};

export const cardsToRecordsFactory = list => ({state}) => {
  const cards = state.get('app.trello.lists.'+list+'.cards');
  let records = _.map(cards, c => {
    let r = null;
    try {
      r = cardMappers[list](c);
    } catch(err) { 
      console.log('Error in mapping card '+c.name+' to record for list '+list+', c.desc = '+c.desc+',  err = ', err);
      state.set('app.msg', { type: 'bad', text: 'Failed to read card '+c.name+' from list '+list+', desc = '+c.desc})
    }
    if (r) {
      r.dateLastActivity = c.dateLastActivity;
      r.id = c.id;
      r.idList = c.idList;
    } else {
      console.log('Unable to convert name to record in list '+list+'.  c.name = ', c.name);
    }
    return r;
  });
  if (list === 'config') { // config is special
    const treatmenttypes = _.find(records,r => r.type === 'treatment_types');
    const      tagcolors = _.find(records,r => r.type === 'tag_colors');
    if (treatmenttypes) state.set('app.treatmentCodes', treatmenttypes.codes);
    if (tagcolors)      state.set('app.colors', tagcolors.colors);
    return;
  }
  // all other types of records just get end up in app.records
  state.set('app.records.'+list, records);
}

export function recordToTreatmentCardOutput({state,output}) {

  const cards = state.get('app.trello.lists.treatments.cards');
  const record = state.get('app.record');
  // Look for a card that matches this one's date and treatment:
  const putcard = _.find(cards, c => {
    const info = nameToRecord(c.name);
    if (info.date !== record.date) return false;
    if (info.treatment !== record.treatment) return false;
    return true;
  });
  const ret = _.cloneDeep(record);
  ret.idList = state.get('app.trello.lists.treatments.id');
  ret.tags = [];
  if (putcard) {
    const putcardinfo = nameToRecord(putcard.name);
    ret.tags = putcardinfo.tags;
    ret.id = putcard.id;
  }
  // add this one if it's not already in the list of tags:
  const alreadyInList = _.find(ret.tags, t => {
    return (record.tag.color === t.color 
         && record.tag.number === t.number);
  });
  if (!alreadyInList) ret.tags.push(record.tag);
  // convert to a name:
  ret.name = recordToName(ret);

  // treatment card should now have id (if card exists), idList, and name
  output({treatmentcard: ret});
}

export function updateRecord({input,state}) {
  // Only the first time that the is_saved gets set to false, automatically
  // switch the Date/Tag pane to Tag since we're typing a tag now.
  if (state.get('app.record.is_saved')) state.set('app.historySelector.active', 'tag');
  // if they are changing a record that has already been saved, go ahead and clear out
  // the textbox for them
  if (input.date)                    state.set('app.record.date', input.date);
  if (input.treatment)               state.set('app.record.treatment', input.treatment);
  if (input.tag && typeof input.tag.color === 'string') {
    state.set('app.record.tag.color', input.tag.color);
    if (input.tag.color === 'NOTAG') state.set('app.record.tag.number','1');
  }
  if (input.tag && typeof input.tag.number === 'string') {
    state.set('app.record.tag.number', input.tag.number);
  }
  state.set('app.record.is_saved', false);
}

// Handy wrappers:
export const msgFail = (msg) => ({input,state}) => {
  state.set('app.msg', { type: 'bad', text: msg + ': err = ' + input.err });
};
export const msgSuccess = (msg) => ({input,state}) => {
  state.set('app.msg', { type: 'good', text: msg });
};


