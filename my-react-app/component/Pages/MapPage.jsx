import React from "react";
import Map from "../Map.jsx";
import Content from "../Content.jsx";
const MapPage = ({ showUserTable }) => {
    return (
        <div>
            <Content showUserTable={showUserTable} />
        </div>
    );
};

export default MapPage;
