import React from 'react';
import ChatBot, { Loading} from 'react-simple-chatbot';
import Api from '../helpers/ApiClient'
const jsonData=require('../Components/test.json');
class SaveSymptoms extends React.Component {
  constructor(props){
    super(props);
    this.state={
        symptomResponse:'',
        loading: true,
        result: '',
        trigger: false,
    };
  }
    
  async componentDidMount(){
      const { steps } = this.props;
      const symptoms = steps.ask_symptoms.value;
      localStorage.setItem('symptoms_user', symptoms);
      var data = { text: symptoms };
   // let jsonData = await Api('parse','post',data);
      if (jsonData.data.mentions){
          var jsond = jsonData.data.mentions;
          var found=false;
          for (var i in jsond){
            if (jsond[i] && jsond[i].choice_id=='present'){
              found=true;
              this.setState({ 'loading': false, result: "I Have Noted " + jsond[i].name });
              localStorage.setItem('symptoms_response', jsond[i].name);
              localStorage.setItem('symptom_id', jsond[i].id);
              this.props.triggerNextStep({ trigger:'ask_risk_factors' });
            }
          }  
          if (!found){
            this.setState({ 'loading': false, result: "I Didn't Understand. Please name your symptoms using simple language." });
            this.props.triggerNextStep({ trigger: 'ask_symptoms' });
          }
      }
      else{
        this.setState({ 'loading': false, result: "I Didn't Understand. Please name your symptoms using simple language." });
        this.props.triggerNextStep({ trigger: 'ask_symptoms' });
      }
    
    //   localStorage.setItem('symptomResponse', JSON.stringify(getSymptomResponse)); 
    //   this.setState({'loading': false, result: JSON.stringify(getSymptomResponse)});
  }
  
  render(){
      const { trigger, loading, result } = this.state;
    return (
      <div className="" >
            {loading ? <Loading /> : result}
            {/* {
                !loading &&
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 20,
                    }}
                >
                    {
                        !trigger &&
                        <button
                            onClick={() => this.triggetNext()}
                        >
                            Search Again
              </button>
                    }
                </div>
            } */}
      </div>
    );
  }
  
}

export default SaveSymptoms;
