import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom HTML DivIcons to strictly respect design doc colors:
// Coral (#F2765E) for Citizen, Dark Brown (#413333) for Stops, Blue (#315B8C) for Completed
const createStopIcon = (order, isCompleted, isSkipped) => {
  let bgColor = '#413333';
  let label = order;
  if (isCompleted) {
    bgColor = '#315B8C';
    label = '✓';
  } else if (isSkipped) {
    bgColor = '#A04332';
    label = '✕';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: #F5EBDD;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 5px rgba(0,0,0,0.25);
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const createCitizenIcon = () => {
  return L.divIcon({
    className: 'custom-citizen-marker',
    html: `
      <div style="
        background-color: #F2765E;
        color: #F5EBDD;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        border: 3px solid #FFFFFF;
        box-shadow: 0 3px 6px rgba(242,118,94,0.4);
      ">
        📍
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

export const LeafletMap = ({ stops = [], citizenCoordinates = [28.6142, 77.2110], zoneName = 'Sector 12' }) => {
  const center = citizenCoordinates || [28.615, 77.212];

  // Route polyline coordinates connecting ordered stops
  const polylineCoords = useMemo(() => {
    return stops.map((stop) => [stop.lat, stop.lng]);
  }, [stops]);

  const citizenIcon = useMemo(() => createCitizenIcon(), []);

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Polyline in Blue (#315B8C) per Section 5.5 of design.md */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#315B8C',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Citizen Address Pin in Coral (#F2765E) */}
        <Marker position={citizenCoordinates} icon={citizenIcon}>
          <Popup>
            <div style={{ padding: '4px', maxWidth: '200px' }}>
              <strong style={{ color: '#F2765E', fontSize: '13px' }}>Your Registered Address</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#413333' }}>
                Flat 402, Block B, Silver Oak Apartments
              </p>
              <div style={{ marginTop: '4px', fontSize: '11px', color: '#315B8C', fontWeight: 600 }}>
                Scheduled Collection: Tomorrow, 8:00 AM
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Collection Stops in Dark Brown (#413333) or Blue (#315B8C) if completed */}
        {stops.map((stop) => {
          const isCompleted = stop.status === 'completed';
          const isSkipped = stop.status === 'skipped';
          const icon = createStopIcon(stop.order, isCompleted, isSkipped);

          return (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={icon}>
              <Popup>
                <div style={{ padding: '4px', maxWidth: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#315B8C' }}>
                      Stop #{stop.order} of {stops.length}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isCompleted ? 'rgba(49,91,140,0.15)' : isSkipped ? '#FADBD6' : 'rgba(242,118,94,0.15)',
                        color: isCompleted ? '#315B8C' : isSkipped ? '#A04332' : '#D2533B',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    >
                      {stop.status}
                    </span>
                  </div>
                  <strong style={{ fontSize: '13px', color: '#413333' }}>{stop.address}</strong>
                  {isCompleted && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#315B8C' }}>
                      ✓ Cleared at {stop.completedAt}
                    </div>
                  )}
                  {isSkipped && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#A04332' }}>
                      ✕ Skipped: {stop.skipReason}
                    </div>
                  )}
                  {!isCompleted && !isSkipped && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#413333' }}>
                      Expected around: {stop.expectedTime}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(245, 235, 221, 0.95)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          zIndex: 1000,
          color: 'var(--color-dark-brown)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-dark-brown)' }}>Route Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F2765E', display: 'inline-block' }} />
          <span>Your Address</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#315B8C', display: 'inline-block' }} />
          <span>Completed Stop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#413333', display: 'inline-block' }} />
          <span>Pending Route Stop</span>
        </div>
      </div>
    </div>
  );
};
