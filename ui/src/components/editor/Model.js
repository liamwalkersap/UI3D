import React from "react";

const Model = (props) => {
    let model;

    if (props.geom)
        model = <primitive receiveShadow castShadow object={props.geom} attach="geometry" />
    else
        model = <></>

    return model;
};

export default Model;
