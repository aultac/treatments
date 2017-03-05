import _ from 'lodash';

import {nameToRecord,recordToName} from '../../lib/cards';

// cheating for now until we take time to look it up by name.
const TREATMENTSLISTID = '58af86081a496c60f951c7f5';

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

export const fetchTreatmentCards = ({output,services}) => {
  // hack for now: Antibiotic Treatments list is 58af86081a496c60f951c7f5
  return services.trello.get('lists/'+TREATMENTSLISTID+'/cards',{fields:'name,id,closed,dateLastActivity'})
  .then(result => {
    // filter any archived cards:
    const onlyactive = _.filter(result, c => (!c.closed));
    output.success({cards: onlyactive});
  }).catch(err => output.fail({err}));
};
fetchTreatmentCards.async = true;
fetchTreatmentCards.outputs = [ 'success', 'fail' ];

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

export function treatmentCardsToRecords({state}) {
  const cards = state.get('app.trello.treatmentcards');
  const records = _.map(cards, c => {
    const r = nameToRecord(c.name);
    r.dateLastActivity = c.dateLastActivity;
    r.id = c.id;
    r.idList = c.idList;
    return r;
  });
  state.set('app.treatmentRecords', records);
}

export function recordToTreatmentCardOutput({state,output}) {

  const cards = state.get('app.trello.treatmentcards');
  const record = state.get('app.record');
  // Look for a card that matches this one's date and treatment:
  const putcard = _.find(cards, c => {
    const info = nameToRecord(c.name);
    if (info.date !== record.date) return false;
    if (info.treatment !== record.treatment) return false;
    return true;
  });
  const ret = _.cloneDeep(record);
  ret.idList = TREATMENTSLISTID;
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

