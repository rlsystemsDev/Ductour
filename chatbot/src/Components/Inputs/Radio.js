import React from 'react';

export default class Radio extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            this.props.name + <input type="radio"  />
        )
    }    
    
}