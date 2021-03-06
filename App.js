import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { css } from "./assets/css";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "./config/index.json";
import MapViewDirections from "react-native-maps-directions";

export default function App() {
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async function () {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.LOCATION
      );
      if (status == "granted") {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        // console.log(location)
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      } else {
        throw new Error("Location permission not granted");
      }
    })();
  }, []);

  return (
    <KeyboardAvoidingView style={css.container} behavior="position" enabled>
      <MapView
        style={css.map}
        initialRegion={origin}
        showsUserLocation={true}
        loadingEnabled={true}
        ref={mapEl}
      >
        {destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={config.googleAPI}
            strokeWidth={3}
            onReady={(result) => {
              setDistance(result.distance);
              mapEl.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 50,
                  bottom: 50,
                  left: 50,
                  right: 50,
                },
              });
            }}
          />
        )}
      </MapView>
      <View style={css.search}>
        <GooglePlacesAutocomplete
          placeholder="Para onde vamos ?"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            });
          }}
          query={{
            key: config.googleAPI,
            language: "pt-br",
          }}
          fetchDetails={true}
          styles={{ listView: { height: 100 } }}
        />
        <View>{distance && <Text>Dist??ncia: {distance}M</Text>}</View>
      </View>
    </KeyboardAvoidingView>
  );
}
