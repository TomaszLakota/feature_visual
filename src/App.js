import React from "react";
import "./App.css";

class App extends React.Component {
    state = {
        classes: ["plane", "car", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"],
        selectedClassIndex: 0
    };
    render() {
        return (
            <div className="App">
                <header className="App-header">Feature visualization</header>
                {this.state.classes.map(el => {
                    return <button></button>;
                })}
            </div>
        );
    }
}

export default App;
