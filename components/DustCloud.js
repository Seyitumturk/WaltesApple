// DustCloud.js
import React from 'react';
import { View } from 'react-native';
import Particles from 'react-native-particles';

const DustCloud = ({ x, y, visible }) => {
    if (!visible) return null;

    return (
        <View style={{ position: 'absolute', top: y, left: x, width: 100, height: 100 }}>
            <Particles
                particleCount={20}
                direction={0}
                spread={360}
                speed={1}
                lifespan={1000}
                colors={['#d8b686', '#a9835a']}
                width={100}
                height={100}
            />
        </View>
    );
};

export default DustCloud;
