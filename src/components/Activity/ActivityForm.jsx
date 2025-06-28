import { useState, useEffect } from 'react';

const defaultValues = {
  title: '',
  description: '',
  categoryId: '',
  imageUrls: [], // always array
  price: '',
  price_discount: '',
  rating: '',
  total_reviews: '',
  facilities: '',
  address: '',
  province: '',
  city: '',
  location_maps: '',
};

const ActivityForm = ({ initialValues = {}, categories = [], onSubmit, onCancel, loading }) => {
  // Ensure imageUrls is always an array
  const initial = { ...defaultValues, ...initialValues };
  if (typeof initial.imageUrls === 'string') initial.imageUrls = initial.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
  if (!Array.isArray(initial.imageUrls)) initial.imageUrls = [];
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  // Update form values when initialValues change (for editing)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      const updatedInitial = { ...defaultValues, ...initialValues };
      if (typeof updatedInitial.imageUrls === 'string') {
        updatedInitial.imageUrls = updatedInitial.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (!Array.isArray(updatedInitial.imageUrls)) {
        updatedInitial.imageUrls = [];
      }
      setValues(updatedInitial);
    }
  }, [initialValues]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'imageUrls') {
      setValues(v => ({ ...v, imageUrls: value.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setValues(v => ({ ...v, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!values.title) errs.title = 'Title is required';
    if (!values.categoryId) errs.categoryId = 'Category is required';
    if (!values.price) errs.price = 'Price is required';
    if (!values.city) errs.city = 'City is required';
    if (!values.province) errs.province = 'Province is required';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      // Format data for API - start with minimal required fields
      const formattedData = {
        title: values.title.trim(),
        categoryId: values.categoryId, // Keep as string (UUID)
        price: parseInt(values.price),
        province: values.province.trim(),
        city: values.city.trim(),
        description: values.description.trim() || '', // Always include description
        imageUrls: values.imageUrls.length > 0 ? values.imageUrls : [],
        // Optional fields - only include if they have values
        ...(values.address.trim() && { address: values.address.trim() }),
        ...(values.price_discount && { price_discount: parseInt(values.price_discount) }),
        ...(values.rating && { rating: parseFloat(values.rating) }),
        ...(values.total_reviews && { total_reviews: parseInt(values.total_reviews) }),
        ...(values.facilities.trim() && { facilities: values.facilities.trim() }),
        ...(values.location_maps.trim() && { location_maps: values.location_maps.trim() }),
      };
      
      console.log('Submitting activity data:', formattedData);
      console.log('Raw form values:', values);
      onSubmit(formattedData);
    }
  };

  return (
    <form className="space-y-4 p-4 sm:p-6 bg-white rounded shadow max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4">{initialValues?.id ? 'Edit' : 'Add'} Activity</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input 
          name="title" 
          value={values.title} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter activity title"
        />
        {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          name="description" 
          value={values.description} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          rows={3} 
          placeholder="Enter activity description"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select 
          name="categoryId" 
          value={values.categoryId} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {errors.categoryId && <div className="text-xs text-red-500 mt-1">{errors.categoryId}</div>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
        <input 
          name="imageUrls" 
          value={values.imageUrls.join(', ')} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input 
            name="price" 
            type="number" 
            value={values.price} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="0"
          />
          {errors.price && <div className="text-xs text-red-500 mt-1">{errors.price}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Price</label>
          <input 
            name="price_discount" 
            type="number" 
            value={values.price_discount} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <input 
            name="rating" 
            type="number" 
            step="0.1"
            min="0"
            max="5"
            value={values.rating} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Reviews</label>
          <input 
            name="total_reviews" 
            type="number" 
            value={values.total_reviews} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Facilities (HTML allowed)</label>
        <textarea 
          name="facilities" 
          value={values.facilities} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          rows={2} 
          placeholder="<ul><li>WiFi</li><li>Parking</li></ul>"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input 
          name="address" 
          value={values.address} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter full address"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Province *</label>
          <input 
            name="province" 
            value={values.province} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Enter province"
          />
          {errors.province && <div className="text-xs text-red-500 mt-1">{errors.province}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input 
            name="city" 
            value={values.city} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Enter city"
          />
          {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Google Maps Embed (iframe HTML)</label>
        <textarea 
          name="location_maps" 
          value={values.location_maps} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          rows={2} 
          placeholder="<iframe src='...' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy'></iframe>"
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold min-w-[100px] transition-colors" 
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="bg-[#0B7582] hover:bg-[#095e68] text-white px-6 py-2 rounded-md font-semibold min-w-[100px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
