import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { Gs } from "../../../assets/styles/GlobalStyle";
import { colors } from "../../../assets/styles/Colors";
import { useNavigation } from "@react-navigation/native";

// Definisikan props yang diterima komponen ini
interface CardDetailProps {
    workspace: {
        id: number;
        name: string;
        rating: number;
        image_url: string;
    };
}

// Tambahkan workspace sebagai parameter
function CardDetail({ workspace }: CardDetailProps): JSX.Element {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                {/* Gambar sekarang dari URL database, bukan hardcode */}
                <Image 
                    source={{ uri: workspace.image_url }} 
                    style={styles.tumbnail}
                />
                <View>
                    {/* Nama dari database */}
                    <Text style={[Gs.h2, Gs.textBlack]}>{workspace.name}</Text>
                    <View style={[Gs.flexRow, Gs.itemsCenter]}>
                        <Image 
                            source={require('../../../assets/icons/star_yellow.png')} 
                            style={styles.icon}
                        />
                        {/* Rating dari database */}
                        <Text style={[Gs.h5, Gs.textBlack]}>{workspace.rating}/5</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => {
                // Kirim workspace saat navigate ke Details
                navigation.navigate('Details', { workspace });
            }}>
                <Text style={[Gs.h4, Gs.textPrimary]}>Details</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...Gs.flexRow,
        ...Gs.itemsCenter,
        ...Gs.justifyBetween,
        ...Gs.cornerLG,
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 24,
        borderWidth: 1,
        borderColor: colors.greyContainer,
    },
    leftContent: {
        ...Gs.flexRow,
        ...Gs.itemsCenter
    },
    tumbnail: {
        ...Gs.cornerSM,
        width: 70,
        height: 70,
        marginRight: 12,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 4,
    }
})

export default CardDetail;