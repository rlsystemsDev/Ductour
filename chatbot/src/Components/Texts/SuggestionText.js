import React from 'react';
import ChatBot from 'react-simple-chatbot';

class SuggestionText extends React.Component {
  constructor(props){
    super(props);
    this.state={
        suggestions:[]  
    };
  }
    
  componentWillMount(){
    this.props.triggerUserMessage();
      var suggestionsNames = localStorage.getItem('selected_suggestions_names');
      suggestionsNames = suggestionsNames.split(',');
      this.setState({ suggestions: suggestionsNames });
  }
  
  render(){
    const { suggestions } = this.state;
    
    return (
      <div className="">
        I Confirm the following:
        <br />
        <ul>
          {
            suggestions.map((data, i) => (
              <li key={i}>{data}</li>
            ))

          }
        </ul>
      </div>
    );
  }
  
}

export default SuggestionText;
