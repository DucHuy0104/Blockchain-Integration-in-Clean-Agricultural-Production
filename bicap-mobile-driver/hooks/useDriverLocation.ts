import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDriverLocation = (shipmentId: number | null) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // Update every 10 meters
                },
                async (newLocation: Location.LocationObject) => {
                    setLocation(newLocation);

                    if (shipmentId) {
                        try {
                            const driverId = await AsyncStorage.getItem('driverId');
                            if (driverId) {
                                const locationRef = doc(db, 'driverLocations', driverId);
                                await setDoc(locationRef, {
                                    latitude: newLocation.coords.latitude,
                                    longitude: newLocation.coords.longitude,
                                    shipmentId,
                                    updatedAt: new Date().toISOString(),
                                }, { merge: true });
                            }
                        } catch (error) {
                            console.error('Error updating location in Firebase:', error);
                        }
                    }
                }
            );
        };

        startTracking();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [shipmentId]);

    return { location, errorMsg };
};
