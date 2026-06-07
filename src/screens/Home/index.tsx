import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../assets/styles/Colors';
import { Gs } from '../../../assets/styles/GlobalStyle';
import InputText from '../../components/inputText';
import { FlatList } from 'react-native';
import NewsworthyItem from '../../components/NewsworthyItem';
import BottomNav from '../../components/BottomNav';
import { supabase } from '../../config/supabase';


function Home(): JSX.Element {
    const navigation = useNavigation();

    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        supabase.auth.getUser().then(({ data: {user} }) => {
            setUser(user);
        })
    }, [])

    const [workspaces, SetWorkspaces] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [seacrhQuery, setSearchQuery] = useState('');

    const filteredWorkspaces = workspaces.filter(item =>
        item.name.toLowerCase().includes(seacrhQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(seacrhQuery.toLowerCase())
    )

    const fecthWorksSpace = async () => {
        console.log('fetchWorkspaces called!');
        const {data, error } = await supabase
            .from('workspaces')
            .select('*');
        if (error) {
            console.log('Error : ', error.message);
        } else {
            console.log('Data :', data);
            SetWorkspaces(data)
        }
        setLoading(false);
    }

    React.useEffect(() => {
        console.log('useEffect called!');
        fecthWorksSpace();
    }, []);

    const handlePress = (workspace : any) => {
        navigation.navigate('Details', { workspace });
    }

    const newswhortyData = filteredWorkspaces.slice(1).map(item => ({
        title: item.name,
        address: item.address,
        price: `$${item.price}/day`,
        image: { uri: item.image_url },
    }));

    const renderHeader = () => {

        const displayName = user?.user_metadata?.full_name || user?.email || 'User';

        const initials = displayName 
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        return (
            <View style={styles.headerContainer}>
                <View style={[Gs.flexRow, styles.boxLeft, ]}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View>
                        <Text style={Gs.textBlack}>Hi, {displayName} 👋</Text>
                        <Text style={[Gs.font700, Gs.textBlack]}>{ user?.email || ''}</Text>
                    </View>
                </View>
                <View style={Gs.flexRow}>
                    <Image 
                        source={require('../../../assets/icons/gift.png')} 
                        style={styles.iconContainer} 
                    />
                    <Image 
                        source={require('../../../assets/icons/notification.png')} 
                        style={styles.iconContainer} 
                    />
                </View>
                <View></View>
            </View>
        ); 
                
    }

    const renderSearch = () => {
        return (
            <View style={styles.sectionContainer}>
                <InputText
                    icon={require('../../../assets/icons/location.png')}
                    placeholder="Find work spaces in Jakarta"
                    value={seacrhQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        );
    }

    const renderPopularSection = () => {
        const popular = filteredWorkspaces[0]; // ambil workspace pertama
        if (!popular) {
            return (
                <View style={[styles.sectionContainer, {alignItems: 'center', paddingTop: 20}]}>
                    <Text style={Gs.textGrey}>Workspace tidak ditemukan!</Text>
                </View>
            )
        }

        return (
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, Gs.h1]}>
                    {seacrhQuery ? 'Results' : 'Popular'}
                </Text>
                <TouchableOpacity onPress={() => handlePress(popular)}>
                    <View style={Gs.flexRow}>
                        <Image 
                            source={{ uri: popular.image_url }} 
                            style={styles.popularMainImage} />
                        <View>
                            <Image 
                                source={require('../../../assets/images/item_1_b.png')} 
                                style={styles.popularImage} />
                            <Image 
                                source={require('../../../assets/images/item_1_c.png')} 
                                style={styles.popularImage} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.popularContent}>
                    <View>
                        <Text style={[Gs.h2, Gs.textBlack]}>{popular.name}</Text>
                        <Text style={Gs.textGrey}>{popular.address}</Text>
                    </View>
                    <View style={styles.popularPriceContainer}>
                        <Text style={styles.popularPriceLabel}>${popular.price}/days</Text>
                    </View>
                </View>
            </View>
        )
    };

    const renderNewsworthy = () => {
        return (
            <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, Gs.h1]}>Newsworthy</Text>
                <FlatList 
                    horizontal
                    showHorizontalScrollIndicator={false}
                    data={newswhortyData}
                    keyExtractor={item => item.title}
                    renderItem={({item}) => 
                        <NewsworthyItem 
                            title={item.title}
                            address={item.address}
                            price={item.price}
                            image={item.image}
                            onPress={() => handlePress(item)} 
                        />}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                {renderHeader()}
                {renderSearch()}
                {loading ? (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.scrollContainer}>
                        {renderPopularSection()}
                        {renderNewsworthy()}
                    </ScrollView>
                )}
            </View>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContainer: {
    ...Gs.flexRow,
    ...Gs.itemsCenter,
    ...Gs.justifyBetween,
    padding: 24,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,           // bulat sempurna
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
    avatarText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
  boxLeft: {
    marginRight: 125,
  },
  profileContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  popularMainImage: {
    ...Gs.cornerXL,
    width: 220,
    height: 200,
    marginRight: 10,
  },
  popularImage: {
    ...Gs.cornerMD,
    width: 130,
    height: 95,
    marginBottom: 10,
  },
  sectionTitle: {
    ...Gs.textBlack,
    marginBottom: 12,
  },
  popularContent: {
    ...Gs.flexRow,
    ...Gs.justifyBetween,

  },
  popularPriceContainer: {
    ...Gs.justifyCenter,
    ...Gs.itemsCenter,
    ...Gs.cornerXS,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.secondary
  },
  popularPriceLabel: {
    ...Gs.font600,
    ...Gs.textPrimary
  },
  scrollContainer: {
    height: '100%',

  },
  
});

export default Home;