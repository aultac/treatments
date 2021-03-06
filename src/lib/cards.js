import _ from 'lodash';

export function tagStrToObj(str) {
  const matches = str.trim().match(/^([A-Za-z]+) ?([0-9]+)?$/);
  if (!matches) return { color: 'NOTAG', number: 1 };
  return { color: matches[1], number: +(matches[2]) || 1 };
}

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
  const tags = _.map(_.split(rest,' '), tagStrToObj)
  return { date, treatment, tags };
};

export function recordToName(parts) {
  return parts.date+': '
        +parts.treatment+': '
        +_.join(_.map(parts.tags, t=>t.color+t.number), ' ')
};

export function deadToRecord(name) {
  let matches = name.match(/^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}):?(.*)$/);
  const day = matches[1];
  let tags_and_pens_str = matches[2];
  // Ditch anything in parentheses:
  tags_and_pens_str = tags_and_pens_str.replace(/\(.*\)/g,'');
  let tags_and_pens = tags_and_pens_str.match(/([A-Za-z']+ ?([0-9]+)?)/g);
  tags_and_pens = _.map(tags_and_pens, tp => tp.trim());
  tags_and_pens = _.map(tags_and_pens, tp => ( tp==='NT' ? 'NOTAG1' : tp));
  // eliminate everything that isn't just tags
  let tags = _.filter(tags_and_pens, t => 
    !t.match(/^[NSB][0-9S]{1,2}$/i) && // N1, NS, S1, B3
    !t.match(/^OB[SN]?[NS]?$/) && // OBS, OBN, OB, OBNS
    !t.match(/^HB$/i) &&
    !t.match(/^HEIFER$/i) &&
    !t.match(/^DRY( ?(LOT|COW))?$/i) && 
    !t.match(/^DAIRY$/i) && 
    !t.match(/^APRIL'?S?$/i) && 
    !t.match(/^WOODS$/i) &&
    !t.match(/^BARN ?[1-3]$/i) &&
    !t.match(/^dead/i) &&
    !t.match(/^total/i) && 
    !t.match(/^and/i)
  );
  // fixup bad tags:
  tags = _.map(tags, t=>t.toUpperCase().replace(/ /g,''));
  tags = _.map(tags, t=>(t === 'NOTAG' ? 'NOTAG1' : t));
  // parse all the tag strings into tag objects
  tags = _.map(tags, tagStrToObj);
  return {
    date: day,
    tags: tags,
  };
}

export function incomingToRecord(name) {
  let matches = name.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}):? *([^;]+);(.*)$/);
  const ret = {};
  ret.day = matches[1];
  ret.groupname = matches[2];
  let rest = matches[3];
  const parts = rest.split(';');
  _.each(parts, p => {
    const [propname,propval] = p.trim().split(':');
    ret[propname.toLowerCase().trim()] = propval.trim();
  });

  // If there are tag range(s), parse that out as well
  if (ret.tags) {
    ret.tags = ret.tags.replace(/ /g,''); // get rid of any spaces
    ret.tag_ranges = _.reduce(ret.tags.split(','), (acc,r) => { // each range turns into 1 or 2 objects depending on color split
      const [start,end] = _.map(r.split('-'), tagStrToObj); // map start and end into objects
      if (start.color !== end.color) {
        acc.push({ start, end: { color: start.color, number: 1000 } });
        acc.push({ start: { color: end.color, number: 1 }, end });
        return acc;
      }
      acc.push({start,end});
      return acc;
    },[]);
  }

  return ret;
}
