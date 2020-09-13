import React, {Component} from 'react';
import {Divider, Dialog, Portal} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import CodeInput from 'react-native-confirmation-code-input';
import {faSms} from '@fortawesome/free-solid-svg-icons';
import {Button} from 'react-native-elements';

import {
    StyleSheet,
    View,
    Text,
    Platform,
    Alert,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator, TextInput,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import {faFrownOpen} from '@fortawesome/free-solid-svg-icons/faFrownOpen';
import {faForward} from '@fortawesome/free-solid-svg-icons/faForward';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome';

class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: this.props.navigation.state.params.mobile,
            password: this.props.navigation.state.params.password,
            codeOTD: '',
            displayTextResendSMS: 'none',
            timeWait: 5,
            display: false,
            showAlert: false,
            messageError:'',
            count:90
        };
    }
    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false,
        });
    };
    onDoneCountdown = () => {
        this.setState({displayTextResendSMS: 'flex'});
    };

    textResend() {
        setInterval(() => {
            return (<Text style={{
                marginTop: -5,
                marginBottom: 5,
                color: '#47b03e',
                fontFamily: 'IRANSansMobile(FaNum)',
                fontSize: 15,
                alignSelf: 'center',
            }} onPress={() => this.onSendSMS()}>ارسال مجدد کد</Text>);
        }, 50000);

    }

    onPressCountdown = () => {
       // Alert.alert('Countdown Component Press.');
    };

    _onFinishCheckingCode1(a) {
        if (a) {
            this.setState({display: true});
        } else {

            this.showAlert();
            this.setState({messageError:" کد وارد شده اشتباه می باشد."});
        }
    }

    componentDidMount() {
        this.onSendSMS();
    }

    onSendSMS() {
        this.setState({count:90})
        this.setState({displayTextResendSMS: 'none'});
        fetch('http://194.5.175.25:2000/api/v1/sendsms', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobile: this.state.mobile,

            }),
        }).then((response) => response.json()).then((responseJson) => {
            // console.log(responseJson);
            if (responseJson.success === true) {
                let message = "کد تایید ثبت نام شما در اپلیکیشن چرتکه:"+ responseJson.data+"می باشد";
                fetch('http://www.0098sms.com/sendsmslink.aspx?FROM=' + '3000164545&TO=' + this.state.mobile + '&TEXT=' + message + '&USERNAME=zsms7691&PASSWORD=3333114811&DOMAIN=0098').then((response) => response.json()).then((responseJson1) => {
                    // console.log(responseJson1);
                });
                this.setState({codeOTD: responseJson.data});

            } else {

                // console.log(responseJson.data);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    onRegister() {
      //  alert('ff');
        if (this.state.display === true) {
            fetch('http://194.5.175.25:2000/api/v1/register', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: this.state.mobile,
                    password: this.state.password,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success === true) {
                    this.props.navigation.push('Login');

                } else {
                    console.log(responseJson.data);

                }
            }).catch((error) => {
                console.error('yyy');
            });

        } else {
            this.showAlert();
            this.setState({messageError:" کد را وارد نمایید."});
        }
    }

    render() {
        const {showAlert,count} = this.state;
        return (
            <View style={{justifyContent: 'center', marginTop: '10%',flex:1}}>
                <StatusBar
                    hidden={false}
                    backgroundColor='#3e843d'/>
                <ScrollView>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 30}}>
                        <FontAwesomeIcon icon={faSms} size={70} style={{color: '#47b03e', marginBottom: 10}}/>

                    </View>
                    <View style={
                        {
                            borderColor: '#47b03e',
                            borderWidth: 1,
                            borderRadius: 10,
                            marginHorizontal: 10,
                            marginVertical: 20,
                        }}>
                        <View style={{flex: 1}}>
                            <Text style={{
                                fontSize: 15,
                                paddingVertical: 10,
                                fontFamily: 'IRANSansMobile',
                                backgroundColor: '#47b03e',
                                color: '#fff',
                                textAlign: 'center',
                                borderRadius: 5,
                            }}>
                                کد ارسال شده را وارد نمائید:
                            </Text>
                        </View>

                        <Divider style={{backgroundColor: '#33b5e5'}}/>
                        <View style={{height: 170, marginTop: 10, flexDirection: 'row'}}>
                            <View style={{
                                flex: 1,
                                borderRadius: 10,
                                borderColor: '#dddddd',
                                width: 160,
                                height: 120,
                            }}
                            >
                                <Text style={{
                                    fontFamily: 'IRANSansMobile(FaNum)',
                                    color: '#777',
                                    textAlign: 'center',
                                    fontSize: 16,
                                }}>کد
                                    پنج رقمی به شماره همراه شما ارسال شد.</Text>
                                <CodeInput
                                    ref="codeInputRef2"
                                    secureTextEntry
                                    compareWithCode={this.state.codeOTD}
                                    activeColor='#47b03e'
                                    inactiveColor='#777'
                                    keyboardType='numeric'
                                    autoFocus={false}
                                    ignoreCase={true}
                                    inputPosition='center'
                                    size={60}
                                    onFulfill={(compareWithCode, code) => this._onFinishCheckingCode1(compareWithCode)}
                                    containerStyle={{marginTop: 25}}
                                    codeInputStyle={{borderWidth: 1.5, fontSize: 30, borderRadius: 10}}
                                />
                            </View>
                        </View>
                        <View style={styles.MainContainer}>
                            <CountDown
                                until={count}
                                onFinish={this.onDoneCountdown}
                                onPress={this.onPressCountdown}
                                size={23}
                                timeToShow={['M', 'S']}
                                digitTxtStyle={{color: '#fff', marginTop: -10}}
                                digitStyle={{backgroundColor: '#47b03e'}}
                                timeLabelStyle={{color: '#777', marginTop: 10,fontFamily: 'IRANSansMobile(FaNum)'}}
                                timeLabels={{m: 'دقیقه', s: 'ثانیه'}}/>
                        </View>
                        <View style={{display: this.state.displayTextResendSMS}}>
                            <Text style={{
                                marginTop: -5,
                                marginBottom: 5,
                                color: '#47b03e',
                                fontFamily: 'IRANSansMobile(FaNum)',
                                fontSize: 15,
                                alignSelf: 'center',
                            }} onPress={() => this.onSendSMS()}>ارسال مجدد کد</Text>
                        </View>
                    </View>

                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Button buttonStyle={{
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#47b03e',
                            borderRadius: 30,
                            width: '35%',
                            height: 45,
                            shadowColor: '#43c164',
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 0.37,
                            shadowRadius: 7.49,
                            elevation: 5,
                            marginBottom: 20,
                        }}
                                onPress={() => this.onRegister()}
                                titleStyle={{color: '#fff', fontFamily: 'IRANSansMobile(FaNum)', fontSize: 18}}

                                title={<FontAwesomeIcon icon={faArrowRight} size={30} style={{color: '#fff'}}/>}

                        />
                    </View>


                </ScrollView>
                <AwesomeAlert
                    contentContainerStyle={{width: '80%', borderRadius: 5}}
                    overlayStyle={{backgroundColor: 'rgba(00,00,00,.80)'}}
                    title={<Text><Icon size={30} name={'info'} color={'#3d933c'}></Icon></Text>}
                    confirmText="تایید"
                    show={showAlert}
                    showProgress={false}
                    message={this.state.messageError}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    titleStyle={{fontSize: 14, fontFamily: 'IRANSansMobile(FaNum)'}}
                    messageStyle={{fontSize: 15, fontFamily: 'IRANSansMobile(FaNum)'}}

                    confirmButtonColor="#3d933c"
                    confirmButtonStyle={{}}
                    confirmButtonTextStyle={{fontSize: 17, fontFamily: 'IRANSansMobile(FaNum)'}}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
export default SendMessage;
