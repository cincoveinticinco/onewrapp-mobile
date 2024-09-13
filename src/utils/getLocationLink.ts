const generateLocationLink = (lat: string, lng: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

export default generateLocationLink;