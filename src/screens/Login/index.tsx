import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../config/supabase';
import { colors } from '../../../assets/styles/Colors';
import { Gs } from '../../../assets/styles/GlobalStyle';
import InputText from '../../components/inputText';

function Login(): JSX.Element {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email dan password harus diisi!');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            Alert.alert('Login Gagal', error.message);
        } else {
            navigation.navigate('Home');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={[Gs.h1, Gs.textBlack, styles.title]}>Welcome Back!</Text>
                <Text style={[Gs.textGrey, styles.subtitle]}>Login ke akun kamu</Text>

                <View style={styles.form}>
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
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogin}
                    disabled={loading}>
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={[Gs.textGrey, styles.registerText]}>
                        Belum punya akun? <Text style={Gs.textPrimary}>Daftar</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
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
        height: 16,
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
    registerText: {
        textAlign: 'center',
    },
});

export default Login;