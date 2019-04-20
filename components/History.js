import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import UdaciFitnessCalendar from 'udacifitness-calendar';

import DateHeader from './DateHeader';
import { fetchCalendarResults } from '../utils/api';
import { timeToString, getDailyReminderValue, getPlatformOS } from '../utils/helpers';
import { addEntry, receiveEntries } from '../store/actions';
import { white } from '../utils/colors';

class History extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          const addEntryAction = addEntry({ [timeToString()]: getDailyReminderValue() });

          dispatch(addEntryAction);
        }
      });
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => (
    <View>
      {today
        ? (
          <View style={styles.item}>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        )
        : (
          <TouchableOpacity onPress={() => {}}>
            <Text>{JSON.stringify(metrics)}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )

  renderEmptyDate = formattedDate => (
    <View style={styles.item}>
      <DateHeader date={formattedDate} />
      <Text style={styles.noDataText}>No data for this day.</Text>
    </View>
  )

  render() {
    const { entries } = this.props;

    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: getPlatformOS() === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

History.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = entries => ({
  entries,
});


export default connect(mapStateToProps)(History);
