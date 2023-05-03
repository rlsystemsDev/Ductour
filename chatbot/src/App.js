import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBot from 'react-simple-chatbot';

import { initialSteps, furtherSteps} from './Components/steps';

import {Header} from './Components/index';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      formality:false
    };
  }
  
  componentDidMount(){
    var getAge = localStorage.getItem('user_age');
    var getGender = localStorage.getItem('user_gender');
    localStorage.clear();
    if (getAge && getGender){
      localStorage.setItem('user_age', getAge);
      localStorage.setItem('user_gender', getGender);
    }
    
  }
  
 
  
  render(){
    var steps=[];
    steps = initialSteps;
    var getAge = localStorage.getItem('user_age');
    var getGender = localStorage.getItem('user_gender');
    if (getAge && getGender){
      steps[0].message ="Welcome Again! 😊";
    }
    return (
      
      <div className="" >
       
        <ChatBot
          headerComponent={<Header />}
          botAvatar="http://18.216.122.53:5000/images/logo_set.png"
          userAvatar="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/10-512.png"
          headerTitle="Doctour Chat Bot"
          width="100%"
          //height="100%"
          //style={{ minHeight: '500px' }}
          steps={steps}
          placeholder="Enter Your Message"
          enableSmoothScroll={true}
          enableMobileAutoFocus={true}
          bubbleStyle={{ background: '#e9267a', color:'white'}}
          bubbleOptionStyle={{ background: '#e9267a', color: 'white' }}
          style={{ background:'#e9267a1a'}}
          avatarStyle={{ background:'#e9267a'}}
        />
        
        
      </div>
      
    );
  }
  
}

export default App;
