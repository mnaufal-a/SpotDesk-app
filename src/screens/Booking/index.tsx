import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { colors } from '../../../assets/styles/Colors';
import Header from '../../components/Header';
import CardDetail from '../../components/CardDetail';
import { Gs } from '../../../assets/styles/GlobalStyle';
import InputText from '../../components/inputText';
import { Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../config/supabase';

function Booking(): JSX.Element {
  const navigation = useNavigation();
  
  // Ambil data workspace yang dikirim dari Details
  const route = useRoute();
  const { workspace } = route.params as { workspace: any };

  // State untuk menyimpan input user di form
  // Setiap field punya state sendiri supaya bisa di-track perubahannya
  const [totalDays, setTotalDays] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    // Validasi — semua field harus diisi
    if (!totalDays || !dateStart || !fullName || !phoneNumber) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Hitung total harga = harga per hari × jumlah hari
    const totalPrice = workspace.price * parseInt(totalDays);

    // Simpan booking ke tabel 'bookings' di Supabase
    const { error } = await supabase
      .from('bookings')
      .insert({
        workspace_id: workspace.id,
        user_id: user?.id,
        user_name: fullName,
        phone_number: phoneNumber,
        date_start: dateStart,
        total_days: parseInt(totalDays),
        total_price: totalPrice,
        status: 'pending',
      });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Kalau berhasil, kirim data ke Checkout untuk ditampilkan
      navigation.navigate('Checkout', { 
        workspace, 
        booking: {
          user_name: fullName,
          phone_number: phoneNumber,
          date_start: dateStart,
          total_days: parseInt(totalDays),
          total_price: totalPrice,
        }
      });
    }
  };

  const renderBookingDetail = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Space</Text>
        {/* Kirim data workspace ke CardDetail supaya tampil info yang benar */}
        <CardDetail workspace={workspace} />
      </View>
    )
  }

  const renderBookingInformation = () => {
    return(
      <View style={styles.section}>
        <Text style={[Gs.h3, Gs.textBlack]}>Booking Information</Text>
        <Text style={[Gs.textGrey]}>Pastikan data valid dan tidak bisa diubah</Text>
        
        {/* Setiap InputText sekarang punya value dan onChangeText */}
        <InputText 
          label="Total days"
          placeholder="Contoh: 3"
          icon={require('../../../assets/icons/days.png')}
          value={totalDays}
          onChangeText={setTotalDays}
        />
        <InputText 
          label="Date start at"
          placeholder="Contoh: 2024-01-22"
          icon={require('../../../assets/icons/calendar.png')}
          value={dateStart}
          onChangeText={setDateStart}
        />
        <InputText 
          label="Complete name"
          placeholder="Nama lengkap kamu"
          icon={require('../../../assets/icons/user.png')}
          value={fullName}
          onChangeText={setFullName}
        />
        <InputText 
          label="Phone number"
          placeholder="Contoh: +62812345678"
          icon={require('../../../assets/icons/phone.png')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
    )
  }

  const renderProceedPayment = () => {
    return(
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.proceedbutton} 
          onPress={handleProceed}
          disabled={loading}>
          <Text style={[Gs.h4, Gs.textWhite]}>
            {loading ? 'Menyimpan...' : 'Proceed to Payment'}
          </Text>
          <Image 
            source={require('../../../assets/icons/arrow_right_white.png')} 
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.termsbutton}>
          <Text style={[Gs.textGrey]}>Read Terms & All Conditions</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Booking" 
        subtitle="Space available for today" 
      />
      <View style={{flex: 1}}>
        <ScrollView>
          {renderBookingDetail()}
          {renderBookingInformation()}
        </ScrollView>
        {renderProceedPayment()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  proceedbutton: {
    ...Gs.flexRow,
    ...Gs.itemsCenter,
    ...Gs.justifyCenter,
    ...Gs.cornerMD,
    backgroundColor: colors.primary,
    padding: 14,
  },
  icon: {
    marginLeft: 4,
  },
  termsbutton: {
    ...Gs.itemsCenter,
    ...Gs.justifyCenter,
    paddingBottom: 14,
  }
});

export default Booking;