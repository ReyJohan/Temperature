import { Stack } from 'expo-router';

export default function Layout() {
  return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#87CEEB' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Ciudad de Bucaramanga' }} />
        </Stack>
    );
}
