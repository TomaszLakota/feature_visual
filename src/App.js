import React from "react";
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectModel = this.handleSelectModel.bind(this);
        this.handleSelectClass = this.handleSelectClass.bind(this);
        this.handleSelectLayer = this.handleSelectLayer.bind(this);
    }
    state = {
        classes: ["plane", "car", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"],
        models: [
            { name: "resnet", layers: 8 },
            { name: "vgg", layers: 5 },
            { name: "eficientnet", layers: 5 }
        ],
        layers: ["Layer 1", "Layer 2", "Layer 3", "Layer 4", "Layer 5"],
        selectedClass: 0,
        selectedModel: 0,
        selectedLayer: 0,
        originalImageLink: "http://localhost:5000/img/10352/0.png",
        layersImageLinks: [
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png",
            "http://localhost:5000/img/10352/0.png"
        ],
        saliencyMapLinks: "http://localhost:5000/img/10352/0.png"
    };

    render() {
        return (
            <div className="App">
                <header className="App__header">
                    <h1>Feature visualization</h1>
                </header>
                <article>
                    {" "}
                    <div className="flex-container">
                        <section className="button-container">
                            {this.state.models.map((model, i) => {
                                return (
                                    <button
                                        key={model.name}
                                        onClick={e => {
                                            this.handleSelectModel(i, e);
                                        }}
                                        className={this.state.selectedModel === i ? "button-selected" : null}
                                    >
                                        {model.name}
                                    </button>
                                );
                            })}
                            <br></br>
                            {this.state.classes.map((className, i) => {
                                return (
                                    <button
                                        key={className}
                                        onClick={e => {
                                            this.handleSelectClass(i, e);
                                        }}
                                        className={this.state.selectedClass === i ? "button-selected" : null}
                                    >
                                        {className}
                                    </button>
                                );
                            })}
                            <br></br>
                            {this.state.layers.map((layer, i) => {
                                return (
                                    <button
                                        key={layer}
                                        onClick={e => {
                                            this.handleSelectLayer(i, e);
                                        }}
                                        className={this.state.selectedLayer === i ? "button-selected" : null}
                                    >
                                        {layer}
                                    </button>
                                );
                            })}
                            <br></br>
                            <button onClick={e => this.getNextImage()}>Next image</button>
                            <button onClick={e => this.getRandomImage()}>Random</button>
                        </section>
                        <div className="big-image-container">
                            <div
                                className="big-image"
                                style={{
                                    backgroundImage: `url(${this.state.originalImageLink})`
                                }}
                            ></div>
                            <div
                                className="big-image"
                                style={{
                                    backgroundImage: `url(${this.state.saliencyMapLinks})`
                                }}
                            ></div>
                        </div>
                    </div>
                    <section className="result">
                        <h2>Result</h2>
                        <div className="image-container">
                            {this.state.layersImageLinks.map((image, index) => {
                                return (
                                    <div key={index} className="image-box">
                                        <img src={image} alt={`Layer ${index}`}></img>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </article>
            </div>
        );
    }

    componentDidMount() {
        this.setLoadingImage();
        this.getRandomImage();
    }

    getNextImage = () => {
        this.setLoadingImage();
        this.getImageLink(this.state.selectedClass, this.state.models[this.state.selectedModel].name);
    };

    getRandomImage = () => {
        this.setLoadingImage();
        this.getImageLink(-1, this.state.models[this.state.selectedModel].name);
    };

    async getImageLink(model, classs) {
        // const apiLink = `http://127.0.0.1:5000/get_single?selected_class=${classs}&model=${model}`;
        // const response = await fetch(apiLink);
        // console.log(response);
        // const data = await response.json();
        //####################################################### remove code below in production; uncomment code above
        await new Promise(async resolve => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        const data = { folder_path: "img/10353/", selected_class: 2 };
        console.log("data", data);
        // //#######################################################
        const imgLink = "http://localhost:5000/" + data.folder_path; // @@@@@@@ hardcoded localhost link
        const imgClass = data.selected_class;
        console.log(imgLink, imgClass);
        this.setState({ selectedClass: imgClass });
        this.updateLinksInState(imgLink);
    }

    updateLinksInState(link = this.state.imgLink) {
        const length = this.state.models[this.state.selectedModel].layers;
        const layersImageLinks = [];
        // link = "http://localhost:5000/" + link;
        console.log(link);
        for (let i = 0; i < length; i++) {
            layersImageLinks.push(`${link}${this.state.selectedLayer}/${i}.png`);
        }
        this.setState({
            originalImageLink: link + "input_image.png",
            layersImageLinks: layersImageLinks,
            saliencyMapLinks: link + "sal0.png",
            imgLink: link
        });
    }

    handleSelectModel = index => {
        this.setState({ selectedModel: index }, () => {
            this.getNextImage();
        });
        console.log("selected ", index);
    };

    handleSelectClass = index => {
        this.setState({ selectedClass: index }, () => {
            this.getNextImage();
        });
        console.log("selectedClass ", index);
    };

    handleSelectLayer = index => {
        this.setState({ selectedLayer: index }, () => {
            this.updateLinksInState();
            console.log("selectedLayer ", index);
        });
    };

    setLoadingImage = () => {
        let link = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
        const length = this.state.models[this.state.selectedModel].layers;
        const layersImageLinks = [];
        // link = "http://localhost:5000/" + link;
        // console.log(link);
        for (let i = 0; i < length; i++) {
            layersImageLinks.push(link);
        }
        this.setState({
            originalImageLink: link,
            layersImageLinks: layersImageLinks,
            saliencyMapLinks: link,
            imgLink: link
        });
    };
}

export default App;
