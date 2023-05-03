import React from 'react';
import ChatBot from 'react-simple-chatbot';

class RiskFactorTravelText extends React.Component {
  constructor(props){
    super(props);
    this.state={
        text:[]  
    };
  }
    
  componentWillMount(){
    this.props.triggerUserMessage();
      var getText = localStorage.getItem('selected_risk_factors_names_travel');
      getText = getText.split(',');
      this.setState({ text: getText });
  }
  
  render(){
    const { text } = this.state;
    return (
        <div className="">
        I Confirm the following:
        <br />
        
        <ul>

          {

            text.map((data, i) => (
              <li key={i}>{data}</li>
            ))

          }
        </ul>
      </div>
    );
  }
  
}

export default RiskFactorTravelText;
