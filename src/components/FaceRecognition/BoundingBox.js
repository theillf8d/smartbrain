import React from 'react';
import './FaceRecognition.css';

const BoundingBox = ({ boxes }) => {
    boxes.map((box, i) => {
        return (
            <div>
                {<div
                    className="bounding-box"
                    style={{
                        top: boxes[i].topRow,
                        right: boxes[i].rightCol,
                        bottom: boxes[i].leftCol,
                        left: boxes[i].leftCol
                    }} >
                </div>}
            </div>
        );
    })
}

export default BoundingBox;