import React from 'react';
import ChatBot from 'react-simple-chatbot';

class RiskFactorText extends React.Component {
  constructor(props){
    super(props);
    this.state={
        risk_factors:[]  
    };
  }
    
  componentDidMount(){
    this.props.triggerUserMessage();
     var factorName= localStorage.getItem('selected_risk_factors_names');
      factorName = factorName.split(',');
      this.setState({ risk_factors: factorName });
      
      //this.props.triggerNextStep({ trigger: 'suggest_for_factors' });
  }
  
  render(){
    const { risk_factors} = this.state;
    
    return (
        <div className="">
         I Confirm the following: 
        <br/>
        
        <ul>
        
        {
          
            risk_factors.map((data, i) => (
            <li key={i}>{data}</li>
          ))
         
        }
        </ul>
      </div>
    );
  }
  
}

export default RiskFactorText;
