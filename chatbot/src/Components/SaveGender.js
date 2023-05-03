import React from 'react';
import ChatBot from 'react-simple-chatbot';

class SaveGender extends React.Component {
  constructor(props){
    super(props);
  }
    
  componentWillMount(){
      const { steps } = this.props;
    //this.props.triggerUserMessage();
   // console.log(this.props);
      const userGender = steps.ask_gender.value;
      localStorage.setItem('user_gender', userGender);
  }
  
  render(){
    return (
      <div className="">
        <div> Tell us how you feel.</div>
        <div>We will try to recognize your symptoms</div>
      </div>
    );
  }
  
}

export default SaveGender;
