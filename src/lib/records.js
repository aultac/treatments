import _ from 'lodash';

export const groupContainsTag = (group,tag) => {
//console.log('checking tag ',tag,' against group ranges ', group.tagranges);
  return _.find(group.tagranges, r => (
  tag.color === r.start.color &&
  tag.number >= r.start.number && 
  tag.number <= r.end.number
))};

export const groupForTag = (groups,tag) => _.find(groups,g => groupContainsTag(g,tag));
