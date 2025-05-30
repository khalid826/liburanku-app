const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} TravelApp. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Tung Tung Tung</p>
      </div>
    </footer>
  );
};

export default Footer;