import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../../assets/styles/Colors';
import { Gs } from '../../../assets/styles/GlobalStyle';
import { useNavigation, useRoute } from '@react-navigation/native';

function Success(): JSX.Element {
  const navigation = useNavigation();

  // Ambil data workspace yang dikirim dari Checkout
  const route = useRoute();
  const { workspace } = route.params as { workspace: any };

  return (
    <View style={styles.container}>
      <View>
        {/* Gambar dari database, bukan hardcode */}
        <Image 
          source={{ uri: workspace.image_url }} 
          style={styles.image}
        />
        <View style={styles.overlay}>
          <View style={styles.rating}>
            <Image source={require('../../../assets/icons/star_white.png')} />
            {/* Rating dari database */}
            <Text style={[Gs.h5, Gs.textWhite]}>{workspace.rating}/5</Text>
          </View>
          <View style={styles.booked}>
            <Text style={[Gs.h5, Gs.textWhite]}>Booked</Text>
          </View>
          <View style={styles.label}>
            {/* Nama dan alamat dari database */}
            <Text style={[Gs.textWhite, Gs.h2]}>{workspace.name}</Text>
            <Text style={[Gs.textWhite]}>{workspace.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.TextCont}>
        <Text style={[Gs.h1, Gs.textBlack]}>Success Booking</Text>
        <Text style={[Gs.textCenter, Gs.textGrey]}>
          Your space is ready to use for your growing business and life
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.detailbutton}
        onPress={() => {
          // Kembali ke Home setelah booking selesai
          // navigate('Home') lebih baik dari navigate('Details')
          // karena user sudah selesai booking
          navigation.navigate('Home');
        }}
      >
        <Text style={[Gs.h4, Gs.textWhite]}>Back to Home</Text>
        <Image 
          source={require('../../../assets/icons/arrow_right_white.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Gs.justifyCenter,
    ...Gs.itemsCenter,
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    ...Gs.cornerXL,
    width: 240,
    height: 320,
  },
  overlay: {
    ...Gs.cornerXL,
    width: 240,
    height: 320,
    backgroundColor: colors.transparentBlack,
    position: 'absolute',
  },
  rating: {
    ...Gs.itemsCenter,
    ...Gs.justifyCenter,
    ...Gs.cornerLG,
    backgroundColor: colors.primary,
    padding: 14,
    width: 60,
    height: 60,
    position: 'absolute',
    right: -30,
    top: 30,
  },
  booked: {
    ...Gs.itemsCenter,
    ...Gs.justifyCenter,
    ...Gs.cornerLG,
    backgroundColor: colors.primary,
    padding: 8,
    width: 100,
    height: 40,
    position: 'absolute',
    left: -50,
    bottom: 120,
  },
  label: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  TextCont: {
    ...Gs.itemsCenter,
    paddingHorizontal: 76,
    marginVertical: 30,
  },
  icon: {
    marginLeft: 4,
  },
  detailbutton: {
    ...Gs.justifyCenter,
    ...Gs.flexRow,
    ...Gs.itemsCenter,
    ...Gs.cornerMD,
    backgroundColor: colors.primary,
    padding: 18,
  }
});

export default Success;