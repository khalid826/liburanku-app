import { useState, useEffect } from 'react';

const defaultValues = {
  name: '',
  description: '',
  imageUrl: '',
};

const BannerForm = ({ initialValues = {}, onSubmit, loading }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});

  // Update form values when initialValues change (for editing)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValues({ ...defaultValues, ...initialValues });
    }
  }, [initialValues]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = 'Name is required';
    if (!values.imageUrl) errs.imageUrl = 'Image URL is required';
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
    <form className="space-y-4 p-4 sm:p-6 bg-white rounded shadow max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4">{initialValues.id ? 'Edit' : 'Add'} Banner</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input 
          name="name" 
          value={values.name} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter banner name"
        />
        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          name="description" 
          value={values.description} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          rows={3} 
          placeholder="Enter banner description..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image URL *</label>
        <input 
          name="imageUrl" 
          value={values.imageUrl} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && <div className="text-xs text-red-500 mt-1">{errors.imageUrl}</div>}
      </div>
      
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
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

export default BannerForm;
