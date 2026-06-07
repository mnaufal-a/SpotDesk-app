import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../assets/styles/Colors';
import Header from '../../components/Header';
import CardDetail from '../../components/CardDetail';
import { Gs } from '../../../assets/styles/GlobalStyle';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../config/supabase';


function Checkout(): JSX.Element {

  const navigation = useNavigation();

  const [paying, setPaying] = useState(false);

 const handlePaynow = async () => {
    setPaying(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('user_id', user?.id)
        .eq('status', 'pending');

    setPaying(false);

    if (error) {
        Alert.alert('Error', error.message);
    } else {
        navigation.navigate('Success', { workspace });
    }
  };

  const route = useRoute();
  const { workspace, booking } = route.params as {
    workspace: any;
    booking: any;
  }

  const calculateEndDate = () => {
    const start = new Date(booking.date_start);
    start.setDate(start.getDate() + booking.total_days);
    return start.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  
  const tax = Math.round(booking.total_price * 0.15);

  const insurance = 20000;
  const grandTotal = booking.total_price + tax + insurance;

  const formatPrice = (price: number) => {
    return '$' + price.toLocaleString('en-US');
  }

  const checkoutData = [
    {
    label: 'Price per day',
    value: formatPrice(workspace.price),
    isBold:  true,

    },
    {
    label: 'Total days',
    value: `${booking.total_days} days`,
    isBold:  false,
    },
    {
    label: 'Date',
    value: booking.date_start,
    isBold:  false,
    },
    {
    label: 'End',
    value: calculateEndDate(),
    isBold:  false,
    },
    {
    label: 'Tax 15%',
    value: formatPrice(tax),
    isBold:  true,
    },
    {
    label: 'Insurance',
    value: formatPrice(insurance),
    isBold:  true,
    },
    {
    label: 'Grand Total',
    value: formatPrice(grandTotal),
    isBold:  true,
    isPrimary: true,
    },
  ]

  const borderBottom = {
    borderBottomWidth: 1,
    borderColor: colors.greyContainer,
  };

  const renderCheckoutDetail = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Space</Text>
        <CardDetail workspace={workspace}/>
      </View>
    )
  }

  const renderCheckoutData = () => {
    return (
      <View style={styles.section}>
        {
          checkoutData.map((val, idx) => {
            const isLast = idx === checkoutData?.length - 1;
            return (
              <View
                key={idx}
                style={[styles.checkoutItem, !isLast && borderBottom]}
              >
                <Text style={[Gs.textBlack]}>{val.label}</Text>
                <Text style={[
                  Gs.textBlack, 
                  val.isBold && Gs.font700, 
                  val.isPrimary && Gs.textPrimary]}>{val.value}
                </Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  const renderPaymentMethod = () => {
    return(
      <View style={styles.section}>
        <Text style={[styles.paymenttitle]}>Payment</Text>
        <View style={styles.paymentContainer}>
          <TouchableOpacity style={styles.paymentButton}>
            <Image source={require('../../../assets/icons/wallet.png')} />
            <Text style={[Gs.h5, Gs.textBlack]}>MyWallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Image source={require('../../../assets/icons/mastercard.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderPayNow = () => {
    return (
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={handlePaynow}
          disabled={paying}
          >
          <Text style={[Gs.h4, Gs.textWhite]}>{paying ? 'Memproses...' : 'Pay Now'}</Text>
          <Image source={require('../../../assets/icons/pay.png')} style={styles.icon}/>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Checkout" 
        subtitle="Ready to start working?" 
      />
      <View style={styles.content}>
        <ScrollView>
          {renderCheckoutDetail()}
          {renderCheckoutData()}
          {renderPaymentMethod()}
        </ScrollView>
        {renderPayNow()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    
  },
  content: {
    flex: 1,
    ...Gs.justifyBetween,
  },
  sectionTitle: {
      ...Gs.h3,
      ...Gs.textBlack,
      marginBottom: 24,
  },
  section: {
      paddingHorizontal: 24,
      marginBottom: 24,
  },
  checkoutItem : {
    ...Gs.flexRow,
    ...Gs.justifyBetween,
    paddingVertical: 14,
  },
  paymenttitle: {
    ...Gs.h2,
    ...Gs.textBlack,
    marginBottom: 12,
  },
  paymentContainer: {
    ...Gs.flexRow,
    marginHorizontal: -10,
    marginBottom: 30,
  },
  paymentButton: {
    ...Gs.justifyCenter,
    ...Gs.itemsCenter,
    ...Gs.cornerLG,
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 52,
    borderWidth: 1,
    borderColor: colors.greyContainer,
    marginHorizontal: 14,
  },
  proceedButton: {
    ...Gs.flexRow,
    ...Gs.itemsCenter,
    ...Gs.justifyCenter,
    ...Gs.cornerMD,
    backgroundColor: colors.primary,
    padding: 14
  },
  icon: {
    marginLeft: 4,
  },
});

export default Checkout;