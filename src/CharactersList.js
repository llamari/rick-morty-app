import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export function CharactersList() {
    const [characters, setCharacters] = useState([]);

    async function GetCharacters() {
        const response = await axios.get('https://rickandmortyapi.com/api/character')
        setCharacters(response.data.results);
    }

    useEffect(() => {
        GetCharacters();
    }, [])

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
                        <View style={styles.card}>
                            <Text>{item.name}</Text>
                            <Image source={{ uri: item.image }}
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                    } />
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
        height: 200,
        borderRadius: 20,
        padding: 15,
        borderColor: '#C0DF40',
        borderWidth: 5,
        borderStyle: 'solid'
    }
})