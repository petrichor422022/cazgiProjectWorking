import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }
  
  /*
  This method returns the component based on what the input mode is.
  If the requested input mode is "text" it returns a textbox with 4 rows.
  If the requested input mode is "url" it returns a textbox with 1 row.
  */
 
  renderOutput = (input_mode)=>{
    let rows = 1
    let mode = "url"
    //If the input mode is text make it 4 lines
    if(input_mode === "text"){
      mode = "text"
      rows = 4
    }
      this.setState({innercomp:<textarea rows={rows} cols="50" id="textinput"/>,
      mode: mode,
      sentimentOutput:[],
      sentiment:true
      });
  } 
  
  sendForSentimentAnalysis = () => {

     console.log("Sending for Sentiment Analysis") 

    this.setState({sentiment:true});
    let url = "http://localhost:8080";
    let mode = this.state.mode
    url = url+"/" + mode + "/sentiment?"+ mode + "="+document.getElementById("textinput").value;

    /* lets comment out for a sec and get it to bare bones */
    fetch(url).then((response)=>{
        response.text().then((data)=>{
          console.log(data);
        let data1 = JSON.parse(data);
        this.setState({sentimentOutput:data1.label});
        let output = data1.label;
        let color = "black"
        switch(output) {
          case "positive": color = "green";break;
          case "negative": color = "red";break;
          default: color = "yellow";
        }

        console.log(data1.label);
        output = <div style={{color:color,fontSize:20}}>{output}</div>
        this.setState({sentimentOutput:output});
      })}
      )
      // i added this as an example catch but its not very useful
      .catch(function(){
        console.log("err");
      })
      ;
  }

  sendForEmotionAnalysis = () => {

    console.log("Sending for Emotion Analysis") 

    this.setState({sentiment:false});
    let url = "http://localhost:8080";
    let mode = this.state.mode
    url = url+"/" + mode + "/emotion?"+ mode + "="+document.getElementById("textinput").value;

    fetch(url).then((response)=>{
      response.json().then((data)=>{
        console.log(data);
      //  let data1 = JSON.parse(data);
      this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
  })})  ;
  }
  

  render() {
    
    return (  
      <div className="App">
        <h1> cazgiProjectWorking </h1>
        <p> NOTE : When analyzing text, you must have at least 2 words in there or this thing breaks.</p>
      <button className="btn btn-info" onClick={()=>{this.renderOutput('text')}}>Text</button>
        <button className="btn btn-dark"  onClick={()=>{this.renderOutput('url')}}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/> <br/>
        {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;
