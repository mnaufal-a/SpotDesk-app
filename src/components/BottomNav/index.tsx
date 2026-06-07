import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { View, StyleSheet } from "react-native";
import { Gs } from "../../../assets/styles/GlobalStyle";
import { colors } from "../../../assets/styles/Colors";
import { supabase } from "../../config/supabase";
import { useNavigation } from "@react-navigation/native";

function BottomNav(): JSX.Element {
    const navigation = useNavigation();

    const [bookingCount, setBookingCount] = useState(0);

    useEffect(() => {
        fecthBookingCount();
    }, [])

    const fecthBookingCount = async () => {
        const {data : { user } } = await supabase.auth.getUser();

        const { count } = await supabase
            .from('bookings')
            .select('*', { count : 'exact', head: true })
            .eq('user_id', user?.id);
        
        setBookingCount(count || 0);
    }

    const handleLogout = () => {
        // Alert.alert dengan 2 tombol untuk konfirmasi sebelum logout
        // Ini UX yang baik supaya user tidak logout tidak sengaja
        Alert.alert(
            'Logout',
            'Apakah kamu yakin ingin logout?',
            [
                {
                    text: 'Batal',
                    style: 'cancel', // tombol cancel di iOS tampil merah
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        // supabase.auth.signOut() = hapus session dari device
                        // Setelah ini, onAuthStateChange di App.tsx otomatis
                        // detect dan redirect ke Login screen
                        await supabase.auth.signOut();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.activeTab}>
                    <Image source={require('../../../assets/icons/discover.png')}/>
                    <Text style={styles.tabLabel}>Discover</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.tab}
                    onPress={() => navigation.navigate('MyBookings')}
                >
                    <Image source={require('../../../assets/icons/payment.png')} />
                    {bookingCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {bookingCount > 8 ? '8+' : bookingCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                {/* Tombol settings sekarang trigger logout */}
                <TouchableOpacity style={styles.tab} onPress={handleLogout}>
                    <Image source={require('../../../assets/icons/settings.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        paddingVertical: 30,
        paddingHorizontal: 84,
    },
    tabContainer: {
        ...Gs.flexRow,
        ...Gs.justifyBetween
    },
    activeTab: {
        ...Gs.flexRow,
        ...Gs.itemsCenter,
        ...Gs.cornerXS,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: colors.secondary,
    },
    tab: {
        padding: 8,
    },
    tabLabel: {
        fontWeight: '600',
        color: colors.primary,
        marginLeft: 8,
    },
    badge: {
        // Badge diposisikan di pojok kanan atas icon
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
});

export default BottomNav;