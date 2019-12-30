import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TextInput, Image,ActivityIndicator } from 'react-native';

import firebase from 'react-native-firebase';

const Loader=()=>(
    <View style={{justifyContent:'center',flex:1,backgroundColor:'black'}}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
  )

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      codeInput: '',
      phoneNumber: '+91',
      confirmResult: null,
      loading:false,
      codesent:false
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        this.setState({
          user: null,
          codeInput: '',
          phoneNumber: '+91',
          confirmResult: null,
          
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({loading:true})
    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult,loading:false,codesent:true}))
      .catch(error => {alert(error);this.setState({loading:false})});
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    this.setState({loading:true})
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ loading:false});
          this.props.navigation.navigate("Dashboard")
        })
        .catch(error =>{alert(error);this.setState({loading:false})});
    }
  };

  


  render() {
    const { user, confirmResult } = this.state;
    if (this.state.loading)
        return <Loader />

    return (
        
      <View style={{flex:1,backgroundColor:'black',height:"100%",justifyContent:'center',alignContent:'center' }}>
        <Image source={require('./images/logo.jpg')} style={{borderRadius:50, width: 100, height: 100, marginBottom: 25,alignSelf:'center',marginTop:25 }} />
      {!this.state.codesent?
        <View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{textAlign:'left',fontSize:25,fontFamily:'SF',marginTop:10,color:'#fff'}}>Enter Phone Number</Text> 
        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
                <TextInput
                    style={{backgroundColor:'#fff',marginTop:15,width:"90%",borderRadius:10}}
                    placeholder="Phone number"
                    keyboardType={'numeric'}
                    onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                    value={this.state.phoneNumber}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    />
        </View>

   
    <View
        style={{alignItems:'center',justifyContent:'center',marginTop:15}}
    >
      <TouchableOpacity
        onPress={()=>this.signIn()}
        style={{backgroundColor:'#f96d15',width:'90%',height:50,borderRadius:15,alignItems:'center',justifyContent:'center'}}
      >
          <Text>Get Code</Text>
      </TouchableOpacity>
      </View>
      </View>


        :

    
      <View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{textAlign:'left',fontSize:25,fontFamily:'SF',marginTop:10,color:'#fff'}}>Enter Code</Text> 
        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
                <TextInput
                    style={{backgroundColor:'#fff',marginTop:15,width:"90%",borderRadius:10}}
                    placeholder="Phone number"
                    keyboardType={'numeric'}
                    onChangeText={(codeInput) => this.setState({codeInput})}
                    value={this.state.codeInput}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    />
        </View>

    
    <View
        style={{alignItems:'center',justifyContent:'center',marginTop:15}}
    >
      <TouchableOpacity
        onPress={()=>this.confirmCode()}
        style={{backgroundColor:'#f96d15',width:'90%',height:50,borderRadius:15,alignItems:'center',justifyContent:'center'}}
      >
          <Text>Verify</Text>
      </TouchableOpacity>
      </View>
      </View>
}









      </View>
    );
  }
}