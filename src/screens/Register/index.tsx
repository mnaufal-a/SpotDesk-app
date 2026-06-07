import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../config/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gs } from "../../../assets/styles/GlobalStyle";
import InputText from "../../components/inputText";
import { colors } from "../../../assets/styles/Colors";

function Register(): JSX.Element {
    const navigation = useNavigation();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'semua field wajib diisi!');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password minamal 6 karakter!');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name : name} 
            }
        });

        if (error) {
            Alert.alert('Register Gagal!', error.message);
            
        } else {
            Alert.alert(
                'Berhasil✅',
                'Akun berhasil dibuat, silahkan login!',
                [{ text : 'OK', onPress: () => navigation.navigate('Login') }]
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={[Gs.h1, Gs.textBlack, styles.title]}>Buat Akun</Text>
                <Text style={[Gs.textGrey, styles.subtitle]}>
                    Daftar untuk mulai mencari workspace
                </Text>

                <View style={styles.form}>
                    <InputText
                        placeholder="Nama lengkap"
                        value={name}
                        onChangeText={setName} // setiap user ketik, nilai `name` diupdate
                    />
                    <View style={styles.gap} />
                    <InputText
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.gap} />
                    <InputText
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry // ini menyembunyikan teks jadi ***
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister}
                    disabled={loading}> 
                    {/* disabled=true saat loading supaya tidak bisa diklik dua kali */}
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading...' : 'Daftar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[Gs.textGrey, styles.loginText]}>
                        Sudah punya akun? <Text style={Gs.textPrimary}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 32,
    },
    form: {
        marginBottom: 24,
    },
    gap: {
        height: 16, // spacer kosong antar input
    },
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: colors.white,
        ...Gs.font600,
        fontSize: 16,
    },
    loginText: {
        textAlign: 'center',
    },
})

export default Register;