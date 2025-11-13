export const getCurrentBrand = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = user.username?.replace('@brand.com', '') || 'himalaya';
  return {
    username: user.username || 'himalaya@brand.com',
    brandName: brand.charAt(0).toUpperCase() + brand.slice(1),
    brandKey: brand.toLowerCase()
  };
};

export const getBrandDisplayName = () => {
  const brand = getCurrentBrand();
  return brand.brandName;
};
