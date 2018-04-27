import React, { Component } from 'react';
import logo  from '../../assets/images/logo.png'

class App extends Component {
  constructor(props){
    super(props);
  }


  render() {
    return (<div>
        <img src={logo}/>hello，我是一个新页面
      </div>);
  }
}
export default App;