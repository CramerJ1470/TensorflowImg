import React ,{useRef} from 'react';
import styled from 'styled-components';

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ObjectDetectorContainer = styled.div`
display: flex;
flex-direction: column;
aligh-items: center;
`;

const DetectorContainer = styled.div`
min-width: 200px;
height: 500px;
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


export function ObjectDetector(props) {

const fileInputRef = useRef();

const openFilePicker = () => {
    if(fileInputRef.current) fileInputRef.current.click();
};


 return (
 <ObjectDetectorContainer>
        <DetectorContainer>Img</DetectorContainer>
        <HiddenFileInput type="file" ref={fileInputRef} />
        <SelectButton onClick={openFilePicker}>Select Image</SelectButton>
    </ObjectDetectorContainer>
    
 )
}


