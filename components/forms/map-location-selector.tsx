"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Navigation } from "lucide-react";

export function MapLocationSelector({
  locationAddress,
  setLocationAddress,
  locationCoordinates,
  setLocationCoordinates
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    // Check if the Google Maps script is already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Create map when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      // Default to a central location if no coordinates yet
      const defaultLocation = locationCoordinates || { lat: -1.2921, lng: 36.8219 }; // Nairobi
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const markerInstance = new window.google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
        animation: window.google.maps.Animation.DROP
      });

      // Get address from coordinates when marker is moved
      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition();
        const newCoords = { lat: position.lat(), lng: position.lng() };
        setLocationCoordinates(newCoords);
        getAddressFromCoordinates(newCoords);
      });

      // Allow clicking on the map to place marker
      mapInstance.addListener("click", (event: { latLng: { lat: () => unknown; lng: () => unknown; }; }) => {
        markerInstance.setPosition(event.latLng);
        const newCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setLocationCoordinates(newCoords);
        getAddressFromCoordinates(newCoords);
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      // If we already have coordinates, update the marker position
      if (locationCoordinates) {
        markerInstance.setPosition(locationCoordinates);
        mapInstance.setCenter(locationCoordinates);
      }
    }
  }, [getAddressFromCoordinates, isLoaded, locationCoordinates, map, setLocationCoordinates]);

  // Function to get address from coordinates (reverse geocoding)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAddressFromCoordinates = useCallback((coords) => {
    if (!isLoaded || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results: { formatted_address: unknown; }[], status: string) => {
      if (status === "OK" && results[0]) {
        setLocationAddress(results[0].formatted_address);
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  });

  // Function to search for a location
  const searchLocation = () => {
    if (!isLoaded || !map || !searchQuery) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: { formatted_address: unknown; }[], status: string) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        
        marker.setPosition(newCoords);
        map.setCenter(newCoords);
        map.setZoom(15);
        
        setLocationCoordinates(newCoords);
        setLocationAddress(results[0].formatted_address);
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (marker && map) {
            marker.setPosition(newCoords);
            map.setCenter(newCoords);
            map.setZoom(16);
          }
          
          setLocationCoordinates(newCoords);
          getAddressFromCoordinates(newCoords);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-address">Location Address</Label>
        <Input
          id="location-address"
          placeholder="E.g., Road name, landmark, area"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search for location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
          className="flex-1"
        />
        <Button type="button" onClick={searchLocation} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button type="button" onClick={getCurrentLocation} variant="outline">
          <Navigation className="h-4 w-4 mr-2" />
          Current
        </Button>
      </div>

      <div 
        ref={mapRef} 
        className="rounded-md border h-[300px] bg-muted flex items-center justify-center"
      >
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}
      </div>

      {locationCoordinates && (
        <p className="text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 inline-block mr-1" />
          Coordinates: {locationCoordinates.lat.toFixed(6)}, {locationCoordinates.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}