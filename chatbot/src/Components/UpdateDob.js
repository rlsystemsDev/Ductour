import React from 'react';
import ChatBot from 'react-simple-chatbot';

class UpdateDob extends React.Component {
  constructor(props){
    super(props);
   // this.props.submitUserMessage();
  }
    
  componentWillMount(){
      const { steps } = this.props;
      const userAge = steps.trigger_age.value;
      localStorage.setItem('user_age', userAge);
  }
  
  render(){
    return (
      <div className="">
      Please Select Gender
      </div>
    );
  }
  
}

export default UpdateDob;
