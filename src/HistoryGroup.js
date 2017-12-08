import React from 'react';
import {connect} from 'cerebral-view-react';
import _ from 'lodash';
import {groupForTag} from './lib/records';
import numeral from 'numeral';
import moment from 'moment';

import './HistoryGroup.css';

export default connect({
  historySelector: 'app.historySelector',
  groups: 'app.records.incoming',
  treatments: 'app.records.treatments',
  record: 'app.record',
  sortBy: 'app.historyGroup.sort',
},{
  sortBySignal: 'app.historyGroupSortClicked',
}, props => {
  let all_groups = props.groups;
  const group = groupForTag(props.groups, props.record.tag);
  if (group) all_groups = [ group ]; // just show group for current tag
  all_groups = _.sortBy(all_groups, g => {
    if (props.sortBy === 'date') return g.day; // day string is lexicographic for sorting
    if (props.sortBy === 'name') return g.groupname;
    if (props.sortBy === 'dead') return g.dead;
    if (props.sortBy === 'perc') return (g.dead ? g.dead.length : 0) / (g.head ? g.head : 1);
    return g.day; // default
  });
  all_groups = _.reverse(all_groups); // other way seems better
  return (
    <div className="historygroup">
      { group ? ' Showing group for current tag: '+props.record.tag.color+props.record.tag.number : '' }
      <table width="100%">
      <tbody>
        <tr>
          <th onClick={() => props.sortBySignal({ sort: 'name'})}>Name</th>
          <th onClick={() => props.sortBySignal({ sort: 'date'})}>Date</th>
          <th onClick={() => props.sortBySignal({ sort: 'dead'})}>Dead</th>
          <th onClick={() => props.sortBySignal({ sort: 'perc'})}>%</th>
        </tr>
      { 
        _.map(all_groups, (g,i) => {
          let perc = 0;
          if (g.dead && g.head) perc = g.dead.length / g.head;
          let name = g.groupname;
          if (name.length > 15) name = name.slice(0,6)+'...'+name.slice(-6);
          return (
            <tr className={ perc < .05 ? 'historygroupgood' : perc < 0.1 ? 'historygroupmeh' : 'historygroupbad' } key={'historygrouprow'+i}>
              <td className="historygroupname"><span name="historygroupnamepill">{ name }</span></td>
              <td className="historygroupdate"> { moment(g.day,'YYYY-MM-DD').format('M/DD/YY') }</td>
              <td className="historygroupdead">{ g.dead ? g.dead.length : 0 }</td>
              <td className="historygroupperc">{ perc > 0 ? '('+numeral(perc).format('0.00%')+')' : '' }</td>
            </tr>
          );
        })
      }
      </tbody>
      </table>
    </div>
  );
});

