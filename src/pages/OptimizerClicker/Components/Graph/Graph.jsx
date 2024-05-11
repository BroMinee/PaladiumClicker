import React, {useEffect} from 'react';
import {ImCross} from "react-icons/im";
import Plot from 'react-plotly.js';
import fetchDataOnPublicURL from "../../../../FetchData";

const Graph = ({setShowGraph}) => {
    let [graphCSV, setGraphCSV] = React.useState({});

    function closeModal() {
        setShowGraph(false);
    }

    const fetchAllData = async () => {
        let res = await fetchDataOnPublicURL("/graph.csv").then((data) => {
            return csvJSON(data);
        })


        res = res.filter((data, index) => {
            if (data["Date"] === "") {
                return false;
            }
            return true;
        });

        res = res.map((data, index) => {
            for (var key in data) {
                if (key === "Date") {
                    continue;
                } else {
                    data[key] = parseInt(data[key].replace(/\?/g, ""));
                }
            }
            return data;
        });
        setGraphCSV(res.slice(0, 1000));
    }


    useEffect(() => {
        fetchAllData();
    }, []);


    let x = Object.keys(graphCSV).length === 0 ? [] : graphCSV.map((data) => {
        return data["Date"];
    });

    let listY = []

    let pseudoList = []
    for (var key in graphCSV[0]) {
        if (key === "Date") {
            continue;
        }
        pseudoList.push(key);
    }

    for (var i = 0; i < pseudoList.length; i++) {
        let valuePseudo = []
        for (var j = 0; j < graphCSV.length; j++) {
            valuePseudo.push(graphCSV[j][pseudoList[i]]);
        }
        listY.push(valuePseudo);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const [log, setLog] = React.useState(false);
    return <div className="modal" id="modal2">
        <div className="modal-back"></div>
        <div className="modal-container"
             style={{"background-image": `url(${process.env.PUBLIC_URL}/background_old.png)`}}>
            <ImCross onClick={closeModal} className="RedCrossIcon"/>
            <button onClick={() => setLog(!log)}>{`Echelle ${log ? "linéaire" : "logarithmique"}`}</button>
            {listY.length === 0 ? <div>Chargement...</div> :
            <Plot
                data={
                    listY.map((data, index) => {
                            return {
                                x: x,
                                y: data,
                                type: 'scatter',
                                mode: 'lines+markers',
                                visible: index < 10 || pseudoList[index] === "LeVraiFuze" ? "true" : "legendonly",
                                name: `Top ${index + 1} - ${pseudoList[index]}`
                            }
                        }
                    )
                }
                layout={{
                    title: 'Classement Clicker - Graphique intéractif',
                    autosize: true,
                    width: width * 0.8,
                    height: height * 0.8,
                    yaxis: {title: 'ClicCoins', type: log ? 'log' : 'linear'},
                    /* Log scale*/
                }}
            />}
        </div>
    </div>
};


function csvJSON(csv) {

    var lines = csv.split("\n");

    var result = [];
    var headers = lines[0].split(";");
    let postFuze = headers.findIndex((e) => { console.log(e); return e === "LeVraiFuze" });
    if(postFuze === -1) {
        postFuze = headers.length;
    }
    else if(postFuze +1 !== headers.length) {
        postFuze += 1;
    }
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(";");
        for (var j = 0; j < postFuze; j++) {

            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

export default Graph;
