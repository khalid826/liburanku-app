import { useState } from 'react';

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

const ActivityForm = ({ initialValues = {}, categories = [], onSubmit, loading }) => {
  // Ensure imageUrls is always an array
  const initial = { ...defaultValues, ...initialValues };
  if (typeof initial.imageUrls === 'string') initial.imageUrls = initial.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
  if (!Array.isArray(initial.imageUrls)) initial.imageUrls = [];
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

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
      onSubmit({ ...values });
    }
  };

  return (
    <form className="space-y-4 p-4 bg-white rounded shadow max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">{initialValues.id ? 'Edit' : 'Add'} Activity</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input name="title" value={values.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={values.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select name="categoryId" value={values.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="">Select category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {errors.categoryId && <div className="text-xs text-red-500 mt-1">{errors.categoryId}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
        <input name="imageUrls" value={values.imageUrls.join(', ')} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input name="price" type="number" value={values.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          {errors.price && <div className="text-xs text-red-500 mt-1">{errors.price}</div>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Discount Price</label>
          <input name="price_discount" type="number" value={values.price_discount} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <input name="rating" type="number" value={values.rating} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Total Reviews</label>
          <input name="total_reviews" type="number" value={values.total_reviews} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Facilities (HTML allowed)</label>
        <textarea name="facilities" value={values.facilities} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input name="address" value={values.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Province *</label>
          <input name="province" value={values.province} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          {errors.province && <div className="text-xs text-red-500 mt-1">{errors.province}</div>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">City *</label>
          <input name="city" value={values.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Google Maps Embed (iframe HTML)</label>
        <textarea name="location_maps" value={values.location_maps} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold min-w-[100px]" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
