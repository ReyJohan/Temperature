import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [date, setDate] = useState(tomorrow);
    const [show, setShow] = useState(false);
    const [predictedTemperature, setPredictedTemperature] = useState(null);
    const [loading, setLoading] = useState(false);

    const onChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            if (event.type === 'dismissed') {
                // El usuario canceló el picker
                setShow(false);
                return;
            } else {
                // El usuario seleccionó una fecha
                setShow(false); // Oculta el picker en Android
                const currentDate = selectedDate || date;
                setDate(currentDate);
                fetchPredictedTemperature(currentDate);
            }
            } else {
            // En iOS, el picker permanece en pantalla hasta que el usuario lo cierra
            const currentDate = selectedDate || date;
            setDate(currentDate);
        }
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const fetchPredictedTemperature = async (selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const response = await fetch('https://tu-api.com/prediccion', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: formattedDate }),
            });
            const data = await response.json();
            setPredictedTemperature(data.temperature);
            } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo obtener la predicción. Inténtalo de nuevo más tarde.');
            } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient 
            colors={['#add8e6', '#87cefa', '#4682b4', '#1e90ff', '#00008b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Icon name="weather-partly-cloudy" size={80} color="#FFFFFF" />
            <Text style={styles.title}>Predicción de Temperatura</Text>
            <TouchableOpacity style={styles.buttonContainer} onPress={showDatePicker} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Seleccionar Fecha</Text>
            </TouchableOpacity>

            {show && (
            <DateTimePicker
                value={date}
                mode="date"
                display='spinner'
                minimumDate={tomorrow}
                onChange={onChange}
            />
            )}
            {loading && <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />}
            {predictedTemperature !== null && !loading && (
            <View style={styles.result}>
                <Text style={styles.resultText}>
                Fecha seleccionada: {date.toLocaleDateString()}
                </Text>
                <Text style={styles.resultText}>
                Temperatura predicha: {predictedTemperature}°C
                </Text>
            </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#FFFFFF',
        marginBottom: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        backgroundColor: '#1E90FF', 
        borderRadius: 10,           
        paddingVertical: 12,        
        paddingHorizontal: 25,      
        marginTop: 20,
        alignItems: 'center',     
        alignSelf: 'center',    
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',           // Color blanco para el texto
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    result: {
        marginTop: 30,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    resultText: {
        fontSize: 20,
        color: '#000000',
        marginVertical: 5,
        textAlign: 'center',
    },
});

export default HomeScreen;
