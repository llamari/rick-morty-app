import { useRoute } from '@react-navigation/native';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import { SPECIES_MAP, STATUS_MAP } from './CharactersList';
import { useFonts } from 'expo-font';
import { TradeWinds_400Regular } from '@expo-google-fonts/trade-winds';

const GENDER_MAP = {
    Male: "Masculino",
    Female: "Feminino",
    Genderless: "Sem gênero",
    unknown: "Desconhecido"
};

export function CharacterDetails() {
    const route = useRoute();
    const { id } = route.params;
    const [character, setCharacter] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [location, setLocation] = useState(null);

    let [fontsLoaded] = useFonts({
        TradeWinds_400Regular
    });

    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // loop infinito de rotação
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 6000, // duração em ms (ajuste conforme quiser)
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    async function GetCharacter() {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        setCharacter(response.data);
        GetOrigin(response.data.origin.url);
        GetLocation(response.data.location.url);
    }

    async function GetOrigin(url) {
        if (url) {
            const response = await axios.get(url);
            setOrigin(response.data);
        }
    }

    async function GetLocation(url) {
        if (url) {
            const response = await axios.get(url);
            setLocation(response.data);
        }
    }

    useEffect(() => {
        GetCharacter();
    }, []);

    if (!fontsLoaded) {
        return null;
    }
    
    if (!character || !origin || !location) {
        return <Text>Carregando...</Text>;
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View>
            <View style={styles.header}>
                <Image resizeMode="contain" source={require("../assets/logo.png")} style={styles.img} />
            </View>
            <View style={styles.body}>
                <View style={styles.portalContainer}>
                    <Animated.Image
                        resizeMode="contain"
                        source={require("../assets/portal.png")}
                        style={[styles.portalImg, { transform: [{ rotate: spin }] }]}
                    />

                    <Image source={{ uri: character.image }}
                        style={styles.characterImg}
                    />
                </View>

                <Text style={styles.cardName}>{character.name}</Text>

                <View style={{ display: 'flex', flexDirection: 'column', width: '45%', gap: 10, marginBottom: 10 }}>
                    <Text style={styles.characterInfo}>{STATUS_MAP[character.status]}</Text>
                    <Text style={styles.characterInfo}>{SPECIES_MAP[character.species]}</Text>
                    <Text style={styles.characterInfo}>{GENDER_MAP[character.gender]}</Text>
                </View>
                <View style={styles.card}>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', aligncharacters: 'center' }}>

                        <View style={styles.cardInfoBox}>
                            <Text style={[styles.cardTitle, { fontFamily: 'TradeWinds_400Regular' }]}>
                                Origem
                            </Text>
                            <Text style={styles.cardInfo}>{origin.name}</Text>
                            <Text style={styles.cardInfo}><Text style={{ fontWeight: "700" }}>Tipo: </Text>{origin.type}</Text>
                            <Text style={styles.cardInfo}><Text style={{ fontWeight: "700" }}>Dimensão: </Text>{origin.dimension}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#E4DD7C',
        width: '100%',
        position: 'absolute',
        top: 0,
        paddingTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 140,
        zIndex: 5
    },
    img: {
        maxWidth: "70%"
    },
    body: {
        height: '100%',
        width: "100%",
        backgroundColor: '#b0d9d4',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        paddingTop: 160
    },
    card: {
        backgroundColor: '#66C2E5',
        width: '80%',
        marginHorizontal: '10%',
        marginBottom: 20,
        minHeight: 200,
        borderRadius: 20,
        padding: 15,
        borderColor: '#C0DF40',
        borderWidth: 5,
        borderStyle: 'solid',
        elevation: 10,
        marginTop: 10
    },
    cardName: {
        color: '#04374a',
        fontSize: 40,
        fontWeight: "600",
        fontFamily: 'TradeWinds_400Regular'
    },
    portalImg: {
        height: 180,
        width: '100%',
    },
    characterImg: {
        position: 'absolute',
        top: 15,
        height: 150,
        width: 150,
        borderRadius: 150,
        zIndex: 2,
        elevation: 5,
    },
    portalContainer: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    cardInfoBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        height: 100
    },
    cardInfo: {
        color: '#04374a',
        fontSize: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5
    },
    characterInfo: {
        backgroundColor: '#04374a',
        color: '#eefaffff',
        paddingVertical: 2,
        borderRadius: 20,
        fontSize: 18,
        marginBottom: -2,
        fontWeight: "500",
        textAlign: 'center'
    },
    cardTitle: {
        color: '#04374a',
        fontSize: 25,
        fontWeight: "700",
        fontFamily: 'TradeWinds_400Regular',
        marginBottom: 10
    }
})