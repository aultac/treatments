import _ from 'lodash';

// Handy helper functions for translating card names to records and back
export function nameToRecord(name)  {
  const datematches = name.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}):(.*)$/);
  if (!datematches || datematches.length < 3) return null;
  const date = datematches[1].trim();
  let rest = datematches[2].trim();
  const treatmentmatches = rest.match(/^(.+):(.*)$/);
  if (!treatmentmatches || treatmentmatches.length < 3) return null;
  const treatment = treatmentmatches[1].trim();
  rest = treatmentmatches[2].trim();
  const tags = _.map(_.split(rest,' '),t => {
    const matches = t.trim().match(/^([A-Za-z]+) ?([0-9]+)?$/);
    if (!matches) return { color: 'NOTAG', number: 'NOTAG' };
    return { color: matches[1], number: matches[2] || 'NOTAG' };
  });
  return { date, treatment, tags };
};

export function recordToName(parts) {
  return parts.date+': '
        +parts.treatment+': '
        +_.join(_.map(parts.tags, t=>t.color+t.number), ' ')
};



