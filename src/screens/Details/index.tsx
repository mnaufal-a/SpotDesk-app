import React from 'react';
import { Text, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../../assets/styles/Colors';
import Header from '../../components/Header';
import SliderItem from '../../components/SliderItem';
import { Gs } from '../../../assets/styles/GlobalStyle';
import { useNavigation, useRoute } from '@react-navigation/native';


function Details(): JSX.Element {

  const navigation = useNavigation();

  const route = useRoute();
  const { workspace } = route.params as { workspace: any }

  const slider = [
   
    { uri :  workspace.image_url },
    require('../../../assets/images/item_2_b.png'),
    require('../../../assets/images/item_2_c.png'),
  ]

  const renderSlider = () => {
    return (
      <FlatList 
        data={slider} 
        keyExtractor={({index}) => index}
        renderItem={({item}) => <SliderItem image={item} />} 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.sliderContainer}
        />
    )
  }

  const renderTitle = () => {
    return(
      <View style={[styles.titleContainer]}>
        <View>
          <Text style={[Gs.h1, Gs.textBlack]}>{workspace.name}</Text>
          <Text style={[Gs.textGrey]}>{workspace.address}</Text>
        </View>
        <View style={Gs.flexRow}>
          <Image source={require('../../../assets/icons/star_yellow.png')} />
          <Text style={[Gs.textBlack, Gs.h3]}>{workspace.rating}/5</Text>
        </View>
      </View>
    )
  }

  const renderDescription = () => {
    return (
      <View style={styles.description}>
        <Text style={[Gs.h3, Gs.textBlack, styles.title]}>About</Text>
        <Text style={Gs.textGrey}>{workspace.description}</Text>
      </View>
    )
  };

  const renderOwner = () => {
    return (
      <View style={styles.ownerContainer}>
        <Text style={[Gs.textBlack, Gs.h3, styles.title]}>Space Owner</Text>
        <View style={[Gs.flexRow, Gs.itemsCenter]}>
          <Image 
            source={require('../../../assets/images/profile_2.png')} 
            style={styles.ownerImage} 
          />
          <View>
            <View style={[Gs.flexRow]}>
              <Text>Junebug</Text>
              <Image source={require('../../../assets/icons/verified_orange.png')} 
                style={styles.icon}
              />
            </View>
            <Text style={[Gs.font700, Gs.textBlack]}>@junebug</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderBookingButton = () => {
    return (
      <View style={styles.bookingButton}>
        <View>
          <Text style={[Gs.textPrimary, Gs.h1]}>${workspace.price}</Text>
          <Text style={[Gs.textGrey]}>/day</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate('Booking', { workspace })
          }}>
            <Text style={[Gs.textWhite, Gs.h3]}>Start Booking</Text>
            <Image 
              source={require('../../../assets/icons/arrow_right_white.png')} 
              style={styles.icon}  
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Office Details" 
        subtitle="Space available for today" 
        showRightButton />
      <ScrollView nestedScrollEnabled>
        {renderSlider()}
        {renderTitle()}
        {renderDescription()}
        {renderOwner()}
      </ScrollView>
      {renderBookingButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    
  },
  sliderContainer: {
    paddingHorizontal: 24,
  },
  titleContainer: {
    ...Gs.flexRow,
    ...Gs.justifyBetween,
    ...Gs.itemsCenter,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 10,
  },
  description: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  ownerContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  ownerImage: {
    marginRight: 12,
  },
  icon: {
    marginLeft: 4,

  },
  bookingButton: {
    ...Gs.flexRow,
    ...Gs.justifyBetween,
    padding: 24,
  },
  button: {
    ...Gs.flexRow,
    ...Gs.cornerMD,
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: colors.primary
  }
});

export default Details;