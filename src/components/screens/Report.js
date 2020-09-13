import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image, FlatList, TouchableOpacity, Alert, StatusBar, BackHandler, processColor,
} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import {retrieveData} from '../../storage';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            user_id: '',
            sumOfDebt: '0',
            sumOfIncome: '0',
            sumOfCost: '0',
            showAlert: false,
            showAlertWifi: false,
            textMessageBoxWifi: '',
            data: [
                {
                    id: 1,
                    title: 'گزارش روزانه',
                    image: require('../../../assets/images/icons/2416340.png'),
                }
                ,
                {
                    id: 2,
                    title: 'گزارش ماهانه',
                    image: require('../../../assets/images/icons/2416340.png'),
                }
                ,
                {
                    id: 3,
                    title: 'گزارش سالانه',
                    image: require('../../../assets/images/icons/2416340.png'),
                }
                ,
                {
                    id: 4,
                    title: 'خلاصه عملکرد',
                    image: require('../../../assets/images/icons/2416340.png'),

                }
                ,
                {
                    id: 5,
                    title: 'گزارش دسته ها',
                    image: require('../../../assets/images/icons/2416340.png'),
                }
                ,
                {
                    id: 6,
                    title: 'گزارش پیشرفته',
                    image: require('../../../assets/images/icons/2416340.png'),

                },
            ],

        };
    }

    showAlertWifi = () => {
        this.setState({
            showAlertWifi: true,
        });

    };
    hideAlertWifi = () => {
        this.setState({
            showAlertWifi: false,
        });
        BackHandler.exitApp();
    };
    showError = (item) => {
        this.setState({
            showAlert: true,
            titles: item,

        });
    };
    cardNavigate = (item) => {
        switch (item.id) {
            case 1:
                this.props.navigation.navigate('ReportDay');
                break;
            case 2:
                this.props.navigation.navigate('ReportMonth');
                break;
            case 3:
                this.props.navigation.navigate('ReportYear');
                break;
            case 4:
                this.props.navigation.navigate('ReportPerformance');
                break;
            case 5:
                this.props.navigation.navigate('ReportCategory');
                break;
            case 6:
                this.props.navigation.navigate('AdvancedSearch');
                break;
            default:
                this.showError('در نسخه های بعدی این قابلیت افزوده خواهد شد');
        }
    };

    toggleDrawer = () => {
        this.props.navigation.openDrawer();
    };
    _onStateChange = ({open}) => this.setState({open});

    clickEventListener(item) {
        Alert.alert(item.title);
    }

    async componentDidMount(): void {
        this.setState({user_id: await retrieveData('USER_ID')});
        NetInfo.fetch().then(state => {
            console.log(
                'Connection type: ' +
                state.type +
                ', Is connected?: ' +
                state.isConnected);
        });
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log(
                'Connection type: ' +
                state.type +
                ', Is connected?: ' +
                state.isConnected);
            if (state.isConnected === false) {
                this.setState({textMessageBoxWifi: 'اتصال به اینترنت را چک کنید و دوباره تلاش کنید'});
                this.showAlertWifi();
            } else {
                this.displayCost();
                this.displayIncome();
                this.displayDebt();

            }
        });

    }

    showAlert = (item) => {
        this.setState({
            showAlert: true,
            titles: item.title,

        });
    };
    hideAlert = () => {
        this.setState({
            showAlert: false,
        });
    };
    displayIncome = () => {
        var week = new Array('يكشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه');
        var months = new Array('فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دي', 'بهمن', 'اسفند');
        var today = new Date();
        var d = today.getDay();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getYear();
        year = (window.navigator.geolocation > 0) ? year : 1900 + year;
        if (year === 0) {
            year = 2000;
        }
        if (year < 100) {
            year += 1900;
        }
        var y = 1;
        for (var i = 0; i < 3000; i += 4) {
            if (year === i) {
                y = 2;
            }
        }
        for (var i = 1; i < 3000; i += 4) {
            if (year === i) {
                y = 3;
            }
        }
        if (y === 1) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }
        if (y === 2) {
            year -= ((month < 3) || ((month == 3) && (day < 20))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 20) ? (month = 12, day += 10) : (month = 1, day -= 19);
                    break;
                case 4:
                    (day < 20) ? (month = 1, day += 12) : (month = 2, day -= 19);
                    break;
                case 5:
                    (day < 21) ? (month = 2, day += 11) : (month = 3, day -= 20);
                    break;
                case 6:
                    (day < 21) ? (month = 3, day += 11) : (month = 4, day -= 20);
                    break;
                case 7:
                    (day < 22) ? (month = 4, day += 10) : (month = 5, day -= 21);
                    break;
                case 8:
                    (day < 22) ? (month = 5, day += 10) : (month = 6, day -= 21);
                    break;
                case 9:
                    (day < 22) ? (month = 6, day += 10) : (month = 7, day -= 21);
                    break;
                case 10:
                    (day < 22) ? (month = 7, day += 9) : (month = 8, day -= 21);
                    break;
                case 11:
                    (day < 21) ? (month = 8, day += 10) : (month = 9, day -= 20);
                    break;
                case 12:
                    (day < 21) ? (month = 9, day += 10) : (month = 10, day -= 20);
                    break;
                default:
                    break;
            }
        }
        if (y === 3) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 20) ? (month = 10, day += 11) : (month = 11, day -= 19);
                    break;
                case 2:
                    (day < 19) ? (month = 11, day += 12) : (month = 12, day -= 18);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 10) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }

        this.setState({year: year});
        let countMonth = month;
        var monthNumber;
        if (countMonth < 10)
            monthNumber = '0' + countMonth;
        else
            monthNumber = month;
        let x = [];
        fetch('http://194.5.175.25:2000/api/v1/reportmonthIncome/' + this.state.user_id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id:this.state.user_id,
                year: year.toString(),
                month: monthNumber.toString(),

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.success === true) {
                    let count = responseJson.data.length;
                    let sum = 0;
                    for (var i = 0; i < count; i++) {

                        sum += responseJson.data[i].sum;
                    }
                    this.setState({sumOfIncome: Math.round(sum)});

                }
            })
            .catch((error) => {

            });


    };
    displayCost = () => {
        var week = new Array('يكشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه');
        var months = new Array('فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دي', 'بهمن', 'اسفند');
        var today = new Date();
        var d = today.getDay();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getYear();
        year = (window.navigator.geolocation > 0) ? year : 1900 + year;
        if (year === 0) {
            year = 2000;
        }
        if (year < 100) {
            year += 1900;
        }
        var y = 1;
        for (var i = 0; i < 3000; i += 4) {
            if (year === i) {
                y = 2;
            }
        }
        for (var i = 1; i < 3000; i += 4) {
            if (year === i) {
                y = 3;
            }
        }
        if (y === 1) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }
        if (y === 2) {
            year -= ((month < 3) || ((month == 3) && (day < 20))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 20) ? (month = 12, day += 10) : (month = 1, day -= 19);
                    break;
                case 4:
                    (day < 20) ? (month = 1, day += 12) : (month = 2, day -= 19);
                    break;
                case 5:
                    (day < 21) ? (month = 2, day += 11) : (month = 3, day -= 20);
                    break;
                case 6:
                    (day < 21) ? (month = 3, day += 11) : (month = 4, day -= 20);
                    break;
                case 7:
                    (day < 22) ? (month = 4, day += 10) : (month = 5, day -= 21);
                    break;
                case 8:
                    (day < 22) ? (month = 5, day += 10) : (month = 6, day -= 21);
                    break;
                case 9:
                    (day < 22) ? (month = 6, day += 10) : (month = 7, day -= 21);
                    break;
                case 10:
                    (day < 22) ? (month = 7, day += 9) : (month = 8, day -= 21);
                    break;
                case 11:
                    (day < 21) ? (month = 8, day += 10) : (month = 9, day -= 20);
                    break;
                case 12:
                    (day < 21) ? (month = 9, day += 10) : (month = 10, day -= 20);
                    break;
                default:
                    break;
            }
        }
        if (y === 3) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 20) ? (month = 10, day += 11) : (month = 11, day -= 19);
                    break;
                case 2:
                    (day < 19) ? (month = 11, day += 12) : (month = 12, day -= 18);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 10) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }

        this.setState({year: year});
        let countMonth = month;
        var monthNumber;
        if (countMonth < 10)
            monthNumber = '0' + countMonth;
        else
            monthNumber = month;
        let x = [];
        fetch('http://194.5.175.25:2000/api/v1/reportmonthCost/' + this.state.user_id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id:this.state.user_id,
                year: year.toString(),
                month: monthNumber.toString(),

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.success === true) {
                    let count = responseJson.data.length;
                    let sum = 0;
                    for (var i = 0; i < count; i++) {
                        sum += responseJson.data[i].sum;
                    }
                    this.setState({sumOfCost: Math.round(sum)});


                }
            })
            .catch((error) => {

            });

        this.setState({
            xx: x,
        });
    };
    displayDebt = () => {
        var week = new Array('يكشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه');
        var months = new Array('فروردين', 'ارديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دي', 'بهمن', 'اسفند');
        var today = new Date();
        var d = today.getDay();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getYear();
        year = (window.navigator.geolocation > 0) ? year : 1900 + year;
        if (year === 0) {
            year = 2000;
        }
        if (year < 100) {
            year += 1900;
        }
        var y = 1;
        for (var i = 0; i < 3000; i += 4) {
            if (year === i) {
                y = 2;
            }
        }
        for (var i = 1; i < 3000; i += 4) {
            if (year === i) {
                y = 3;
            }
        }
        if (y === 1) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }
        if (y === 2) {
            year -= ((month < 3) || ((month == 3) && (day < 20))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                    break;
                case 2:
                    (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                    break;
                case 3:
                    (day < 20) ? (month = 12, day += 10) : (month = 1, day -= 19);
                    break;
                case 4:
                    (day < 20) ? (month = 1, day += 12) : (month = 2, day -= 19);
                    break;
                case 5:
                    (day < 21) ? (month = 2, day += 11) : (month = 3, day -= 20);
                    break;
                case 6:
                    (day < 21) ? (month = 3, day += 11) : (month = 4, day -= 20);
                    break;
                case 7:
                    (day < 22) ? (month = 4, day += 10) : (month = 5, day -= 21);
                    break;
                case 8:
                    (day < 22) ? (month = 5, day += 10) : (month = 6, day -= 21);
                    break;
                case 9:
                    (day < 22) ? (month = 6, day += 10) : (month = 7, day -= 21);
                    break;
                case 10:
                    (day < 22) ? (month = 7, day += 9) : (month = 8, day -= 21);
                    break;
                case 11:
                    (day < 21) ? (month = 8, day += 10) : (month = 9, day -= 20);
                    break;
                case 12:
                    (day < 21) ? (month = 9, day += 10) : (month = 10, day -= 20);
                    break;
                default:
                    break;
            }
        }
        if (y === 3) {
            year -= ((month < 3) || ((month === 3) && (day < 21))) ? 622 : 621;
            switch (month) {
                case 1:
                    (day < 20) ? (month = 10, day += 11) : (month = 11, day -= 19);
                    break;
                case 2:
                    (day < 19) ? (month = 11, day += 12) : (month = 12, day -= 18);
                    break;
                case 3:
                    (day < 21) ? (month = 12, day += 10) : (month = 1, day -= 20);
                    break;
                case 4:
                    (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                    break;
                case 5:
                case 6:
                    (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                    break;
                case 7:
                case 8:
                case 9:
                    (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                    break;
                case 10:
                    (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                    break;
                case 11:
                case 12:
                    (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                    break;
                default:
                    break;
            }
        }

        this.setState({year: year});
        let countMonth = month;
        var monthNumber;
        if (countMonth < 10)
            monthNumber = '0' + countMonth;
        else
            monthNumber = month;

        if (day < 10)
            day = '0' + day;

        let years=year+'/'+monthNumber+'/'+day;

        fetch('http://194.5.175.25:2000/api/v1/reportDebtMonth/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id:this.state.user_id,
                year: years.toString(),


            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success === true) {
                    let count = responseJson.data.length;
                    let sum = 0;
                    for (var i = 0; i < count; i++) {

                        sum += responseJson.data[i].sum;
                    }
                    this.setState({sumOfDebt: Math.round(sum)});

                }
            })
            .catch((error) => {

            });


    };
    render() {
        const {open} = this.state;
        const {showAlert, showAlertWifi, textMessageBoxWifi} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={false}
                    backgroundColor='#3e843d'
                />
                <LinearGradient start={{x: 0.40, y: 0.0}} end={{x: 0.5, y: 1.0}}
                                locations={[0, 0.5, 0.6]}
                                colors={['#3e843d', '#3ede30', '#47b03e']} style={{
                    height: 200, alignItems: 'center', justifyContent: 'center',
                }}>
                    <Image
                        source={require('../../../assets/images/icons/1312175.png')}
                        style={{width: 50, height: 50}}
                    />
                    <Text style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 25,
                        fontFamily: 'Vazir-Black',
                        marginTop: -10,
                        marginBottom: 8,
                    }}>گزارش گیری</Text>
                    {/*</View>*/}
                </LinearGradient>
                <View style={styles.Detail}>
                    <View style={styles.detailContent}>
                        <Image style={styles.icon1} source={require('../../../assets/images/icons/bill2.png')}/>
                        <Text style={styles.textHeader}>مبلغ بدهی</Text>
                        <Text style={[styles.textHeader, {marginTop: -5}]}><Text
                            style={{fontFamily: 'IRANSansMobile(FaNum)'}}>{Number(this.state.sumOfDebt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, ',')}</Text> </Text>

                    </View>
                    <View
                        style={[styles.detailContent, {
                            borderLeftWidth: 1,
                            borderColor: '#e2e2e2',
                        }]}>
                        <Image style={styles.icon1} source={require('../../../assets/images/icons/2760970.png')}/>
                        <Text style={styles.textHeader}>مخارج</Text>
                        <Text style={[styles.textHeader, {marginTop: -5}]}><Text
                            style={{fontFamily: 'IRANSansMobile(FaNum)'}}>{Number(this.state.sumOfCost).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, ',')}</Text> </Text>

                    </View>
                    <View style={[styles.detailContent, {
                        borderLeftWidth: 1,
                        borderColor: '#e2e2e2',
                    }]}>
                        <Image style={styles.icon1} source={require('../../../assets/images/icons/wallet.png')}/>
                        <Text style={styles.textHeader}>مانده</Text>
                        <Text style={[styles.textHeader, {marginTop: -5}]}><Text
                            style={{fontFamily: 'IRANSansMobile(FaNum)'}}>{(Number(this.state.sumOfIncome)-(Number(this.state.sumOfCost)+Number(this.state.sumOfDebt))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, ',')}</Text> </Text>
                    </View>
                </View>
                <FlatGrid
                    itemDimension={100}
                    items={this.state.data}
                    style={{
                        marginTop: 60,
                    }}
                    contentContainerStyle={{justifyContent: 'center', alignItems: 'center', marginVertical: 15}}
                    renderItem={({item, index}) => (
                        <TouchableOpacity activeOpacity={0.99}
                                          onPress={() => this.cardNavigate(item)}>
                            <Card style={{
                                width: '100%', height: 120,
                                shadowColor: '#3d933c',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                    marginRight: 16,
                                    marginBottom: 12,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 12,
                                borderColor: '#3d933c', borderRadius: 15,
                                borderWidth: 1.5,
                            }}
                            >
                                {/*onPress={() => this.props.navigation.navigate('Report')}>*/}
                                <Card.Cover style={{
                                    width: 80,
                                    height: 75,
                                    alignSelf: 'center',
                                    backgroundColor: '#fff',
                                    marginTop: 5,
                                }} source={item.image}/>
                                <Card.Title title={item.title}
                                            titleStyle={styles.title}/>
                            </Card>
                        </TouchableOpacity>
                    )}/>
                <AwesomeAlert
                    show={showAlertWifi}
                    title={<Text><Icon style={{fontSize: 35, color: '#3d933c'}} name='wifi'/>
                    </Text>}
                    showProgress={false}
                    message={textMessageBoxWifi}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    // contentContainerStyle={{marginBottom: 90}}
                    titleStyle={{fontSize: 14, fontFamily: 'IRANSansMobile(FaNum)'}}
                    messageStyle={{fontSize: 15, fontFamily: 'IRANSansMobile(FaNum)'}}
                    confirmText="تایید"
                    confirmButtonColor="#3d933c"
                    confirmButtonStyle={{}}
                    confirmButtonTextStyle={{fontSize: 17, fontFamily: 'IRANSansMobile(FaNum)'}}
                    onConfirmPressed={() => {
                        this.hideAlertWifi();
                    }}
                />
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title={this.state.titles}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    titleStyle={{fontSize: 16, fontFamily: 'IRANSansMobile(FaNum)', textAlign: 'center'}}
                    messageStyle={{fontSize: 15, fontFamily: 'IRANSansMobile(FaNum)'}}
                    confirmText="تایید"
                    confirmButtonColor="#3d933c"
                    confirmButtonStyle={{width: 100}}
                    confirmButtonTextStyle={{
                        fontSize: 17,
                        fontFamily: 'IRANSansMobile(FaNum)',
                        textAlign: 'center',
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    icon: {
        flex: 1,
        borderColor: '#3d933c',
        borderWidth: 1.5,
        margin: 7,
        height: '100%',
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Detail: {
        width: 310,
        alignSelf: 'center',
        marginTop: 165,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        shadowColor: '#808080',
        shadowOffset: {
            width: 0,
            height: 2,
            marginVertical: 5,
            marginRight: 16,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 12,
    },
    detailContent: {
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        paddingHorizontal: 12,
    },
    icon1: {
        width: 35,
        height: 35,
    },
    buttonstyle: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: 195,
        height: 40,
        borderRadius: 5,
        shadowColor: '#00000021',
        backgroundColor: '#3d933c',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    textHeader: {
        fontSize: 13,
        fontFamily: 'Lalezar-Regular',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 12.5,
        textAlign: 'center',
        margin: 10,
        color: '#444',
        fontFamily: 'Vazir-Black',
        marginHorizontal: -3,

        flex: 2,
    },
});
