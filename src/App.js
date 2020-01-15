import React from "react";
import "./App.css";

class App extends React.Component {
    state = {
        classes: ["plane", "car", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"],
        models: [
            { name: "resnet", layers: 5 },
            { name: "vgg", layers: 5 },
            { name: "eficientnet", layers: 5 }
        ],
        selectedClassIndex: 0,
        selectedModel: 0,
        originalImageLink: "localhost:5000/api/costam/123/original.jpg",
        layersImageLinks: ["localhost:5000/api/costam/123/original.jpg", "localhost:5000/api/costam/123/original.jpg"],
        saliencyMapLinks: "localhost:5000/api/costam/123/original.jpg"
    };
    render() {
        return (
            <div className="App">
                <header className="App__header">
                    <h1>Feature visualization</h1>
                </header>
                <article>
                    <section className="buttons">
                        {this.state.models.map(model => {
                            return <button key={model.name}>{model.name}</button>;
                        })}
                        <br></br>
                        {this.state.classes.map(className => {
                            return <button key={className}>{className}</button>;
                        })}
                    </section>
                    <section className="result">
                        <h3>Result</h3>
                        <div className="image-container">
                            <div className="image-box">
                                <img src={this.state.originalImageLink} alt="Original input"></img>
                            </div>
                            {this.state.layersImageLinks.map((image, index) => {
                                return (
                                    <div key={index} className="image-box">
                                        <img src={image} alt={`Layer ${index}`}></img>
                                    </div>
                                );
                            })}
                            <div className="image-box">
                                <img src={this.state.saliencyMapLinks} alt="Saliency map"></img>
                            </div>
                        </div>
                    </section>
                </article>
            </div>
        );
    }

    componentDidMount() {
        this.getImageLink(this.state.selectedModel, this.state.selectedClassIndex);
    }

    async getImageLink(model, classs) {
        const apiLink = "localhost:5000/get_single";
        // const response = await fetch(apiLink);
        // const imgLink = await response.json();
        const imgLink = "http://localhost:8000/123/";
        this.updateLinksInState(imgLink);
    }

    updateLinksInState(link) {
        const length = this.state.models[this.state.selectedModel].layers;
        const layersImageLinks = [];
        for (let i = 0; i < length; i++) {
            layersImageLinks.push(`${link}img${i}.png`);
        }
        this.setState({
            originalImageLink: link + "input_image.png",
            layersImageLinks: layersImageLinks,
            saliencyMapLinks: link + "saliency_map.png"
        });
    }
}

export default App;
