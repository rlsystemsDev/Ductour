import React from 'react';
class Header extends React.Component {
  constructor(props){
    super(props);
  }
    
  render(){
     
    return (
        <div className="rsc-header sc-gqjmRU glfuN">
            <div style={{textAlign:'center',flex:1,marginTop:10}}>
                <img style={{width:'3%'}} src="http://18.216.122.53:5000/images/logo_set.png"/>
                
            </div>
            {/* <div><p style={{ fontWeight: 'bold',fontSize:20 }}>Doctour App</p></div> */}

      </div>
    );
  }
  
}

export default Header;
