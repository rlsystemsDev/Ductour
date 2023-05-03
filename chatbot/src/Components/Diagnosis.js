import React from 'react';
import ChatBot, { Loading} from 'react-simple-chatbot';
import { Chart } from "react-google-charts";
import Api from '../helpers/ApiClient'
const jsonData=require('../Components/diagnosis.json');

class Diagnosis extends React.Component {
  constructor(props){
    super(props);
    this.state={
        response:'',
        loading: true,
        result: '',
        trigger: false,
        radioQuestions:[],
        isSelected:false,
        checkbox_disable: false,
        stop:false
    };
  }
    
  async componentDidMount(){
        
      var getSymptomId = localStorage.getItem('symptom_id');
      var getSex = localStorage.getItem('user_gender').toLowerCase();
      var getAge = parseInt(localStorage.getItem('user_age'));
      var getSelectedRiskFactors = localStorage.getItem('selected_risk_factors');
      var getAllRiskFactors = JSON.parse(localStorage.getItem('all_risk_factors'));
      getSelectedRiskFactors = getSelectedRiskFactors.split(',');
      var selectedRiskFactorsTravel = localStorage.getItem('selected_risk_factors_travel');
      var getAllRiskFactorsTravel = JSON.parse(localStorage.getItem('all_risk_factors_travel'));
      selectedRiskFactorsTravel = selectedRiskFactorsTravel.split(',');
      var getSelectedRiskFactorsAll = getSelectedRiskFactors.concat(selectedRiskFactorsTravel);
      var getAllRiskFactorsUnSelected = getAllRiskFactors.concat(getAllRiskFactorsTravel);
     
      var evidenceData = [];
      evidenceData.push({ id: getSymptomId, choice_id:'present', initial:true });
      
      getAllRiskFactorsUnSelected.map((rf,index) => (
          getSelectedRiskFactorsAll.includes(rf.id) ? 
              evidenceData.push({ id: rf.id, 'choice_id': "present" })    
          :   
              evidenceData.push({ id: rf.id, 'choice_id': "absent" })     
      ))
      
      // Check if Any diagnosis Question is Answered, Then add that response to diagnosis next request
      var haveLastEvidenceData = localStorage.getItem('last_diagnosis_evidence_data');
      if (haveLastEvidenceData){
          var getLastDiagonisQuestionResponse = JSON.parse(localStorage.getItem('diagnosis_all_questions_response'));
          if (getLastDiagonisQuestionResponse){
              getLastDiagonisQuestionResponse.map((gLDQR,index) => ( 
                  evidenceData.push({ id: gLDQR.question_id, choice_id: gLDQR.option })
              ))
          }
      }
     // console.log(evidenceData);
      var data = { sex: getSex, age: getAge, evidence: evidenceData };
      localStorage.setItem('last_diagnosis_evidence_data', JSON.stringify(evidenceData));
      
    
      //let getResponse = await Api('diagnosis','post',data);
      if (jsonData.data.should_stop){
          
          this.setState({ 'loading': false, result: [],stop:true });
      }
      else{
          this.setState({ 'loading': false, result: jsonData.data });
      }
    //   localStorage.setItem('diagnosis_response', JSON.stringify(getResponse)); 
      
     // this.triggetNext();
  }
  
  
    triggetNext = () => {
        this.setState({ trigger: false, checkbox_disable:true});
        this.props.triggerNextStep({ trigger: 'diagnosis_text' });
    }
    
    handleQuestion = async (qId,name,option,adddiagnoData=false) =>{
        var qData = { question_id: qId, name: name, option: option};
        this.setState({ radioQuestions: [] });
        localStorage.setItem('diagnosis_question', JSON.stringify(qData));
        if (adddiagnoData){
            await this.addDiagnosisData();
            this.triggetNext();
        }
       
        this.setState({trigger:true});
         
    }
    
    handleQuestionAndDiagnosisData = (qId, option, trigger = true) => {
        var illName="";
        if(option=='absent'){
            illName="None of the Above";
        }
        if (option == 'unknown') {
            illName = "Don't Know";
        }
        var qaData = { question_id: qId, name: illName, option: option };
        this.setState({ radioQuestions: [] });
        localStorage.setItem('diagnosis_question', JSON.stringify(qaData));
        var qData = JSON.parse(localStorage.getItem('diagnosis_question'));
        var getDiagonisQuestionAllResponse = localStorage.getItem('diagnosis_all_questions_response');
        if (getDiagonisQuestionAllResponse) {
            getDiagonisQuestionAllResponse = JSON.parse(getDiagonisQuestionAllResponse);
            getDiagonisQuestionAllResponse.push(qData);
            if (!this.state.isSelected) {

                localStorage.setItem('diagnosis_all_questions_response', JSON.stringify(getDiagonisQuestionAllResponse));
                this.setState({ isSelected: true });
            }
        }
        else {
            var questionResponse = [];
            questionResponse.push(qData);
            localStorage.setItem('diagnosis_all_questions_response', JSON.stringify(questionResponse));
        }

    }
    
    handleQuestionSubmit = async () =>{
        if(this.state.radioQuestions.length > 0){
            this.state.radioQuestions.map(async (item, index) => (  
                await this.handleQuestionAndDiagnosisData(item.item_id,item.option,false)
            ))
        }
        else{
            this.addDiagnosisData();
        }

        this.triggetNext();
    }
    
    addDiagnosisData = () =>{
        var qData = JSON.parse(localStorage.getItem('diagnosis_question'));
        var getDiagonisQuestionAllResponse = localStorage.getItem('diagnosis_all_questions_response');
        if (getDiagonisQuestionAllResponse) {
            getDiagonisQuestionAllResponse = JSON.parse(getDiagonisQuestionAllResponse);
            getDiagonisQuestionAllResponse.push(qData);
            if (!this.state.isSelected) {

                localStorage.setItem('diagnosis_all_questions_response', JSON.stringify(getDiagonisQuestionAllResponse));
                this.setState({ isSelected: true });
            }
        }
        else {
            var questionResponse = [];
            questionResponse.push(qData);
            localStorage.setItem('diagnosis_all_questions_response', JSON.stringify(questionResponse));
        }
    }
    
    
    handleRadioQuestion = (items,option) =>{
        this.setState({trigger:true});
        var radioData=[];
        items.map((item,index) => (  
            radioData.push({ item_id: item.id,option:option })
        ))
       
        this.setState({ radioQuestions: radioData });
    }
    
  render(){
      const { trigger, loading, result,stop } = this.state;
    return (
      <div className="" >
            {loading ? <Loading /> :
                
                !stop ?
                result.question ? 
                <div>
                <div><i className="fa fa-question-circle-o"></i> {result.question.text}</div> 
                
                        {/* {(result.question.extras && result.question.extras.image_url) ? 
                            <div style={{marginTop:10,textAlign:'center'}}> <img style={{borderRadius:'60px'}} src={result.question.extras.image_url} />  
                        </div>
                        : ""} */}
                        {(result.question.type && result.question.type=='single') ?     
                            <div>
                                    {(result.question.items && result.question.items[0] && result.question.items[0].id) ? 
                                        <div style={{ marginTop: 10,textAlign:'center'}}>
                                        <button className="btn btn-success btn-submit-custom" onClick={() => this.handleQuestion(result.question.items[0].id, "Yes","present",true)}>Yes</button>
                                        <button className="btn btn-success btn-submit-custom" onClick={() => this.handleQuestion(result.question.items[0].id, "No", "absent",true)} style={{marginLeft:5}}>No</button>
                                        <button className="btn btn-success btn-submit-custom" onClick={() => this.handleQuestion(result.question.items[0].id, "Don't Know", "unknown",true)} style={{ marginLeft: 5 }}>Don't Know</button>
                                
                                        </div>
                                    :""}   
                    
                    
                    
                            </div>
                        : ""}
                        
                        {(result.question.type && (result.question.type == 'group_single' || result.question.type == 'group_multiple') ) ?     
                             <div style={{marginTop:10}}> 
                                {result.question.items ? 
                                    
                                    result.question.items.map((qData,index) => (
                                        <div>
                                            {!this.state.checkbox_disable ?
                                                <input type="radio" name="question" onChange={(event) => this.handleQuestion(qData.id, qData.name,"present",false)} value={qData.id} />
                                            :""}
                                            <p class="inputp">{qData.name}</p>
                                            
                                        </div> 
                                    ))
                                    
                                    :"" }    
                                {result.question.items ? 
                                <div>
                                    <div>
                                            {!this.state.checkbox_disable ?
                                        <input type="radio" name="question" onChange={() => this.handleRadioQuestion(result.question.items,"absent")} />
                                            :""}
                                            <p class="inputp">None of the Above</p>
                                    </div>
                                    
                                    <div>
                                            {!this.state.checkbox_disable ?
                                        <input type="radio" name="question" onChange={() => this.handleRadioQuestion(result.question.items,"unknown")} />
                                            :""}
                                            <p class="inputp">Don't Know</p>
                                    </div>
                                </div>
                                : "" }    
                                    
                                { trigger ?     
                                    <div style={{ marginTop: 10,textAlign:'center' }}>
                                <button className="btn btn-success btn-submit-custom" onClick={this.handleQuestionSubmit}>Submit</button> 
                                </div>
                                :""}   
                             </div>
                        :
                        ""}
                </div>
                
                :""
                    : <Chart
                       height={'100%'}
                        chartType="BarChart"
                        loader={<div>Please Wait. Results are Preparing.</div>}
                        data={[
                            ['City', '2010 Population', '2000 Population'],
                            ['New York City, NY', 8175000, 8008000],
                            ['Los Angeles, CA', 3792000, 3694000],
                            ['Chicago, IL', 2695000, 2896000],
                            ['Houston, TX', 2099000, 1953000],
                            ['Philadelphia, PA', 1526000, 1517000],
                        ]}
                        options={{
                            title: 'Population of Largest U.S. Cities',
                            chartArea: { width: '50%' },
                            hAxis: {
                                title: 'Total Population',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'City',
                            },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '1' }}
                    />
            }
            {/* {
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
            } */}
      </div>
    );
  }
  
}

export default Diagnosis;
