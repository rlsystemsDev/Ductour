import React from 'react';
import ChatBot, { Loading} from 'react-simple-chatbot';
import Api from '../helpers/ApiClient'

const jsonData=require('../Components/riskFactor.json');
class AskRiskFactors extends React.Component {
  constructor(props){
    super(props);
    this.state={
        response:'',
        loading: true,
        result: '',
        trigger: false,
        is_risk_updated:false,
        checkbox_disable:false,
    };
  }
    
  async componentDidMount(){
      const { steps } = this.props;
     // let jsonData = await Api('risk_factors', 'get', {});
      if (jsonData.data){
          var jsond = jsonData.data;
          var html='';
        //   for (var i in jsond){
        //       var radioData = Radio(jsond[i]);
        //       html += radioData;
        //   }
          
          this.setState({ 'loading': false, result: jsond });
      }
      
    //   let getResponse = await Api('risk_factors','get',{});
    //   localStorage.setItem('riskFactorResponse', getResponse.data); 
    //   this.setState({ 'loading': false, result: getResponse.data});
  }
  
  async componentWillMount(){
      
  }
  
    handleCheckBox= (event) =>{
       
        this.setState({ is_risk_updated: true });
        var selectedFactors = localStorage.getItem('selected_risk_factors');
        var selectedFactorsName = localStorage.getItem('selected_risk_factors_names');
        var id="";
        var name="";
       var eventData = JSON.parse(event.target.value);
        
        if (eventData.id && eventData.name){
            id = eventData.id;
            name = eventData.name;
        }
        if (selectedFactors && id!='' && name!=''){
            
            selectedFactors = selectedFactors.split(',');
            selectedFactorsName = selectedFactorsName.split(',');
            if(event.target.checked){
                selectedFactors.push(id);
                selectedFactorsName.push(name);
            }
            else{
                var index = selectedFactors.indexOf(id);
                if (index >= 0) {
                    selectedFactors.splice(index, 1);
                }
                
                var indexN = selectedFactorsName.indexOf(name);
                if (indexN >= 0) {
                    selectedFactorsName.splice(indexN, 1);
                }
            }
            
            selectedFactors=selectedFactors.join(',');
            selectedFactorsName = selectedFactorsName.join(', ');
            localStorage.setItem('selected_risk_factors', selectedFactors);
            localStorage.setItem('selected_risk_factors_names', selectedFactorsName);
            
        }
        else if (id != '' && name != ''){
            localStorage.setItem('selected_risk_factors', id);
            localStorage.setItem('selected_risk_factors_names', name);
        }
        var updatedFactors = localStorage.getItem('selected_risk_factors');
        if (updatedFactors==''){
            this.setState({ trigger:false});    
        }
        else{
            this.setState({ trigger: true });    
        }
    }
  
    triggetNext = () =>{
        this.setState({ trigger: false, checkbox_disable:true});
        this.props.triggerNextStep({ trigger: 'risk_factors_text' });
    }
    
    HandleAllRiskFactors = (data) =>{
        if (this.state.is_risk_updated){
            return ;
        }
        var allRiskFactors = localStorage.getItem('all_risk_factors');
        var riskAlldata=[];
        if (allRiskFactors){
            allRiskFactors = JSON.parse(allRiskFactors);
            
            allRiskFactors.push({ id: data.id, name: data.name });
            localStorage.setItem('all_risk_factors', JSON.stringify(allRiskFactors));
        }
        else{
            riskAlldata.push({ id: data.id,name:data.name});
            localStorage.setItem('all_risk_factors', JSON.stringify(riskAlldata));
        }
        
    }
    
  render(){
      const { trigger, loading, result } = this.state;
     
       
    return (
      <div className="" >
            {result ? <div style={{ marginBottom:20 }}>Please check all that apply to you.</div> :"" }    
            {loading ? <Loading /> : 
                
                result.map((data, i) => (
                <div key={i}>
                    {data.seriousness && data.seriousness=='serious' ?
                            
                        <div>
                                {this.HandleAllRiskFactors(data)} 
                                {!this.state.checkbox_disable ?    
                            <input type="checkbox" value={JSON.stringify(data)} onChange={ (event) => this.handleCheckBox(event)  } name="risk_factor" /> :"" }
                                <p class="inputp">{data.name}</p>
                        </div>
                    : []}
                        
                </div>
            
            ))
            
            
            
            
        }
            {
                !loading &&
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 20,
                    }}
                >
                    {
                        trigger &&
                            <button
                           
                            className="btn btn-success btn-submit-custom"
                                onClick={() => this.triggetNext()}
                            >
                                Submit
                            </button>
                    }
                </div>
            }
      </div>
    );
  }
  
}

export default AskRiskFactors;
