import React from 'react';
class Welcome extends React.Component {
  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    var getAge = localStorage.getItem('user_age');
    var getGender = localStorage.getItem('user_gender');
    if (getAge && getGender){
      this.props.triggerNextStep({ trigger: 'show_symptom_message' });
    }  
  }
  
  handleSubmit = (action) =>{
    if (action=='1'){
      this.props.triggerNextStep({ trigger:'accept-message'});
    }
      
    if(action=='0'){
      this.props.triggerNextStep({ trigger: 'decline-message' });
    }
  }
    
  render(){
     
    return (
      <div className="welcome_content" style={{flex:1}} >
            
        <div className="welcome_tabs welcome_tab_1"> 
          <i className='fa fa-handshake-o'></i> Hello there!
            </div>
        <div className="welcome_tabs welcome_tab_2">
          <i className='fa fa-hand-o-right'></i>  This service is for informational purposes and is not a qualified medical opinion.
        </div>
        
        <div className="welcome_tabs welcome_tab_3" style={{width:'16%'}}>
          <i className='fa fa-file-pdf-o'></i> <a href="" style={{color:'white',textDecoration:'none'}} target="_blank">View Terms and Conditions</a> 
        </div>
        
        <div className="welcome_tabs welcome_tab_3">
          <i className='fa fa-hand-o-right'></i>  Kindly Read and Accept Terms and Conditions
        </div>
        <div className="welcome_tab_buttons" style={{marginTop:15}}>
          <button class="btn btn-primary btn-terms" onClick={() => this.handleSubmit('1')} title="Accept"><i class="fa fa-check"></i></button>
          <button class="btn btn-danger btn-terms" onClick={() => this.handleSubmit('0')} style={{ marginLeft: 10 }} title="Decline"><i class="fa fa-times"></i></button>
        </div>
      </div>
    );
  }
  
}

export default Welcome;
