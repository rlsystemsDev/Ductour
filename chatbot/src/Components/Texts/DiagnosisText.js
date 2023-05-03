import React from 'react';
import ChatBot from 'react-simple-chatbot';

class DiagnosisText extends React.Component {
  constructor(props){
    super(props);
    this.state={
        diagnosis_text:[]  
    };
  }
    
  componentDidMount(){
    this.props.triggerUserMessage();
      var diagnosisLast = JSON.parse(localStorage.getItem('diagnosis_question'));
      
      this.setState({ diagnosis_text: diagnosisLast });
      
      this.props.triggerNextStep({ trigger: 'proceed_to_diagnosis' });
  }
  
  render(){
      const { diagnosis_text} = this.state;
    
    return (
        <div className="">
         I Confirm the following: 
        <br/>
        
        <ul>
        
                <li>{diagnosis_text.name}</li>
        </ul>
      </div>
    );
  }
  
}

export default DiagnosisText;
