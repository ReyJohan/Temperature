import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = () => {
    const [date, setDate] = useState(new Date());
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
        <View style={styles.container}>
            <Text style={styles.title}>Predicción de Temperatura</Text>
            <View style={styles.buttonContainer}>
                <Button onPress={showDatePicker} title="Seleccionar Fecha" color="#1E90FF" />
            </View>

            {show && (
            <DateTimePicker
                value={date}
                mode="date"
                display='spinner'
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 días en el futuro
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
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
        width: '80%',
        marginTop: 20,
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
