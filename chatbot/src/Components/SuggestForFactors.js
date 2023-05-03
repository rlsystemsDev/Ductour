import React from 'react';
import ChatBot, { Loading} from 'react-simple-chatbot';
import Api from '../helpers/ApiClient'
const jsonData=require('../Components/suggestion.json');
class SuggestForFactors extends React.Component {
  constructor(props){
    super(props);
    this.state={
        response:'',
        loading: true,
        result: '',
        trigger: false,
        checkbox_disable: false,
    };
  }
    
  async componentDidMount(){
    //   const { steps } = this.props;
    //   const symptoms = steps.ask_symptoms.value;
    //   localStorage.setItem('symptoms_user', symptoms);
      var getSex = localStorage.getItem('user_gender').toLowerCase();
      var getAge = parseInt(localStorage.getItem('user_age'));
      var getSelectedRiskFactors = localStorage.getItem('selected_risk_factors');
      getSelectedRiskFactors = getSelectedRiskFactors.split(',');
      var symptomId = localStorage.getItem('symptom_id');
      getSelectedRiskFactors.push(symptomId);
      var data = { sex: getSex, age: getAge, selected: getSelectedRiskFactors };
    
       //let getResponse = await Api('suggest','post',data);
    //   localStorage.setItem('suggestion_response', JSON.stringify(getResponse)); 
      this.setState({ 'loading': false, result: jsonData.data});
        
  }
  handleCheckBox = (event) =>{
      var selectedSuggestions = localStorage.getItem('selected_suggestions');
      var selectedSuggestionsNames = localStorage.getItem('selected_suggestions_names');
      var id = "";
      var name = "";
      var eventData = JSON.parse(event.target.value);
      
      if (eventData.id && eventData.name) {
          id = eventData.id;
          name = eventData.name;
      }
      
      if (selectedSuggestions && id != '' && name != '') {

          selectedSuggestions = selectedSuggestions.split(',');
          selectedSuggestionsNames = selectedSuggestionsNames.split(',');
          if (event.target.checked) {
              selectedSuggestions.push(id);
              selectedSuggestionsNames.push(name);
          }
          else {
              var index = selectedSuggestions.indexOf(id);
              if (index >= 0) {
                  selectedSuggestions.splice(index, 1);
              }
              
              var indexN = selectedSuggestionsNames.indexOf(name);
              if (indexN >= 0) {
                  selectedSuggestionsNames.splice(indexN, 1);
              }
          }

          selectedSuggestions = selectedSuggestions.join(',');
          selectedSuggestionsNames = selectedSuggestionsNames.join(', ');
          localStorage.setItem('selected_suggestions', selectedSuggestions);
          localStorage.setItem('selected_suggestions_names', selectedSuggestionsNames);

      }
      else if (id != '' && name != '') {
          localStorage.setItem('selected_suggestions', id);
          localStorage.setItem('selected_suggestions_names', name);
      }
      var updatedSuggestions = localStorage.getItem('selected_suggestions');
      if (updatedSuggestions == '') {
          this.setState({ trigger: false });
      }
      else {
          this.setState({ trigger: true });
      }
      
  }
  
    triggetNext = () => {
        this.setState({ trigger: false, checkbox_disable: true });
        this.props.triggerNextStep({ trigger: 'suggestion_text' });
    }
  
  render(){
      const { trigger, loading, result } = this.state;
    return (
      <div className="" >
            {result ? <div style={{ marginBottom: 20 }}>Do you have any of the following symptoms?</div> : ""}
            {loading ? <Loading /> :

                result.map((data, i) => (
                    <div key={i}>
                        
                        {!this.state.checkbox_disable ?         
                <input type="checkbox" value={JSON.stringify(data)} onChange={(event) => this.handleCheckBox(event)} name="suggestion" />
                :""}
                        <p class="inputp">{data.name}</p>
                   
                            
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

export default SuggestForFactors;
