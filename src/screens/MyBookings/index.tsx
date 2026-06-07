import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';
import { colors } from '../../../assets/styles/Colors';
import { Gs } from '../../../assets/styles/GlobalStyle';
import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/Header';

function MyBookings(): JSX.Element {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        // Ambil user yang sedang login dulu
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch bookings milik user ini saja
        // .eq('user_id', user?.id) = filter WHERE user_id = id user yang login
        // select('*, workspaces(*)') = ambil semua kolom booking + 
        // data workspace yang terhubung (JOIN)
        const { data, error } = await supabase
            .from('bookings')
            .select('*, workspaces(*)')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false }); // terbaru di atas

        if (error) {
            console.log('Error:', error.message);
        } else {
            setBookings(data || []);
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        // Warna badge berbeda tergantung status booking
        switch(status) {
            case 'pending': return colors.primary;
            case 'confirmed': return '#22c55e'; // hijau
            case 'cancelled': return '#ef4444'; // merah
            default: return colors.grey;
        }
    };

    const formatPrice = (price: number) => {
        return '$' + Number(price).toLocaleString('en-US');
    };

    const renderBookingCard = ({ item }: { item: any }) => {
        const workspace = item.workspaces; // data workspace dari JOIN

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Details', { workspace })}
            >
                <View style={styles.cardLeft}>
                    {/* Gambar workspace */}
                    <Image 
                        source={{ uri: workspace?.image_url }} 
                        style={styles.thumbnail}
                    />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={[Gs.h3, Gs.textBlack]}>{workspace?.name}</Text>
                        {/* Badge status */}
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>
                    <Text style={[Gs.textGrey, styles.address]}>{workspace?.address}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={Gs.textGrey}>{item.total_days} days</Text>
                        <Text style={[Gs.font700, Gs.textPrimary]}>
                            {formatPrice(item.total_price)}
                        </Text>
                    </View>
                    <Text style={[Gs.textGrey, styles.date]}>
                        📅 {item.date_start}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[Gs.h3, Gs.textBlack]}>Belum ada booking</Text>
            <Text style={Gs.textGrey}>Yuk cari workspace dan mulai booking!</Text>
            <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.exploreButtonText}>Explore Workspace</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={() => {
                        navigation.goBack();
                }}>
                    <Image source={require('../../../assets/icons/arrow_left_black.png')}/>
                </TouchableOpacity>
                <Text style={[Gs.h1, Gs.textBlack]}>My Bookings</Text>
                <Text style={Gs.textGrey}>Riwayat booking kamu</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderBookingCard}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    button: {
        width: 24,
        height: 24,
        marginBottom: 12,
        marginLeft: -5,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexGrow: 1,
    },
    card: {
        ...Gs.flexRow,
        borderWidth: 1,
        borderColor: colors.greyContainer,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
    },
    cardLeft: {
        marginRight: 12,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        ...Gs.flexRow,
        ...Gs.justifyBetween,
        ...Gs.itemsCenter,
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    address: {
        fontSize: 12,
        marginBottom: 8,
    },
    cardFooter: {
        ...Gs.flexRow,
        ...Gs.justifyBetween,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    exploreButton: {
        marginTop: 16,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
});

export default MyBookings;