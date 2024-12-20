import React ,{useRef, useState} from 'react';
import styled from 'styled-components';

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ObjectDetectorContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

const DetectorContainer = styled.div`
min-width: 200px;
height: 700px;
border: 3px solid #fff;
border-radius: 5px;
display: flex;
align-items: center;
justify-content: center;
position: relative;
`;

const TargetImg = styled.img`
height: 100%;
`;

const HiddenFileInput = styled.input`
disply: none;
`;

const SelectButton=styled.button`
    padding: 7px 10px;
    border:2px solid trannsparent;
    background-color:#fff;
    color: #0a0f22;
    font-size 16px;
    font-weight:500;
    outline:none;
    margin-top: 2em;
    cursor: pointer; 
    transition:all 260ms ease-in-out; 

    &:hover{
        background-color: transparent; 
        border: 2px solid #fff; 
        color: #fff;
    }
`;

const TargetBox = styled.div`
position: absolute;

left: ${({x})=> x+"px"};
top: ${({y})=> y+"px"};
width: ${({width})=> width+"px"};
height: ${({height})=> height+"px"};

border: 4px solid #1ac71a;
background-color: transparent;
z-index: 20;

&::before {
    content: "${({classType, score}) => `${classType} ${score.toFixed(2)}%`}";
    color: #1ac71a;
    font-weight: 17px;
    position: absoloute;
    top: -1.5px;
    left: -5px;
}
`;

export function ObjectDetector(props) {
const fileInputRef = useRef();
const imageRef = useRef();
const [imgData,setImgData ] = useState(null);
const [predictions, setPredictions] = useState([]);

const isEmptyPredictions = !predictions || predictions.length === 0;

const openFilePicker = () => {
    if(fileInputRef.current) fileInputRef.current.click();
};

const normalizePredictions =(predictions, imgSize) => {
    if(!predictions || !imgSize || !imageRef) return predictions || [];
    return predictions.map((prediction) => {
        const {bbox} = prediction;
        const oldX = bbox[0];
        const oldY = bbox[1];
        const oldWidth = bbox[2];
        const oldHeight = bbox[3];

        const imgWidth = imageRef.current.width;
        const imgHeight = imageRef.current.height;

        const x = (oldX * imgWidth)/imgSize.width;
        const y = (oldY * imgHeight)/imgSize.height;
        const width =(oldWidth * imgWidth)/ imgSize.width;
        const height = (oldHeight* imgHeight)/imgSize.height;
 /*jshint -W119*/
        return {...prediction, bbox: [x,y,width,height]};
         /*jshint +W119*/
    }
    );
} 

const detectObjectOnImage = async (imageElement, imgSize) => {
    const model = await cocoSsd.load({});
    const predictions = await model.detect(imageElement,20);
    const normalizedPredictions = normalizePredictions(predictions,imgSize);
    setPredictions(normalizedPredictions);
    console.log("predictions: ", predictions);
};

const readImage = (file) => {
    return new Promise((rs,rj) => {
        const fileReader = new FileReader();
        fileReader.onload = () => rs(fileReader.result);
        fileReader.onerror = () => rj(fileReader.error);
        fileReader.readAsDataURL(file);
    });
};

const onSelectImage = async (e) => {
    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImgData(imgData);

    const imageElement = document.createElement("img");
    imageElement.src = imgData;

    imageElement.onload = async () => {
        const imgSize = { width: imageElement.width,height: imageElement.height};
        await detectObjectOnImage(imageElement, imgSize);

    };
};

 return (
 <ObjectDetectorContainer>
        <DetectorContainer>
            {imgData && <TargetImg src={imgData} ref={imageRef}/>}
            {!isEmptyPredictions && predictions.map((prediction,idx) => (
                <TargetBox ket={idx} 
                x={prediction.bbox[0]} 
                y={prediction.bbox[1]} 
                width={prediction.bbox[2]} 
                height={prediction.bbox[3]} 
                classType={prediction.class} 
                score={prediction.score *100}/>
            ))}
            </DetectorContainer>
        <HiddenFileInput type="file" ref={fileInputRef} onChange={onSelectImage}/>
        <SelectButton onClick={openFilePicker}>Select Image</SelectButton>
    </ObjectDetectorContainer>
    
 )
}


