import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes, { list } from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { NavLink, withRouter } from 'react-router-dom';
import Icon from 'mastodon/components/icon';

export const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item && item.get('favourite')).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
});

export default @withRouter
@connect(mapStateToProps)
class ListPanel extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
  };

  render () {
    const { lists } = this.props;

    if (!lists || lists.isEmpty()) {
      return null;
    }

    return (
      <div>
        <hr />

        {lists.map(list => (
          <NavLink key={list.get('id')} className='column-link column-link--transparent' strict to={`/timelines/list/${list.get('id')}`}><Icon className='column-link__icon' id='list-ul' fixedWidth />{list.get('title')}</NavLink>
        ))}
      </div>
    );
  }

}
