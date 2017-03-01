export function saveRecordToTrello({input,state}) {
  console.log('I would have saved the record to trello if you wrote that....');
  state.set('app.record.is_saved', true);
}

export function updateMsg({input,state}) {
  if (input.msg) 
    return state.set('app.msg', input.msg);
  if (state.get('app.record.is_saved')) 
    return state.set('app.msg', { type: 'good', text: 'Treatment record saved.'});
  state.set('app.msg', { type: 'bad', text: 'Treatment record not saved'});
}

export function sanitizeRecord({state,output}) {
  output({
    date: state.get('app.record.date'),
    treatment: state.get('app.record.treatment'),
    tag: state.get('app.record.input.tag.color')+state.get('app.record.input.tag.number'),
  });
}

export function updateRecord({input,state}) {
  // if they are changing a record that has already been saved, go ahead and clear out
  // the textbox for them
  if (input.date)                    state.set('app.record.date', input.date);
  if (input.treatment)               state.set('app.record.treatment', input.treatment);
  if (input.tag && 
      typeof input.tag.color === 'string') state.set('app.record.tag.color', input.tag.color);
  if (input.tag && 
      typeof input.tag.number === 'string') state.set('app.record.tag.number', input.tag.number);
  state.set('app.record.is_saved', false);
}
