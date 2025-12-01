import axios from "axios";
import { useFonts } from "expo-font";
import { TradeWinds_400Regular } from '@expo-google-fonts/trade-winds';
import { useEffect, useState, useCallback } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';

export const STATUS_MAP = {
    Alive: "Vivo",
    Dead: "Morto",
    unknown: "Desconhecido"
};

export const SPECIES_MAP = {
    Human: "Humano",
    Alien: "Alienígena",
    Humanoid: "Humanoide",
    Poopybutthole: "Poopybutthole",
    Mythological: "Mitológico",
    Animal: "Animal",
    Robot: "Robô",
    Cronenberg: "Cronenberg",
    Disease: "Doença",
    unknown: "Desconhecido"
};

export function CharactersList() {
    const [characters, setCharacters] = useState([]);
    const [nextPage, setNextPage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    let [fontsLoaded] = useFonts({
        TradeWinds_400Regular
    });

    async function GetCharacters() {
        const response = await axios.get('https://rickandmortyapi.com/api/character')

        setCharacters(response.data.results);
        setNextPage(response.data.info.next);
    }

    const loadMoreData = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        const newData = await fetch(nextPage)
            .then(response => response.json());

        setCharacters(prevData => [...prevData, ...newData.results]);
        setNextPage(newData.info.next);
        setIsLoading(false);
    }, [isLoading, nextPage]);


    const handleEndReached = () => {
        if (nextPage !== null) {
            loadMoreData();
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" />
            </View>
        );
    };

    useEffect(() => {
        GetCharacters();
    }, [])

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View>
            <View style={styles.header}>
                <Image resizeMode="contain" source={require("../assets/logo.png")} style={styles.img} />
            </View>
            <View style={styles.body}>
                <FlatList
                    data={characters}
                    keyExtractor={(char) => char.id.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("CharacterDetails", { id: item.id })}
                        >
                            <Text style={styles.cardName}>{item.name}</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Image source={{ uri: item.image }}
                                    style={styles.cardImg}
                                />
                                <View style={styles.cardInfoBox}>
                                    <Text style={styles.cardInfo}><Text style={{ fontWeight: "700" }}>Status: </Text>{STATUS_MAP[item.status]}</Text>
                                    <Text style={styles.cardInfo}><Text style={{ fontWeight: "700" }}>Espécie: </Text>{SPECIES_MAP[item.species]}</Text>
                                    <Text style={styles.cardInfo}><Text style={{ fontWeight: "700" }}>Origem: </Text>{item.origin.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter} />
            </View>
        </View>
    )
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
        justifyContent: 'center',
        gap: 5,
        paddingTop: 160
    },
    card: {
        backgroundColor: '#66C2E5',
        maxWidth: '80%',
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
        fontSize: 25,
        fontWeight: "600",
        fontFamily: 'TradeWinds_400Regular',
        marginBottom: 10
    },
    cardImg: {
        height: 100,
        width: 100,
        borderRadius: 15
    },
    cardInfoBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        height: 100,
        width: '50%'
    },
    cardInfo: {
        color: '#04374a',
        fontSize: 15
    }
})