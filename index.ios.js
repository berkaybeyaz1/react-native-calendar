var React = require('react-native');
var moment = require('moment');
var Dimensions = require('Dimensions');

var {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} = React;

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  MAX_COLUMNS = 7,
  MAX_ROWS = 7

var _currentMonthIndex;

class CalendarSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarDates: [moment().subtract(3, 'months').format()],
      selectedDate: null
    }
  }
  renderHeading() {
    return (
      <View style={styles.calendarHeading}>
        {DAYS.map((day) => { return (<Text style={styles.dayListDay}>{day}</Text>) })}
      </View>
    )
  }

  renderControls(date) {
    return (
      <View style={styles.calendarControls}>
        <TouchableOpacity style={styles.controlButton} onPress={this._onPrev.bind(this)}>
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {moment(date).format('MMMM YYYY')}
        </Text>
        <TouchableOpacity style={styles.controls} onPress={this._onNext.bind(this)}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }

  componentDidMount() {
    _currentMonthIndex = 1;
    this._prependMonth();
    this._appendMonth();
    this._scrollToItem(_currentMonthIndex);
  }

  renderMonthView(date) {
  
    var dayStart = moment(date).startOf('month').format(),
      daysInMonth = moment(dayStart).daysInMonth(),
      offset = moment(dayStart).get('day'),
      preFiller = 0,
      currentDay = 0,
      weekRows = [];

    for (var i = 0; i < MAX_COLUMNS; i++) {
      var days = [];
      for (var j = 0; j < MAX_ROWS; j++) {  
        if (preFiller < offset) {
          days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
        } else {
          if(currentDay < daysInMonth) {
            days.push((
              <TouchableOpacity
                onPress={this._selectDate.bind(this, moment(dayStart).set('date', currentDay + 1))}>
                <Text style={styles.dayListDay}>{currentDay+1}</Text>
              </TouchableOpacity>
            ));
            currentDay++; 
          } 
        } 
        preFiller++;  
      } // row

      if(days.length > 0 && days.length < 7) {
        for (var x = days.length; x < 7; x++) {
          days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
        }        
        weekRows.push(<View style={styles.dayList}>{days}</View>);
      } else {
        weekRows.push(<View style={styles.dayList}>{days}</View>);
      }
    } // column
    
    return (
      <View ref="InnerScrollView" style={styles.calendarContainer}>
      {weekRows}
      </View>
    );
  }

  _scrollToItem(itemIndex) {
      var scrollToX = itemIndex * Dimensions.get('window').width;
      this.refs.calendar.scrollWithoutAnimationTo(0, scrollToX);
  }

  _selectDate(date) {
    console.log(date.format());
  }
  _onPrev(){
    var calendar = this.refs.calendar;
    console.log(this.refs.calendar);
  }
  _onNext(){
    console.log('next pressed');
  }
  _prependMonth() {
    var calendarDates = this.state.calendarDates;
    calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
    this.setState({calendarDates: calendarDates});
  }

  _appendMonth(){
    var calendarDates = this.state.calendarDates;
    calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
    this.setState({calendarDates: calendarDates});
  }

  _scrollEnded() {
    this._prependMonth();
    this._scrollToItem(_currentMonthIndex);
  }

  render() {
    return (
      <View>
        {this.renderControls()}
        {this.renderHeading()}
        <ScrollView
          ref='calendar'
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          removeClippedSubviews={true}
          scrollEventThrottle={300}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this._scrollEnded.bind(this)}>
          {this.state.calendarDates.map((date) => { return this.renderMonthView(date) })}
        </ScrollView>
        <View>
          <TouchableOpacity onPress={this._prependMonth.bind(this)}>
            <Text>Prepend</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._appendMonth.bind(this)}>
            <Text>Append</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};
  var styles = StyleSheet.create({
    calendarContainer: {
      width: Dimensions.get('window').width,
    },
    title: {
      textAlign: 'center',
      flex: 2,
    },
    calendarControls: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
      marginTop: 30,
    },
    controlButton: {
      flex: 0.1
    },
    title: {
      flex: 0.8,
      textAlign: 'center'
    },
    calendarHeading: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 2,
      borderBottomWidth: 2
    },
    dayList: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    dayListDay: {
      padding: 5,
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
      justifyContent: 'flex-start'
    },
    currentDay: {
      color: '#FF3333'
    }
  });

AppRegistry.registerComponent('CalendarSwiper', () => CalendarSwiper);
