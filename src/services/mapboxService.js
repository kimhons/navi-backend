const mbxClient = require('@mapbox/mapbox-sdk');
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxOptimization = require('@mapbox/mapbox-sdk/services/optimization');

const baseClient = mbxClient({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
const directionsService = mbxDirections(baseClient);
const geocodingService = mbxGeocoding(baseClient);
const optimizationService = mbxOptimization(baseClient);

/**
 * Get route between two points
 * @param {Array} origin - [longitude, latitude]
 * @param {Array} destination - [longitude, latitude]
 * @param {Array} waypoints - Optional waypoints
 * @param {Object} options - Route options
 * @returns {Promise<Object>} - Route data
 */
exports.getRoute = async (origin, destination, waypoints = [], options = {}) => {
  try {
    const coordinates = [origin, ...waypoints, destination];
    
    const request = directionsService.getDirections({
      profile: options.profile || 'driving-traffic',
      waypoints: coordinates.map(coord => ({ coordinates: coord })),
      geometries: 'geojson',
      overview: 'full',
      steps: true,
      alternatives: options.alternatives || true,
      continue_straight: false,
      annotations: ['distance', 'duration', 'speed']
    });

    const response = await request.send();
    return response.body;
  } catch (error) {
    console.error('Mapbox routing error:', error);
    throw new Error('Failed to get route');
  }
};

/**
 * Geocode address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} - Coordinates and place data
 */
exports.geocodeAddress = async (address) => {
  try {
    const request = geocodingService.forwardGeocode({
      query: address,
      limit: 1
    });

    const response = await request.send();
    
    if (response.body.features.length === 0) {
      throw new Error('Address not found');
    }

    const feature = response.body.features[0];
    
    return {
      coordinates: feature.geometry.coordinates,
      placeName: feature.place_name,
      placeType: feature.place_type,
      context: feature.context
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode address');
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Promise<Object>} - Address data
 */
exports.reverseGeocode = async (coordinates) => {
  try {
    const request = geocodingService.reverseGeocode({
      query: coordinates,
      limit: 1
    });

    const response = await request.send();
    
    if (response.body.features.length === 0) {
      throw new Error('Location not found');
    }

    const feature = response.body.features[0];
    
    return {
      address: feature.place_name,
      placeType: feature.place_type,
      context: feature.context
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to reverse geocode');
  }
};

/**
 * Optimize route with multiple waypoints
 * @param {Array} waypoints - Array of [longitude, latitude]
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} - Optimized route
 */
exports.optimizeRoute = async (waypoints, options = {}) => {
  try {
    const request = optimizationService.getOptimization({
      profile: options.profile || 'driving',
      waypoints: waypoints.map(coord => ({ coordinates: coord })),
      geometries: 'geojson',
      overview: 'full',
      steps: true,
      source: options.source || 'first',
      destination: options.destination || 'last',
      roundtrip: options.roundtrip !== undefined ? options.roundtrip : false
    });

    const response = await request.send();
    return response.body;
  } catch (error) {
    console.error('Route optimization error:', error);
    throw new Error('Failed to optimize route');
  }
};

/**
 * Get distance matrix between multiple points
 * @param {Array} origins - Array of origin coordinates
 * @param {Array} destinations - Array of destination coordinates
 * @returns {Promise<Object>} - Distance matrix
 */
exports.getDistanceMatrix = async (origins, destinations) => {
  try {
    // Mapbox doesn't have a dedicated matrix API, so we'll use directions
    const results = [];
    
    for (const origin of origins) {
      const row = [];
      for (const destination of destinations) {
        const route = await this.getRoute(origin, destination);
        row.push({
          distance: route.routes[0].distance,
          duration: route.routes[0].duration
        });
      }
      results.push(row);
    }
    
    return { matrix: results };
  } catch (error) {
    console.error('Distance matrix error:', error);
    throw new Error('Failed to calculate distance matrix');
  }
};

/**
 * Search for places
 * @param {string} query - Search query
 * @param {Array} proximity - Optional proximity coordinates [lng, lat]
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Search results
 */
exports.searchPlaces = async (query, proximity = null, options = {}) => {
  try {
    const request = geocodingService.forwardGeocode({
      query,
      proximity: proximity ? { coordinates: proximity } : undefined,
      types: options.types || ['poi', 'address'],
      limit: options.limit || 10
    });

    const response = await request.send();
    
    return response.body.features.map(feature => ({
      id: feature.id,
      name: feature.text,
      placeName: feature.place_name,
      coordinates: feature.geometry.coordinates,
      placeType: feature.place_type,
      relevance: feature.relevance
    }));
  } catch (error) {
    console.error('Place search error:', error);
    throw new Error('Failed to search places');
  }
};

module.exports = exports;
